"use client";

import { useTheme } from "@mui/material/styles";
import { Box, Typography, Link } from "@mui/material";
import ResponsiveBox from "@/atoms/Box";
import * as Image from "@/components/media/Index";
import HtmlText from "@/atoms/Typography";
import React from "react";
import { tFooterItem } from "@/lib/api/footer/type";
import * as ContextCommon from "@/contexts/Common";
import { getResponsiveValue } from "@/lib/responsiveValue/index";

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
