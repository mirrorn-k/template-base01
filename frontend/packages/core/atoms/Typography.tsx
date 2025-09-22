import { Typography, TypographyProps } from "@mui/material";
import { styled } from "@mui/system";

type ContentTitleProps = TypographyProps & { component?: React.ElementType };

export const ContentTitle = styled(Typography)<ContentTitleProps>({
  "&::before": {
    content: '"◆"',
    marginRight: "0.5rem",
  },
});
