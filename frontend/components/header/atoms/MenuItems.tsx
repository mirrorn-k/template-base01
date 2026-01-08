"use client";
import Link from "@/atoms/Link";
import { FlexBox } from "@/atoms/Box";
import React from "react";
import { BoxProps } from "@mui/material/Box";
import { tMenuItem } from "@/types/ttnouMap";

type Menu01Props = {
  FlexBoxProps?: BoxProps;
  menus: tMenuItem[];
  location: "header" | "footer";
};

export default function Menu01(props: Menu01Props) {
  if (!Array.isArray(props.menus) || props.menus.length === 0) {
    return null;
  }
  return (
    <FlexBox
      className="menu-items Menu01"
      sx={{
        gap: 3,
        alignItems: "center",
        marginLeft: 3,
        marginRight: 3,
      }}
      {...props.FlexBoxProps}
    >
      {props.menus.map((menu) => {
        if (!menu.flgHeadr && props.location === "header") {
          return null;
        } else if (!menu.flgFooter && props.location === "footer") {
          return null;
        }

        return (
          <Link
            key={`menu-${menu.slug}`}
            color="inherit"
            href={`/${menu.slug}`}
            label={menu.label}
          />
        );
      })}
    </FlexBox>
  );
}
