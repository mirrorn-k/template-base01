"use client";
import {
  createTheme,
  ThemeProvider,
  responsiveFontSizes,
} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import "@fontsource/shippori-mincho";
import "@fontsource/noto-sans-jp";

// テーマ作成
const ct = createTheme();

export const theme = responsiveFontSizes(ct);

interface ThemeProps {
  children: React.ReactNode;
}

const Provider: React.FC<ThemeProps> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default Provider;
