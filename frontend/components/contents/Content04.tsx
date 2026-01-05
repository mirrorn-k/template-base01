"use client";
import HtmlText from "@/atoms/Typography";
import ResponsiveBox from "@/atoms/Box";
import { Box, Typography } from "@mui/material";
import LinkButton from "@/atoms/LinkButton";
import { tContent04 } from "@/lib/api/page/type";

interface MainProps {
  title1: tContent04["title1"];
  title2: tContent04["title2"];
  caption: tContent04["caption"];
  linkHref?: tContent04["linkHref"];
  linkText?: tContent04["linkText"];
}

export default function Main(props: MainProps) {
  return (
    <Box className={"Content04"} maxWidth={"lg"} width={"100%"}>
      <Box sx={{ display: "flex", width: "100%" }}>
        <Typography
          color={"primary.dark"}
          variant={"h5"}
          sx={{
            flex: 1,
            pr: 2,
            textAlign: "right",
            fontWeight: "Bold",
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
        <Typography
          color={"primary.dark"}
          variant={"h5"}
          sx={{ flex: 1, pl: 2, textAlign: "left", fontWeight: "Bold" }}
        >
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
              m: "auto",
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
