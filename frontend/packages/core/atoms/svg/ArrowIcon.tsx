import React from "react";

interface ArrowIconProps {
  length: number; // 線の長さ
  color?: string; // 矢印の色（オプション）
  strokeWidth?: number; // 線の太さ（オプション）
  tipAngle?: number; // 矢印の角度（オプション）
  tipLength?: number; // 矢印の線の長さ（オプション）
}

const ArrowIcon: React.FC<ArrowIconProps> = ({
  length,
  color = "black",
  strokeWidth = 2,
  tipAngle = 7, // 矢印の角度
  tipLength = 5, // 矢印の線の長さ
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${length + tipLength} 20`}
      width={length + tipLength}
      height="20"
    >
      {/* 線 */}
      <line
        x1="0"
        y1="10"
        x2={length}
        y2="10"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      {/* 矢印の先端 */}
      <polyline
        points={`${length},10 ${length - tipLength},${
          10 - tipAngle
        } ${length},10 ${length - tipLength},${10 + tipAngle}`}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export default ArrowIcon;
