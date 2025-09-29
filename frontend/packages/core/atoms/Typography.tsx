import { Typography, TypographyProps } from "@mui/material";
import { styled } from "@mui/system";
import { SxProps, Theme } from "@mui/material/styles";

type HtmlTextProps = TypographyProps & {
  text: string;
  sx?: SxProps<Theme>;
};

const HtmlTypography = styled(Typography)({});

export default function HtmlText({ text, sx, ...props }: HtmlTextProps) {
  return (
    <HtmlTypography
      {...props}
      sx={sx}
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
