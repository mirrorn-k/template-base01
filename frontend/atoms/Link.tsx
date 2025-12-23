"use client";
import MuiLink, { LinkProps as MuiLinkProps } from "@mui/material/Link";
import NextLink from "next/link";
import { Typography, Box } from "@mui/material";
import ArrowIcon from "@/atoms/svg/ArrowIcon";
import { useTheme } from "@mui/material";
import styled from "@mui/system/styled";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

type MainProps = MuiLinkProps & {
  href: string;
  label: string | undefined;
};

export default function Main({ href, label, ...linkProps }: MainProps) {
  return (
    <MuiLink
      component={NextLink}
      href={href}
      underline="none"
      className="atom-Link-Main"
      {...linkProps}
    >
      <Typography variant="body1">{label}</Typography>
    </MuiLink>
  );
}

export const ArrowLink = ({ href, label }: MainProps) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        flexFlow: "row nowrap",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: theme.spacing(2),
      }}
    >
      <Main href={href} label={label} />
      <ArrowIcon length={50} strokeWidth={1} tipAngle={0} tipLength={0} />
    </Box>
  );
};

export const ArrowForwardlosLink = ({ href, label }: MainProps) => {
  const theme = useTheme();
  return (
    <Box
      className="ArrowForwardIosLink"
      sx={{
        display: "flex",
        flexFlow: "row nowrap",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: theme.spacing(0.5),
      }}
    >
      <Main href={href} label={label || "詳しくはコチラ"} />
      <ArrowForwardIosIcon />
    </Box>
  );
};

// リンクを作成するスタイル付きコンポーネント
export const LinkBox = styled(NextLink)(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.text?.primary || "blue",
  fontWeight: "bold",
  display: "flex",
  flexDirection: "column",
  textAlign: "center",
}));

interface BtnProps {
  handleClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  label: string;
  props?: React.ComponentPropsWithoutRef<typeof MuiLink>;
}

export const ButtonLink = ({ handleClick, label, props }: BtnProps) => {
  return (
    <MuiLink sx={{ cursor: "pointer" }}>
      <Typography
        onClick={handleClick}
        sx={{ fontSize: "1.25rem" }}
        underline="none"
        {...props}
        className={"atom-Link-Main"}
      >
        {label}
      </Typography>
    </MuiLink>
  );
};
