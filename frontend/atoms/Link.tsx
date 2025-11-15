"use client";
import MuiLink from "@mui/material/Link";
import Link from "next/link";
import { Typography, Box } from "@mui/material";
import ArrowIcon from "@/atoms/svg/ArrowIcon";
import { useTheme } from "@mui/material";
import styled from "@mui/system/styled";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface MainProps {
  href: string;
  label: string;
  props?: React.ComponentPropsWithoutRef<typeof MuiLink>;
}

export const Main = ({ href, label, props }: MainProps) => {
  return (
    <MuiLink component={Link} href={href}>
      <Typography
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
      sx={{
        display: "flex",
        flexFlow: "row nowrap",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: theme.spacing(0.5),
      }}
    >
      <Main href={href} label={label} />
      <ArrowForwardIosIcon />
    </Box>
  );
};

// リンクを作成するスタイル付きコンポーネント
export const LinkBox = styled(Link)(({ theme }) => ({
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
