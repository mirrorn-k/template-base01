// components/timed/Clock.tsx
"use client";
import React, { useEffect, useState } from "react";

export default function Main({
  size = 100,
  tzOffsetMinutes = 540, // JST
}: {
  size?: number;
  tzOffsetMinutes?: number;
}) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 50);
    return () => clearInterval(id);
  }, []);
  const d = new Date(now + tzOffsetMinutes * 60_000);
  const h = d.getUTCHours();
  const m = d.getUTCMinutes();
  const s = d.getUTCSeconds();
  const ms = d.getUTCMilliseconds();

  const r = size / 2;
  const cx = r,
    cy = r;
  const secA = ((s + ms / 1000) / 60) * 360 - 90;
  const minA = ((m + (s + ms / 1000) / 60) / 60) * 360 - 90;
  const hourA = (((h % 12) + m / 60 + s / 3600) / 12) * 360 - 90;

  const toXY = (deg: number, len: number) => {
    const rad = (deg * Math.PI) / 180;
    return [cx + Math.cos(rad) * len, cy + Math.sin(rad) * len] as const;
  };

  const ticks = Array.from({ length: 60 }, (_, i) => {
    const major = i % 5 === 0;
    const len = major ? r * 0.12 : r * 0.06;
    const inner = r - 6 - len;
    const outer = r - 6;
    const deg = (i / 60) * 360 - 90;
    const [x1, y1] = toXY(deg, inner);
    const [x2, y2] = toXY(deg, outer);
    return (
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="currentColor"
        strokeOpacity={major ? 0.9 : 0.35}
        strokeWidth={major ? 1.5 : 1}
        strokeLinecap="round"
      />
    );
  });

  const [hx, hy] = toXY(hourA, r * 0.45);
  const [mx, my] = toXY(minA, r * 0.68);
  const [sx, sy] = toXY(secA, r * 0.72);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ color: "#222" }}
    >
      <circle cx={cx} cy={cy} r={r - 2} fill="#fff" stroke="#e5e5e5" />
      {ticks}
      <line
        x1={cx}
        y1={cy}
        x2={hx}
        y2={hy}
        stroke="#222"
        strokeWidth={3.5}
        strokeLinecap="round"
      />
      <line
        x1={cx}
        y1={cy}
        x2={mx}
        y2={my}
        stroke="#222"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <line
        x1={cx}
        y1={cy}
        x2={sx}
        y2={sy}
        stroke="#d44"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r={2.8} fill="#222" />
    </svg>
  );
}
