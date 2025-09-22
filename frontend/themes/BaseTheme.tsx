"use client";
import {
  createTheme,
  ThemeProvider,
  responsiveFontSizes,
} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import "@fontsource/shippori-mincho";
import "@fontsource/noto-sans-jp";
import { text } from "stream/consumers";

// テーマ作成
export const baseTheme = createTheme({
  palette: {},
  typography: {
    fontFamily: `'Noto Sans JP', sans-serif`,
    h1: {
      fontFamily: `'Shippori Mincho', sans-serif`,
      letterSpacing: "0.1em",
    },
    h2: {
      fontFamily: `'Shippori Mincho', sans-serif`,
      fontSize: "2.5rem",
      fontWeight: "700",
      letterSpacing: "0.1em",
    },
    h3: {
      fontFamily: `'Shippori Mincho', sans-serif`,
      letterSpacing: "0.1em",
    },
    h4: {
      fontFamily: `'Shippori Mincho', sans-serif`,
      letterSpacing: "0.1em",
    },
    h5: {
      fontFamily: `'Shippori Mincho', sans-serif`,
      letterSpacing: "0.1em",
      fontSize: "1.5rem",
    },
    h6: {
      fontFamily: `'Shippori Mincho', sans-serif`,
    },
    body1: {
      fontFamily: `'Noto Sans JP', sans-serif`,
      textAlign: "left",
      fontSize: "1rem",
    },
    body2: {
      fontFamily: `'Noto Sans JP', sans-serif`,
      fontSize: "0.8rem",
    },
  },
  components: {
    MuiCssBaseline: {},
    MuiLink: {
      defaultProps: {
        underline: "none", // ← これ必須
      },
      styleOverrides: {
        root: {
          textDecoration: "none",
          "&:hover": {
            textDecoration: "underline",
          },
        },
      },
    },
  },
});

const theme = responsiveFontSizes(baseTheme);

interface ThemeProps {
  children: React.ReactNode;
}

const BaseThemeProvider: React.FC<ThemeProps> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default BaseThemeProvider;
