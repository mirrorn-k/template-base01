"use client";
import Link from "@mui/material/Link";
import { FlexBox } from "@/atoms/Box";
import React from "react";
import { BoxProps } from "@mui/material/Box";
import { tMenuItem } from "@/lib/api/menu/type";

type Menu01Props = {
  flgContact?: boolean;
  FlexBoxProps?: BoxProps;
  menus: tMenuItem[];
};

export default function Menu01(props: Menu01Props) {
  if (!Array.isArray(props.menus) || props.menus.length === 0) {
    return null;
  }
  return (
    <FlexBox
      sx={{
        gap: 3,
        alignItems: "center",
        display: { xs: "none", md: "flex" },
        marginLeft: 3,
        marginRight: 3,
      }}
      {...props.FlexBoxProps}
    >
      {props.menus.map((menu) => (
        <Link key={`menu-${menu.slug}`} color="inherit" href={`/${menu.slug}`}>
          {menu.label}
        </Link>
      ))}
    </FlexBox>
  );
}
