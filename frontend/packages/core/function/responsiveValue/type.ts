import { Theme } from "@mui/material/styles";

// Theme["breakpoints"]["keys"] が ["xs","sm","md","lg","xl"]
export type Breakpoint = Theme["breakpoints"]["keys"][number];

// 汎用のレスポンシブ型
export type Responsive<T> = Partial<Record<Breakpoint, T | undefined>>;
