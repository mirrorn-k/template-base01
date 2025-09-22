"use client";
import React from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/system";
import * as Sound from "./Sound";

export const Main = styled(Button)(() => ({
  borderRadius: 5,
}));

/**
 * 円形ボタン
 */
export const CircularButton = styled(Button)(({}) => ({
  borderRadius: "50%",
  width: 50,
  height: 50,
  minWidth: 50,
  padding: 0,
}));

export const LinkButton = styled(Button)(({}) => ({
  textDecoration: "none",
  color: "inherit",
  fontWeight: "bold",
  display: "flex",
  flexDirection: "column",
  textAlign: "center",
}));

/**
 * サウンド自動解除ボタン
 * @returns
 */
export function SoundUnlockButton() {
  const [enabled, setEnabled] = React.useState(false);
  React.useEffect(() => {
    Sound.armAutoUnlock(); // 任意：クリック/キーで自動解除
    const id = setInterval(() => setEnabled(Sound.isSoundEnabled()), 300);
    return () => clearInterval(id);
  }, []);
  if (enabled) return null;

  return (
    <button
      onClick={async () => {
        await Sound.userActivateAudio(); // ← ユーザー操作の同一タスク内で解除
        setEnabled(Sound.isSoundEnabled());
      }}
      style={{
        position: "absolute",
        right: 8,
        top: 8,
        fontSize: 12,
        zIndex: 10,
      }}
    >
      🔊 サウンドを有効化
    </button>
  );
}
