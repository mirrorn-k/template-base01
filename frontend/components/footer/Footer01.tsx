"use client";

import { useTheme } from "@mui/material/styles";
import { Box, Typography, Link } from "@mui/material";
import ResponsiveBox, { FlexColumnBox, FlexBox } from "@/atoms/Box";
import * as Image from "@/components/media/Index";
import HtmlText from "@/atoms/Typography";
import React from "react";
import * as ContextMap from "@/contexts/MapData";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import FaxIcon from "@mui/icons-material/Fax";
import { tSite } from "@/lib/api/site/type";

interface Props {
  // 追加のpropsがあればここに定義
  footer: tSite["footer"];
}
export default function FooterBar({ footer }: Props) {
  const theme = useTheme();
  const { organize } = ContextMap.Contents();

  return (
    <Box
      className="Footer01"
      component={"footer"}
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        padding: theme.spacing(2, 0),
        marginTop: "auto",
        boxShadow: theme.shadows[4],
      }}
    >
      {footer.customCss && (
        <style
          id="site-footer-custom-css"
          dangerouslySetInnerHTML={{ __html: footer.customCss }}
        />
      )}

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
        {footer.flgLogo && footer.logo && (
          <>
            <Image.MediaImage
              media={footer.logo}
              imgProps={{
                style: {
                  width: "auto",
                  height: "auto",
                  maxWidth: "160px",
                  maxHeight: "160px",
                },
              }}
            />
            <Box
              sx={{
                width: "100%",
                borderTop: "1px solid",
                borderColor: theme.palette.primary.contrastText,
              }}
            />
          </>
        )}

        <FlexColumnBox gapSize={1}>
          {footer.flgAddress && organize?.address && (
            <Typography className="address" variant="h6" align="center">
              {organize.address}
            </Typography>
          )}
          <FlexBox>
            {footer.flgTel && organize?.tell && (
              <FlexBox
                className="tell-box"
                sx={{ alignItems: "center" }}
                gapSize={1}
              >
                <LocalPhoneIcon />
                <Typography className="tell" variant="h6">
                  {organize.tell}
                </Typography>
              </FlexBox>
            )}
            {footer.flgFax && organize?.fax && (
              <FlexBox
                className="fax-box"
                sx={{ alignItems: "center" }}
                gapSize={1}
              >
                <FaxIcon />
                <Typography className="fax" variant="h6">
                  {organize.fax}
                </Typography>
              </FlexBox>
            )}
          </FlexBox>
        </FlexColumnBox>
        {footer.text && (
          <HtmlText
            className="text"
            sx={{ textAlign: "center" }}
            text={footer.text || ""}
          />
        )}

        <Typography className="copyright" variant="body2" align="center">
          {footer.copyright
            ? footer.copyright
            : `© ${new Date().getFullYear()} addonem llc. All rights reserved.`}
          <Link href="/privacy" color="inherit">
            Privacy Policy
          </Link>
        </Typography>
      </ResponsiveBox>
    </Box>
  );
}
