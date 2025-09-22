// FloatingButton.tsx
import React, { ReactNode } from "react";
import { styled } from "@mui/system";

interface FloatingButtonProps {
  children: ReactNode; // ボタン内に表示するアイコンやテキスト
  onClick: () => void; // クリック時のハンドラ
  position?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  }; // ボタンの位置を指定（デフォルト: 右下）
  customStyles?: React.CSSProperties; // 追加のスタイル
}

// Styledコンポーネント
const StyledButtonContainer = styled("div")<{
  position: FloatingButtonProps["position"];
}>(({ position }) => ({
  position: "fixed",
  zIndex: 1000,
  top: position?.top,
  bottom: position?.bottom || "16px",
  left: position?.left,
  right: position?.right || "16px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const StyledIconButton = styled("button")({
  width: 56,
  height: 56,
  backgroundColor: "#007BFF",
  border: "none",
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  color: "white",
  cursor: "pointer",
  transition: "transform 0.2s ease, background-color 0.2s ease",
  "&:hover": {
    backgroundColor: "#0056b3",
    transform: "scale(1.1)",
  },
});

const FloatingButton: React.FC<FloatingButtonProps> = ({
  children,
  onClick,
  position,
  customStyles,
}) => {
  return (
    <StyledButtonContainer position={position} style={customStyles}>
      <StyledIconButton onClick={onClick}>{children}</StyledIconButton>
    </StyledButtonContainer>
  );
};

export default FloatingButton;
