"use client";
import Title from "@/atoms/Title";
import HtmlText from "@/atoms/Typography";
import { CONTACT_CAPTION } from "@/const/caption";
import ResponsiveBox from "@/atoms/Box";
import ContactButton from "@/atoms/ContactButton";
import { Theme } from "@mui/material/styles";
import { Box } from "@mui/material";

export default function Main() {
  return (
    <Box>
      <Title text={["text", "テキスト"]} />
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
          text={CONTACT_CAPTION}
          variant="body1"
          sx={{
            textAlign: "center",
            lineHeight: { xs: 1.5, sm: 2.0, md: 2.5 },
          }}
        />
        <ContactButton
          sx={{
            width: "100%",
            borderRadius: 12,
            fontSize: (theme: Theme) => theme.typography.h5.fontSize,
          }}
        />
      </ResponsiveBox>
    </Box>
  );
}
