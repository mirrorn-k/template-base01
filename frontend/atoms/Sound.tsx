// core/atoms/Sound.ts
// ※ このモジュールはクライアントでだけ使ってください（SSR から呼ばない）

// Window に webkitAudioContext を追加定義
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

let ctx: AudioContext | null = null;

// iOS/Safari 対策: 同一タスク内でごく短い無音を鳴らす（解除のため）
function fireOneShot(c: AudioContext) {
  try {
    const osc = c.createOscillator();
    const gain = c.createGain();
    gain.gain.setValueAtTime(0, c.currentTime); // 無音
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + 0.02);
  } catch {
    // noop
  }
}

function createAudioContext(): AudioContext {
  if (typeof window === "undefined") {
    throw new Error("AudioContext is only available in the browser.");
  }
  if (typeof window.AudioContext !== "undefined") {
    return new window.AudioContext();
  }
  if (typeof window.webkitAudioContext !== "undefined") {
    // ← ここがポイント：コンストラクタを new する
    return new window.webkitAudioContext();
  }
  throw new Error("Web Audio API is not supported in this browser.");
}

export function getAudioContext(): AudioContext {
  if (!ctx) ctx = createAudioContext();
  return ctx;
}

export function isSoundEnabled(): boolean {
  return !!ctx && ctx.state === "running";
}

/** ユーザー操作（onClick 等）内で呼ぶ：resume + 無音ワンショット */
export async function userActivateAudio(): Promise<void> {
  if (!ctx || ctx.state === "closed") ctx = createAudioContext();
  try {
    if (ctx.state === "suspended") {
      await ctx.resume();
    }
    fireOneShot(ctx); // 解除の“印”（無音）
  } catch {
    // noop
  }
}

/** 任意：クリック/キー/復帰で自動解除（保険） */
let armed = false;
export function armAutoUnlock(): void {
  if (armed) return;
  armed = true;

  const once = async () => {
    await userActivateAudio();
  };

  window.addEventListener("pointerdown", once, { once: true });
  window.addEventListener("keydown", once, { once: true });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      void userActivateAudio();
    }
  });
}
