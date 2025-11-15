"use client";
import * as React from "react";
import * as Sound from "@/atoms/Sound";

export type Props = {
  flg: boolean;
  src?: string;
  volume?: number; // 0..1
  count?: number; // 既定 1
  intervalMs?: number; // 既定 300
  playOnMount?: boolean; // 追加: 初回マウント時にも鳴らす
};

export default function PlaySound({
  flg,
  src,
  volume = 1.0,
  count = 1,
  intervalMs = 300,
  playOnMount = false,
}: Props) {
  const prevRef = React.useRef<boolean>(false); // ← 初期 false に固定
  const cacheRef = React.useRef<Map<string, AudioBuffer>>(new Map());
  const abortRef = React.useRef<AbortController | null>(null);

  React.useEffect(() => {
    Sound.armAutoUnlock(); // 保険
    return () => {
      abortRef.current?.abort(); // クリーンアップ
    };
  }, []);

  const getBuffer = React.useCallback(async (url: string) => {
    const cached = cacheRef.current.get(url);
    if (cached) return cached;
    const ctx = Sound.getAudioContext();
    const res = await fetch(url, { cache: "force-cache" });
    const arr = await res.arrayBuffer();
    const buf = await ctx.decodeAudioData(arr.slice(0));
    cacheRef.current.set(url, buf);
    return buf;
  }, []);

  const fire = React.useCallback(async () => {
    if (!src) return;
    await Sound.userActivateAudio();
    const ctx = Sound.getAudioContext();
    const buffer = await getBuffer(src);

    const base = ctx.currentTime + 0.01;
    const gap = Math.max(0, intervalMs) / 1000;
    const vol = Math.max(0, Math.min(1, volume));

    const ac = new AbortController();
    abortRef.current = ac;

    for (let i = 0; i < Math.max(1, count); i++) {
      if (ac.signal.aborted) break;
      const node = ctx.createBufferSource();
      const gain = ctx.createGain();
      gain.gain.value = vol;
      node.buffer = buffer;
      node.connect(gain);
      gain.connect(ctx.destination);
      // AudioContext のタイムラインで正確にスケジュール
      node.start(base + i * gap);
      node.onended = () => {
        node.disconnect();
        gain.disconnect();
      };
    }
  }, [src, volume, count, intervalMs, getBuffer]);

  React.useEffect(() => {
    // 初回マウント時に鳴らす指定
    if (!prevRef.current && playOnMount && flg) {
      fire().catch(() => {});
    }
    // 通常：false -> true の遷移で鳴らす
    if (!prevRef.current && flg) {
      fire().catch(() => {});
    }
    prevRef.current = flg;
  }, [flg, playOnMount, fire]);

  return null;
}
