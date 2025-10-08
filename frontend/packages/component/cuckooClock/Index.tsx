import React, { useEffect, useRef, useState } from "react";
import * as PendulumComp from "./Pendulum";
import SplitClockReveal from "./SplitClockReveal";
import SpeakerPulse from "../effect/SpeakerPulse";
import DoorSound from "./DoorSound";
import * as SoundPlayer from "../media/SoundPlayer";

/**
 * CuckooClock（鳩時計アニメーション）
 *
 * 設計概要
 * -------------------------------------------------
 * ■ コンセプト
 *  - 鳩時計の「扉が開く → 鳩が出る → 鳴く(複数回) → 鳩が戻る → 扉が閉じる」を
 *    状態機械で表現し、スケジューラで発火する。
 *
 * ■ モード
 *  - realtime: 実時間に同期して鳴く（毎時 or 毎分）。
 *  - interval: デモ用。一定間隔で自動発火。
 *  - manual: 親から trigger() を呼んで発火。
 *
 * ■ 主要ステート（FSM）
 *  - idle → prepare → doorOpening → birdOut → chirp(n回) → birdIn → doorClosing → rest → idle
 *  - once=true の場合、発火中は再入禁止。
 *
 * ■ アニメーション
 *  - Framer Motion を利用。扉: rotateY, 鳩: x で往復。
 *  - デフォルト eazings: cubic-bezier(0.2, 0.7, 0.2, 1)
 *
 * ■ サウンド
 *  - WebAudio API で簡易「クックー」2音を n 回再生（省電力・無音許容）。
 *
 * ■ アクセシビリティ
 *  - aria-live="polite" で鳴動テキストを発話可能。
 *
 * ■ デバッグ
 *  - 現在時刻、次回発火まで、現在状態などを小さく表示。
 *
 * 使用例
 * -------------------------------------------------
 * <CuckooClock mode="realtime" strikeOn="hour" debug />
 * <CuckooClock mode="interval" intervalMs={8000} />
 * <CuckooClock mode="manual" ref={ref} />
 *
 * API（主な props）
 * -------------------------------------------------
 * mode: 'realtime' | 'interval' | 'manual'
 * strikeOn: 'hour' | 'minute' // realtime 用
 * intervalMs: number // interval 用
 * doorOpenMs, birdOutMs, stayMs, birdInMs, doorCloseMs: number
 * doorOpenDeg: number // 扉の開き角度
 * birdTravelPx: number // 鳩の移動距離
 * easing: string | [number, number, number, number]
 * once: boolean // 実行中の再入防止
 * withSound: boolean
 * volume: 0..1
 * strikeResolver?: (date: Date) => number // リアルタイムの鳴数
 * onStrikeStart?: (count: number, date: Date) => void
 * onStrikeEnd?: (date: Date) => void
 * debug?: boolean
 */

export type pendulumType = "main" | "pendulum" | "none";

export type CuckooClockProps = {
  mode?: "realtime" | "interval" | "manual";
  strikeOn?: "hour" | "minute"; // realtime
  intervalMs?: number; // interval
  once?: boolean;
  doorOpenMs?: number;
  birdOutMs?: number;
  birdInMs?: number;
  doorCloseMs?: number;
  doorOpenDeg?: number;
  birdTravelPx?: number;
  strikeResolver?: (date: Date) => number;
  onStrikeStart?: (count: number, date: Date) => void;
  onStrikeEnd?: (date: Date) => void;
  className?: string;
  style?: React.CSSProperties;
  debug?: boolean;
  pendulum?: { type: pendulumType } & PendulumComp.Props;
  children?: React.ReactNode; // 予備

  // 音声オプション
  openSound?: SoundPlayer.Props;
};

export type CuckooClockHandle = {
  trigger: () => void; // manual 用
};

// デフォルトの鳴数: 時報（1〜12）/ 分報（常に1）
function defaultStrikeResolver(date: Date, strikeOn: "hour" | "minute") {
  if (strikeOn === "minute") return 1;
  const hours = date.getHours();
  const h12 = ((hours + 11) % 12) + 1; // 0->12
  return h12;
}

function nextTickDelay(strikeOn: "hour" | "minute") {
  const now = new Date();
  const next = new Date(now);
  if (strikeOn === "hour") {
    next.setMinutes(0, 0, 0);
    next.setHours(
      now.getMinutes() === 0 && now.getSeconds() === 0
        ? now.getHours()
        : now.getHours() + 1
    );
  } else {
    next.setSeconds(0, 0);
    next.setMinutes(
      now.getSeconds() === 0 ? now.getMinutes() : now.getMinutes() + 1
    );
  }
  return Math.max(0, next.getTime() - now.getTime());
}

export const CuckooClock = React.forwardRef<
  CuckooClockHandle,
  CuckooClockProps
>(
  (
    {
      mode = "realtime",
      strikeOn = "hour",
      intervalMs = 8000,
      once = true,
      doorOpenMs = 400,
      birdOutMs = 400,
      birdInMs = 400,
      doorCloseMs = 350,
      strikeResolver,
      onStrikeStart,
      onStrikeEnd,
      className,
      style,
      debug,

      // 振り子オプション
      pendulum = {
        type: "none",
        periodMs: 2000,
        lengthPxengthPx: 110,
        bobSizePx: 24,
        amplitudeDeg: 16,
        sync: "none",
      },

      children,

      openSound = undefined,
    },
    ref
  ) => {
    const [busy, setBusy] = useState(false);
    const [phase, setPhase] = useState<
      | "idle"
      | "prepare"
      | "doorOpening"
      | "birdOut"
      | "chirp"
      | "birdIn"
      | "doorClosing"
      | "rest"
    >("idle");
    const [strikeCount, setStrikeCount] = useState(0);
    const [chirpIndex] = useState(0);

    //const audioRef = useRef<AudioContext | null>(null);
    const mounted = useRef(false);
    const timerRef = useRef<number | null>(null);

    React.useImperativeHandle(ref, () => ({ trigger: tryStart }), [
      busy,
      phase,
    ]);

    useEffect(() => {
      mounted.current = true;
      return () => {
        mounted.current = false;
        if (timerRef.current) window.clearTimeout(timerRef.current);
      };
    }, []);

    // ===== スケジューラ =====
    useEffect(() => {
      if (mode === "manual") return;

      function scheduleNext() {
        if (!mounted.current) return;
        const delay =
          mode === "realtime" ? nextTickDelay(strikeOn) : intervalMs;
        timerRef.current = window.setTimeout(async () => {
          await tryStart();
          scheduleNext(); // 次回予約（ドリフトを避け setTimeout チェイン）
        }, delay) as unknown as number;
      }

      scheduleNext();
      return () => {
        if (timerRef.current) window.clearTimeout(timerRef.current);
      };
    }, [mode, strikeOn, intervalMs]);

    // ===== 実行本体 =====
    async function tryStart() {
      if (busy && once) return; // 再入防止
      setBusy(true);
      setPhase("prepare");

      // 鳴数決定
      const now = new Date();
      const n = (
        strikeResolver || ((d: Date) => defaultStrikeResolver(d, strikeOn))
      )(now);
      setStrikeCount(n);
      onStrikeStart?.(n, now);

      // 扉→鳩→鳴き→戻る→扉
      setPhase("doorOpening");
      await wait(doorOpenMs);

      setPhase("birdOut");
      await wait(birdOutMs);

      setPhase("birdIn");
      await wait(birdInMs);

      setPhase("doorClosing");
      await wait(doorCloseMs);

      setPhase("rest");
      await wait(160);

      setPhase("idle");
      setBusy(false);
      onStrikeEnd?.(new Date());
    }

    function wait(ms: number) {
      return new Promise((res) => setTimeout(res, ms));
    }

    const doorOpen =
      phase === "doorOpening" ||
      phase === "birdOut" ||
      phase === "chirp" ||
      phase === "birdIn";

    /*
    const birdVisible =
      phase === "birdOut" || phase === "chirp" || phase === "birdIn";
    
    const easingObj = useMemo(
      () => (Array.isArray(easing) ? undefined : undefined),
      [easing]
    );
    */

    return (
      <div
        className={className}
        style={{
          position: "relative",
          width: 220,
          height: 300,
          display: "inline-block",
          ...style,
        }}
        aria-live="polite"
        aria-atomic
      >
        {" "}
        {/* isOpen が true になった瞬間だけ 3回、500ms 間隔で鳴る */}
        <DoorSound flg={doorOpen} {...openSound} />
        {/* 木の箱（本体） */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 16,
            background: "linear-gradient(180deg, #835f3a, #5b3d24)",
            boxShadow:
              "inset 0 2px 0 rgba(255,255,255,.15), 0 10px 25px rgba(0,0,0,.25)",
          }}
        />
        {/* 文字盤 */}
        <div
          style={{
            position: "absolute",
            top: 56,
            left: 40,
            right: 40,
            height: 120,
            borderRadius: 60,
            background: "linear-gradient(180deg,#fafafa,#f0f0f0)",
            border: "2px solid #e8e8e8",
            display: "grid",
            placeItems: "center",
          }}
        >
          <SplitClockReveal
            open={doorOpen}
            size={100}
            // face={<MyCustomClock ... />} // ←独自の盤面を使いたい場合
          >
            {children}
            {/* ▼ スピーカー風パルス：open 中だけ表示（扉の下に敷く） */}
            {doorOpen && (
              <SpeakerPulse
                ringColor="rgba(255,255,255,0.18)"
                ringWidth={2}
                ringCount={3}
                periodMs={1200}
                maxScale={3.5}
                initialSize="20%"
              />
            )}
          </SplitClockReveal>
        </div>
        {/* おもり（揺れはお好みで） */}
        <PendulumComponent {...pendulum} />
        {/* デバッグパネル */}
        {debug && (
          <div
            style={{
              position: "absolute",
              right: 8,
              bottom: 8,
              fontSize: 12,
              lineHeight: 1.3,
              color: "#fff",
              background: "rgba(0,0,0,.35)",
              padding: "6px 8px",
              borderRadius: 6,
              backdropFilter: "blur(4px)",
            }}
          >
            <div>phase: {phase}</div>
            <div>strike: {strikeCount}</div>
            <div>index: {chirpIndex}</div>
            <div>busy: {String(busy)}</div>
            <div>{new Date().toLocaleTimeString()}</div>
          </div>
        )}
      </div>
    );
  }
);

CuckooClock.displayName = "CuckooClock";

// 便利: 単体デモ用の薄い wrapper
export function CuckooClockDemo() {
  const [mode, setMode] = useState<CuckooClockProps["mode"]>("interval");
  const [strikeOn, setStrikeOn] =
    useState<CuckooClockProps["strikeOn"]>("minute");

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <label>
          mode:
          <select
            value={mode}
            onChange={(e) =>
              setMode(e.target.value as CuckooClockProps["mode"])
            }
          >
            <option value="realtime">realtime</option>
            <option value="interval">interval</option>
            <option value="manual" disabled>
              manual (use ref.trigger)
            </option>
          </select>
        </label>
        <label>
          strikeOn:
          <select
            value={strikeOn}
            onChange={(e) =>
              setStrikeOn(e.target.value as CuckooClockProps["strikeOn"])
            }
          >
            <option value="hour">hour</option>
            <option value="minute">minute</option>
          </select>
        </label>
      </div>
      <CuckooClock mode={mode} strikeOn={strikeOn} debug />
    </div>
  );
}

const PendulumComponent = (
  props: { type: pendulumType } & PendulumComp.Props
) => {
  // 振り子の種類
  switch (props.type) {
    case "main":
      return <PendulumComp.Main />;
      break;
    case "pendulum":
      return <PendulumComp.Pendulum {...props} />;
      break;
    default:
      return null;
  }
};
