"use client";
import * as React from "react";
import { LinkButton } from "@/atoms/Button";
import { useTheme } from "@mui/material/styles";

type Props = {
  linkHref?: string;
  linkText?: string;
} & Omit<React.ComponentProps<typeof LinkButton>, "href" | "children">;

export default function Main({ linkHref, linkText, ...rest }: Props) {
  const theme = useTheme();
  const smValue = theme.breakpoints.values.sm; // デフォルトだと 600

  return (
    <LinkButton
      href={linkHref || "#"}
      sx={{
        mt: 2,
        maxWidth: { xs: "80%", sm: "80%" },
        minWidth: { xs: "100%", sm: smValue },
        borderRadius: 20,
      }}
      variant="contained"
      {...rest}
    >
      {linkText || "リンク"}
    </LinkButton>
  );
}
