"use client";
import { Typography, TypographyProps } from "@mui/material";
import { styled } from "@mui/system";
import { SxProps, Theme } from "@mui/material/styles";

type CunstomTypoProps = TypographyProps & {
  text: string;
  sx?: SxProps<Theme>;
};

export default function HtmlText({ text, sx, ...props }: CunstomTypoProps) {
  return (
    <Typography
      {...props}
      sx={{
        whiteSpace: "pre-line",
        ...sx,
      }}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
}

type ContentTitleProps = TypographyProps & { component?: React.ElementType };

export const ContentTitle = styled(Typography)<ContentTitleProps>({
  "&::before": {
    content: '"◆"',
    marginRight: "0.5rem",
  },
});

/**
 * 左にマークを表示するTypographyコンポーネント
 * @param param0
 * @returns
 */
export function BeforeMark({
  mark,
  text,
  sx,
  ...props
}: CunstomTypoProps & { mark: string }) {
  return (
    <Typography
      {...props}
      sx={{
        "&::before": {
          content: `"${mark}"`,
          marginRight: "0.5rem",
        },
        ...sx,
      }}
    >
      {text}
    </Typography>
  );
}
