"use client";
import Link from "@mui/material/Link";
import { FlexBox } from "@/packages/core/atoms/Box";
import Button from "@mui/material/Button";
import React from "react";
import { BoxProps } from "@mui/material/Box";

type Menu01Props = {
  flgContact?: boolean;
  FlexBoxProps?: BoxProps;
};

export default function Menu01(props: Menu01Props) {
  return (
    <FlexBox
      sx={{
        gap: 3,
        alignItems: "center",
        display: { xs: "none", md: "flex" },
      }}
      {...props.FlexBoxProps}
    >
      <Link color="inherit" href="/">
        Home
      </Link>
      <Link color="inherit" href="/about">
        About
      </Link>
      {props.flgContact && (
        <Button variant="contained" color="secondary" sx={{ borderRadius: 12 }}>
          Contact
        </Button>
      )}
    </FlexBox>
  );
}
