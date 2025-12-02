"use client";
import HtmlText from "@/atoms/Typography";
import ResponsiveBox from "@/atoms/Box";
import { Box, Typography } from "@mui/material";
import { tMedia } from "@/types/ttnouMap";
import LinkButton from "@/atoms/LinkButton";

interface MainProps {
  title1: string;
  title2: string;
  media?: tMedia;
  caption: string;
  linkHref?: string;
  linkText?: string;
}

export default function Main(props: MainProps) {
  return (
    <Box>
      <Box sx={{ display: "flex", width: "100%" }}>
        <Typography
          sx={{
            flex: 1,
            pr: 2,
            textAlign: "right",
          }}
        >
          {props.title1}
        </Typography>
        <Box
          sx={{
            borderRight: "1px solid",
            borderColor: "primary.main",
          }}
        ></Box>
        <Typography sx={{ flex: 1, pl: 2, textAlign: "left" }}>
          {props.title2}
        </Typography>
      </Box>
      <ResponsiveBox
        maxWidth="sm"
        sx={{
          m: "auto",
          mb: 4,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <HtmlText
          text={props.caption}
          variant="body1"
          sx={{
            textAlign: "center",
            lineHeight: { xs: 1.5, sm: 2.0, md: 2.5 },
          }}
        />
        {props.linkHref && (
          <LinkButton
            linkHref={props.linkHref}
            linkText={props.linkText || "お問い合わせ"}
            sx={{
              backgroundColor: "primary.contrastText",
              color: "primary.main",
              mt: 2,
              maxWidth: "none",
              minWidth: "none",
              width: "90%",
              borderRadius: 20,
            }}
          />
        )}
      </ResponsiveBox>
    </Box>
  );
}
