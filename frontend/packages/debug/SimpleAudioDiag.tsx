// components/debug/SimpleAudioDiag.tsx
"use client";
import * as React from "react";

export default function SimpleAudioDiag() {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [msg, setMsg] = React.useState("idle");

  const SRC = "/sounds/cuckoo.mp3"; // ← /public/sounds/cuckoo.mp3 に置いてテスト

  const log = (m: string, e?: any) => {
    console.log("[SimpleAudioDiag]", m, e ?? "");
    setMsg(m);
  };

  // 1) 合成音（必ず鳴るはず）
  async function beep() {
    try {
      const AC: any = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AC();
      if (ctx.state === "suspended") await ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
      log("beep ok");
    } catch (e) {
      log("beep error", e);
    }
  }

  // 2) <audio> で再生（最短ルート）
  async function playTag() {
    try {
      const el = audioRef.current!;
      el.currentTime = 0;
      el.volume = 1;
      await el.play(); // ← ここが失敗したら catch に来る
      log("audio tag playing");
    } catch (e) {
      log("audio tag play() error", e);
    }
  }

  // 3) WebAudio でファイル再生（fetch + decode）
  async function playWA() {
    try {
      const AC: any = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AC();
      if (ctx.state === "suspended") await ctx.resume();
      log("fetching " + SRC);
      const res = await fetch(SRC);
      if (!res.ok) throw new Error("fetch failed " + res.status);
      const arr = await res.arrayBuffer();

      // Safari 互換（callback 版が必要な環境あり）
      const decode = (arr: ArrayBuffer) =>
        new Promise<AudioBuffer>((res, rej) => {
          // @ts-ignore
          ctx.decodeAudioData(arr, res, rej);
        });
      const buf = await decode(arr);

      const src = ctx.createBufferSource();
      src.buffer = buf;
      const g = ctx.createGain();
      g.gain.value = 0.9;
      src.connect(g);
      g.connect(ctx.destination);
      src.start();
      log("webaudio playing");
    } catch (e) {
      log("webaudio error", e);
    }
  }

  React.useEffect(() => {
    const el = audioRef.current!;
    const onErr = () => {
      const mediaErr = el.error;
      log("audio tag error " + (mediaErr?.code ?? ""), mediaErr);
    };
    const onCanPlay = () => log("audio tag canplay");
    const onStalled = () => log("audio tag stalled");
    const onWaiting = () => log("audio tag waiting");
    el.addEventListener("error", onErr);
    el.addEventListener("canplay", onCanPlay);
    el.addEventListener("stalled", onStalled);
    el.addEventListener("waiting", onWaiting);
    return () => {
      el.removeEventListener("error", onErr);
      el.removeEventListener("canplay", onCanPlay);
      el.removeEventListener("stalled", onStalled);
      el.removeEventListener("waiting", onWaiting);
    };
  }, []);

  return (
    <div style={{ padding: 12, border: "1px solid #444", borderRadius: 8 }}>
      <div style={{ fontSize: 12, marginBottom: 8, color: "#666" }}>
        state: {msg}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={beep}>🔔 ビープ</button>
        <button onClick={playTag}>▶ audioタグ再生</button>
        <button onClick={playWA}>▶ WebAudio再生</button>
        <audio ref={audioRef} src={SRC} preload="auto" />
      </div>
    </div>
  );
}
