"use client";
import Link from "@mui/material/Link";
import { FlexBox } from "@/packages/core/atoms/Box";
import Button from "@mui/material/Button";
import React from "react";
import { BoxProps } from "@mui/material/Box";
import { MenuItem } from "@/types/mapMenu";
import * as ContextCommon from "@/packages/core/context/Common";

type Menu01Props = {
  flgContact?: boolean;
  FlexBoxProps?: BoxProps;
  menus: MenuItem[];
};

export default function Menu01(props: Menu01Props) {
  const { flgContactModal, setFlgContactModal } = ContextCommon.useContents();
  if (!Array.isArray(props.menus) || props.menus.length === 0) {
    return null;
  }
  return (
    <FlexBox
      sx={{
        gap: 3,
        alignItems: "center",
        display: { xs: "none", md: "flex" },
      }}
      {...props.FlexBoxProps}
    >
      {props.menus.map((menu) => (
        <Link key={`menu-${menu.slug}`} color="inherit" href={`/${menu.slug}`}>
          {menu.label}
        </Link>
      ))}
      {props.flgContact && (
        <Button
          variant="contained"
          color="secondary"
          sx={{ borderRadius: 12 }}
          onClick={() => setFlgContactModal(!flgContactModal)}
        >
          Contact
        </Button>
      )}
    </FlexBox>
  );
}
