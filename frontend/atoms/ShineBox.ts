import { Box, BoxProps } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";

// アニメーション定義
const shine = keyframes`
  0% { left: -75%; }
  100% { left: 125%; }
`;

const flip = keyframes`
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(360deg); }
`;

// Props 型定義
interface CircleWrapperProps extends BoxProps {
  animation?: "shine" | "flip" | "both" | "none";
  size?: number; // 直径（px）
  duration?: number; // アニメーションの長さ（秒）
  delay?: number; // 初回遅延（秒）
  interval?: number; // 間隔 → 今回は未使用（将来的にJS制御などで対応可能）
}

// styled コンポーネント本体
const Main = styled(Box, {
  shouldForwardProp: (prop) =>
    !["animation", "size", "duration", "delay", "interval"].includes(
      prop as string
    ),
})<CircleWrapperProps>(
  ({ animation = "none", size = 80, duration = 2, delay = 0 }) => {
    const flipAnim = `${flip} ${duration}s linear ${delay}s infinite`;
    const shineAnim = `${shine} ${duration}s linear ${delay}s infinite`;

    return {
      position: "relative",
      width: size,
      height: size,
      borderRadius: "50%",
      overflow: "hidden",
      perspective: "1000px",

      ...(animation === "flip" || animation === "both"
        ? {
            animation: flipAnim,
            transformStyle: "preserve-3d",
          }
        : {}),

      ...(animation === "shine" || animation === "both"
        ? {
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "-75%",
              width: "50%",
              height: "100%",
              background:
                "linear-gradient(120deg, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.0) 100%)",
              transform: "skewX(-20deg)",
              animation: shineAnim,
              zIndex: 2,
              pointerEvents: "none",
            },
          }
        : {}),
    };
  }
);

export default Main;
