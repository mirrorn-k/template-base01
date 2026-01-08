"use client";

import { useTheme } from "@mui/material/styles";
import { Box, Typography, Link } from "@mui/material";
import ResponsiveBox, { FlexBox } from "@/atoms/Box";
import * as Image from "@/components/media/Index";
import React from "react";
import * as ContextMap from "@/contexts/MapData";
import { tSite } from "@/lib/api/site/type";

interface Props {
  // 追加のpropsがあればここに定義
  footer: tSite["footer"];
}
export default function FooterBar({ footer }: Props) {
  const theme = useTheme();
  const { organize, menus } = ContextMap.Contents();

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
        maxWidth="lg"
        margin="0 auto"
        paddingX={2}
        sx={{
          display: "flex",
          gap: 4,
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {footer.flgLogo && footer.logo ? (
          <Image.MediaImage
            media={footer.logo}
            imgProps={{ style: { maxWidth: "380px", maxHeight: "280px" } }}
          />
        ) : (
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {organize?.organization_name}
          </Typography>
        )}
        <FlexBox sx={{ display: "flex", width: "100%" }}>
          <Box sx={{ flex: 1 }}>
            <Typography>{organize?.postal_code}</Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            {menus.map((menu) => (
              <Link
                key={`menu-${menu.slug}`}
                color="inherit"
                href={`/${menu.slug}`}
              >
                {menu.label}
              </Link>
            ))}
          </Box>
        </FlexBox>
      </ResponsiveBox>
      <Typography variant="body2" align="center">
        {footer.copyright
          ? footer.copyright
          : `© ${new Date().getFullYear()} addonem llc. All rights reserved.`}
        <Link href="/privacy" color="inherit">
          Privacy Policy
        </Link>
      </Typography>
    </Box>
  );
}
