"use client";

import { useTheme } from "@mui/material/styles";
import { Box, Typography, Link } from "@mui/material";
import ResponsiveBox, { FlexColumnBox, FlexBox } from "@/atoms/Box";
import * as Image from "@/components/media/Index";
import HtmlText from "@/atoms/Typography";
import React from "react";
import { tFooterItem } from "@/lib/api/footer/type";
import * as ContextCommon from "@/contexts/Common";
import { getResponsiveValue } from "@/lib/responsiveValue/index";
import * as ContextMap from "@/contexts/MapData";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import FaxIcon from "@mui/icons-material/Fax";

interface Props {
  // 追加のpropsがあればここに定義
  content: tFooterItem;
}
export default function FooterBar({ content }: Props) {
  const theme = useTheme();
  const { screenSize } = ContextCommon.useContents();
  const { organize } = ContextMap.Contents();

  const logo = content.logo
    ? getResponsiveValue(content.logo, screenSize)
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
        <FlexColumnBox gapSize={1}>
          {content.flgAddress && organize?.address && (
            <Typography variant="h6" align="center">
              {organize.address}
            </Typography>
          )}
          <FlexBox>
            {content.flgTel && organize?.tell && (
              <FlexBox sx={{ alignItems: "center" }} gapSize={1}>
                <LocalPhoneIcon />
                <Typography variant="h6">{organize.tell}</Typography>
              </FlexBox>
            )}
            {content.flgFax && organize?.fax && (
              <FlexBox sx={{ alignItems: "center" }} gapSize={1}>
                <FaxIcon />
                <Typography variant="h6">{organize.fax}</Typography>
              </FlexBox>
            )}
          </FlexBox>
        </FlexColumnBox>
        {content.text && (
          <HtmlText sx={{ textAlign: "center" }} text={content.text || ""} />
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
