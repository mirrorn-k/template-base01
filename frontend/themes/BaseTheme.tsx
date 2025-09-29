"use client";
import {
  createTheme,
  ThemeProvider,
  responsiveFontSizes,
  ThemeOptions,
} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import "@fontsource/shippori-mincho";
import "@fontsource/noto-sans-jp";
import React from "react";

// テーマ作成
export const baseTheme = createTheme({
  palette: {
    primary: {
      main: "rgb(39,70,124)",
      contrastText: "rgb(255,255,255)",
      light: "rgb(231,244,252)",
      dark: "rgb(19,40,94)",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: "#ff0000",
    },
    background: {
      default: "#fff",
      paper: "rgb(231,244,252)",
    },
  },
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
      letterSpacing: "0.05em",
      lineHeight: 1.8,
    },
    body2: {
      fontFamily: `'Noto Sans JP', sans-serif`,
      fontSize: "0.8rem",
      textAlign: "left",
      letterSpacing: "0.05em",
      lineHeight: 1.8,
    },
  },
  components: {
    MuiCssBaseline: {},
    MuiAppBar: {
      styleOverrides: {
        root: {
          position: "fixed",
          top: 0,
          left: 0,
          boxShadow: "none",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: "50%",
        },
      },
    },
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
  options: ThemeOptions;
  children: React.ReactNode;
}

const BaseThemeProvider: React.FC<ThemeProps> = ({ options, children }) => {
  console.log("BaseThemeProvider options:", options);
  const themeOptions = createTheme(options);
  const mergedTheme = createTheme(theme, themeOptions);
  return (
    <ThemeProvider theme={mergedTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default BaseThemeProvider;
