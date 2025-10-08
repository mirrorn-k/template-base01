"use client";

import { useTheme } from "@mui/material/styles";
import { Box, Typography, Link } from "@mui/material";
import ResponsiveBox from "@/packages/core/atoms/Box";
import * as Image from "@/packages/component/media/Index";
import HtmlText from "@/packages/core/atoms/Typography";
import React from "react";
import { tFooterItem } from "@/types/mapFooter";
import * as ContextCommon from "@/packages/core/context/Common";
import { getResponsiveValue } from "@/packages/core/function/responsiveValue/index";

interface Props {
  // 追加のpropsがあればここに定義
  contents: tFooterItem;
}
export default function FooterBar(props: Props) {
  const theme = useTheme();
  const { screenSize } = ContextCommon.useContents();

  const logo = props.contents.logo
    ? getResponsiveValue(props.contents.logo, screenSize)
    : undefined;
  return (
    <Box
      component={"footer"}
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        padding: theme.spacing(2, 0),
        marginTop: "auto",
        boxShadow: theme.shadows[4],
      }}
    >
      <ResponsiveBox
        maxWidth="md"
        margin="0 auto"
        paddingX={2}
        sx={{
          display: "flex",
          gap: 4,
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {logo && (
          <Image.MediaImage
            media={logo}
            imgProps={{ style: { maxWidth: "380px", maxHeight: "280px" } }}
          />
        )}

        <Box
          sx={{
            width: "100%",
            borderTop: "1px solid",
            borderColor: theme.palette.primary.contrastText,
          }}
        />
        {props.contents.text && (
          <HtmlText
            sx={{ textAlign: "center" }}
            text={props.contents.text || ""}
          />
        )}

        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} addonem llc. All rights reserved.{" "}
          <Link href="/privacy" color="inherit">
            Privacy Policy
          </Link>
        </Typography>
      </ResponsiveBox>
    </Box>
  );
}
