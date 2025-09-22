"use client";
import React from "react";
import {
  createTheme,
  ThemeProvider,
  responsiveFontSizes,
} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { baseTheme } from "@/themes/BaseTheme";

let theme = createTheme(baseTheme, {
  palette: {},
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          posission: "sticky",
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
          "&:hover": {
            backgroundColor: "gray",
          },
          "& svg": {
            color: "white", // 子要素のアイコン色
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "50%", // 角を丸くする
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

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
