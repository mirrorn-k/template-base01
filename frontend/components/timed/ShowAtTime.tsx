// ShowAtTime.tsx（修正版：粒度キー & タイマー非延長）
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type CronLike = string | string[];

export type ShowAtTimeProps = {
  startAt?: string | Date;
  endAt?: string | Date;
  /** フィールド順: 「日 曜 時 分 秒」 例: "* * 12 0 0" */
  cron?: CronLike;
  windowMs?: number;
  mountWhenVisible?: boolean;
  tickMs?: number;
  hideAfterAnimation?: boolean;
  onShow?: () => void;
  onHide?: () => void;
  fallback?: React.ReactNode;
  tzOffsetMinutes?: number;
  debug?: boolean;
  children: React.ReactNode;
};

function toMs(v?: string | Date) {
  if (!v) return undefined;
  return v instanceof Date ? v.getTime() : new Date(v).getTime();
}

function localFromMs(nowMs: number, tzMin: number) {
  const d = new Date(nowMs + tzMin * 60_000);
  return {
    d,
    Y: d.getUTCFullYear(),
    M: d.getUTCMonth() + 1,
    D: d.getUTCDate(),
    h: d.getUTCHours(),
    m: d.getUTCMinutes(),
    s: d.getUTCSeconds(),
    w: d.getUTCDay(), // 0=日
  };
}

type CronPartMatcher = (n: number) => boolean;
type CronPartMeta =
  | { kind: "any" }
  | { kind: "step"; n: number }
  | { kind: "single"; v: number }
  | { kind: "set"; values: Set<number> }
  | { kind: "range"; a: number; b: number };

type Cron5 = {
  raw: string;
  // 生の文字列
  pDay: string;
  pDow: string;
  pH: string;
  pM: string;
  pS: string;
  // マッチャ
  matchDay: CronPartMatcher; // 1..31
  matchDow: CronPartMatcher; // 0..6
  matchH: CronPartMatcher; // 0..23
  matchM: CronPartMatcher; // 0..59
  matchS: CronPartMatcher; // 0..59
  // 秒のメタ（粒度判定に使用）
  secMeta: CronPartMeta;
};

function buildMatcherWithMeta(
  part: string,
  min: number,
  max: number
): { fn: CronPartMatcher; meta: CronPartMeta } {
  const p = part.trim();
  if (p === "*") return { fn: () => true, meta: { kind: "any" } };

  const rangeStep = p.match(/^(\d+)-(\d+)\/(\d+)$/);
  if (rangeStep) {
    let a = Number(rangeStep[1]),
      b = Number(rangeStep[2]);
    const n = Math.max(1, Number(rangeStep[3]));
    if (a > b) [a, b] = [b, a];
    a = Math.max(min, Math.min(max, a));
    b = Math.max(min, Math.min(max, b));
    return {
      fn: (v) => v >= a && v <= b && (v - a) % n === 0,
      meta: { kind: "step", n }, // 範囲+ステップでも「n秒粒度」とみなす
    };
  }

  const range = p.match(/^(\d+)-(\d+)$/);
  if (range) {
    let a = Number(range[1]),
      b = Number(range[2]);
    if (a > b) [a, b] = [b, a];
    a = Math.max(min, Math.min(max, a));
    b = Math.max(min, Math.min(max, b));
    return {
      fn: (v) => v >= a && v <= b,
      meta: { kind: "range", a, b },
    };
  }

  const step = p.match(/^\*\/(\d+)$/);
  if (step) {
    const n = Math.max(1, Number(step[1]));
    return { fn: (v) => (v - min) % n === 0, meta: { kind: "step", n } };
  }

  if (p.includes(",")) {
    const set = new Set(
      p
        .split(",")
        .map((x) => Number(x.trim()))
        .filter((x) => Number.isFinite(x) && x >= min && x <= max)
    );
    return { fn: (v) => set.has(v), meta: { kind: "set", values: set } };
  }

  const num = Number(p);
  if (Number.isFinite(num) && num >= min && num <= max) {
    return { fn: (v) => v === num, meta: { kind: "single", v: num } };
  }

  // 不正 → 常に偽
  return { fn: () => false, meta: { kind: "set", values: new Set<number>() } };
}

function parseCron5(cron?: CronLike): Cron5[] {
  if (!cron) return [];
  const list = (Array.isArray(cron) ? cron : [cron])
    .map((s) => s.trim())
    .filter(Boolean);
  return list
    .map((raw) => {
      const parts = raw.split(/\s+/);
      if (parts.length !== 5) return null;
      const [cDay, cDow, cH, cM, cS] = parts;

      const day = buildMatcherWithMeta(cDay, 1, 31);
      const dow = buildMatcherWithMeta(cDow, 0, 6);
      const hh = buildMatcherWithMeta(cH, 0, 23);
      const mm = buildMatcherWithMeta(cM, 0, 59);
      const ss = buildMatcherWithMeta(cS, 0, 59);

      return {
        raw,
        pDay: cDay,
        pDow: cDow,
        pH: cH,
        pM: cM,
        pS: cS,
        matchDay: day.fn,
        matchDow: dow.fn,
        matchH: hh.fn,
        matchM: mm.fn,
        matchS: ss.fn,
        secMeta: ss.meta,
      } as Cron5;
    })
    .filter(Boolean) as Cron5[];
}

/** 粒度に応じたスロットキー（同じキー内では1回しか発火しない） */
function makeSlotKey(entry: Cron5, L: ReturnType<typeof localFromMs>) {
  const { Y, M, D, h, m, s, w } = L; // wも入れておく（同じ“分”でも曜日/日が違えば別キー）
  const base = `${Y}-${String(M).padStart(2, "0")}-${String(D).padStart(
    2,
    "0"
  )}(${w}) ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

  switch (entry.secMeta.kind) {
    case "any":
      // 秒=* → 分単位で1回
      return base; // 秒を含めない
    case "step": {
      const n = entry.secMeta.n;
      const bucket = Math.floor(s / n) * n;
      return `${base}:${String(bucket).padStart(2, "0")}`; // n秒バケット
    }
    default:
      // single / set / range → その秒ごと
      return `${base}:${String(s).padStart(2, "0")}`;
  }
}

export default function ShowAtTime({
  startAt,
  endAt,
  cron,
  windowMs,
  mountWhenVisible = true,
  tickMs = 250,
  hideAfterAnimation = false,
  onShow,
  onHide,
  fallback = null,
  tzOffsetMinutes = 540,
  debug = false,
  children,
}: ShowAtTimeProps) {
  const [now, setNow] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);

  // 追加: 発火ごとに増えるキー
  const [renderKey, setRenderKey] = useState(0);

  const startMs = useMemo(() => toMs(startAt), [startAt]);
  const endMs = useMemo(() => toMs(endAt), [endAt]);
  const hasAbsWindow = startMs !== undefined || endMs !== undefined;

  const cronList = useMemo(() => parseCron5(cron), [cron]);

  const lastSlotKey = useRef<string | null>(null);
  const autoHideTimer = useRef<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), tickMs);
    return () => clearInterval(id);
  }, [tickMs]);

  // デバッグ
  const debugState = useRef<{
    fired: boolean;
    reason: string[];
    slotKey?: string;
  }>({
    fired: false,
    reason: [],
  });

  useEffect(() => {
    if (now === null) return;

    const L = localFromMs(now, tzOffsetMinutes);
    const reasons: string[] = [];

    // 1) 絶対ウィンドウ
    let inAbsWindow = true;
    if (hasAbsWindow) {
      inAbsWindow =
        (startMs === undefined || now >= startMs) &&
        (endMs === undefined || now <= endMs);
      reasons.push(`AbsWindow=${inAbsWindow ? "IN" : "OUT"}`);
    } else {
      reasons.push("AbsWindow=SKIP");
    }

    // 2) cron マッチ（マッチした“式”に対して粒度キーを使い、同キー内で1回だけ発火）
    let cronFired = false;
    let slotKey: string | undefined;

    if (cronList.length > 0) {
      // 最初にヒットした式を使う（複数式が同時マッチでも1回だけ）
      const matched = cronList.find(
        (c) =>
          c.matchDay(L.D) &&
          c.matchDow(L.w) &&
          c.matchH(L.h) &&
          c.matchM(L.m) &&
          c.matchS(L.s)
      );
      if (matched) {
        slotKey = makeSlotKey(matched, L);
        reasons.push(`CronMatch=YES SlotKey=${slotKey}`);
        if (lastSlotKey.current !== slotKey) {
          lastSlotKey.current = slotKey;
          cronFired = true;
          reasons.push("CronEdge=FIRE");
        } else {
          reasons.push("CronEdge=ALREADY_FIRED");
        }
      } else {
        reasons.push("CronMatch=NO");
      }
    } else {
      reasons.push("Cron=NONE");
    }

    // 3) 表示条件
    const shouldShow =
      cronList.length > 0 ? cronFired && inAbsWindow : inAbsWindow;

    // 4) 反映 & タイマー（※可視中は再起動しない）
    if (shouldShow) {
      if (!visible) {
        // ★ 発火のたびにキー更新 → 子を再マウント → CSSアニメが毎回走る
        setRenderKey((k) => k + 1);

        setVisible(true);
        onShow?.();

        if (windowMs && windowMs > 0) {
          if (autoHideTimer.current) window.clearTimeout(autoHideTimer.current);
          autoHideTimer.current = window.setTimeout(() => {
            setVisible(false);
            onHide?.();
            autoHideTimer.current = null;
          }, windowMs) as unknown as number;
        }
      }
    } else {
      // cronなし & ウィンドウ外 → 閉じる
      if (cronList.length === 0 && visible) {
        setVisible(false);
        onHide?.();
        if (autoHideTimer.current) {
          window.clearTimeout(autoHideTimer.current);
          autoHideTimer.current = null;
        }
        reasons.push("Close=AbsWindowOut");
      }
    }

    debugState.current = { fired: cronFired, reason: reasons, slotKey };
  }, [
    now,
    tzOffsetMinutes,
    hasAbsWindow,
    startMs,
    endMs,
    cronList,
    visible,
    onShow,
    onHide,
    windowMs,
  ]);

  // アニメ終了で非表示
  useEffect(() => {
    if (!hideAfterAnimation) return;
    const el = wrapperRef.current;
    if (!el) return;
    const onEnd = () => {
      if (visible) {
        setVisible(false);
        onHide?.();
        if (autoHideTimer.current) {
          window.clearTimeout(autoHideTimer.current);
          autoHideTimer.current = null;
        }
      }
    };
    el.addEventListener("animationend", onEnd);
    return () => el.removeEventListener("animationend", onEnd);
  }, [hideAfterAnimation, visible, onHide]);

  if (now === null) return null;

  const L = localFromMs(now, tzOffsetMinutes);
  const absStart =
    startMs !== undefined ? localFromMs(startMs, tzOffsetMinutes) : null;
  const absEnd =
    endMs !== undefined ? localFromMs(endMs, tzOffsetMinutes) : null;

  const core = mountWhenVisible ? (
    visible ? (
      <div key={renderKey} ref={wrapperRef}>
        {children}
      </div>
    ) : (
      <>{fallback}</>
    )
  ) : (
    <div
      key="static" // ここは固定のまま
      ref={wrapperRef}
      data-visible={visible}
      style={{ display: visible ? "block" : "none" }}
    >
      {children}
    </div>
  );

  const weekdayJa = ["日", "月", "火", "水", "木", "金", "土"][L.w];

  return (
    <>
      {core}
      {debug && (
        <div
          style={{
            position: "fixed",
            right: 12,
            bottom: 12,
            zIndex: 99999,
            padding: "10px 12px",
            borderRadius: 8,
            background: "rgba(0,0,0,0.7)",
            color: "#fff",
            fontSize: 12,
            lineHeight: 1.4,
            maxWidth: 460,
            pointerEvents: "none",
            whiteSpace: "pre-wrap",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 6 }}>
            ShowAtTime debug
          </div>
          <div>
            now(local): {L.Y}-{String(L.M).padStart(2, "0")}-
            {String(L.D).padStart(2, "0")}({weekdayJa}){" "}
            {String(L.h).padStart(2, "0")}:{String(L.m).padStart(2, "0")}:
            {String(L.s).padStart(2, "0")}
          </div>
          {absStart && (
            <div>
              startAt(local): {absStart.Y}-{String(absStart.M).padStart(2, "0")}
              -{String(absStart.D).padStart(2, "0")}{" "}
              {String(absStart.h).padStart(2, "0")}:
              {String(absStart.m).padStart(2, "0")}:
              {String(absStart.s).padStart(2, "0")}
            </div>
          )}
          {absEnd && (
            <div>
              endAt(local): {absEnd.Y}-{String(absEnd.M).padStart(2, "0")}-
              {absEnd.D} {String(absEnd.h).padStart(2, "0")}:
              {String(absEnd.m).padStart(2, "0")}:
              {String(absEnd.s).padStart(2, "0")}
            </div>
          )}
          <div>visible: {String(visible)}</div>
          <div>
            cron:{" "}
            {cron ? (Array.isArray(cron) ? cron.join(" | ") : cron) : "(none)"}
          </div>
          <div>firedThisTick: {String(debugState.current.fired)}</div>
          <div>slotKey: {debugState.current.slotKey ?? "(none)"}</div>
          <div>reason: {debugState.current.reason.join(" / ")}</div>
          <div style={{ opacity: 0.7, marginTop: 6 }}>
            粒度キー: 秒=* → 分単位 / 秒=*/n → n秒バケット / その他 → 秒単位
          </div>
        </div>
      )}
    </>
  );
}
