"use client";

import { useTheme } from "@mui/material/styles";
import { Box, Typography, Link } from "@mui/material";
import ResponsiveBox from "@/packages/core/atoms/Box";
import * as Image from "@/packages/core/media/Index";
import { IMAGE_DEFAULT } from "@/const/Image";
import Menu01 from "@/components/menu/Menu01";
import HtmlText from "@/packages/core/atoms/Typography";

export default function FooterBar() {
  const theme = useTheme();
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
        <Image.MediaImage
          media={IMAGE_DEFAULT}
          imgProps={{ style: { maxWidth: "380px", maxHeight: "280px" } }}
        />
        <HtmlText
          sx={{ textAlign: "center" }}
          text="This is a sample footer text with <strong>HTML</strong> content."
        />

        <Menu01 flgContact={false} />
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
