import { Typography, Box } from "@mui/material";
import React from "react";
import { TypographyProps } from "@mui/material/Typography";

type Props = {
  text: string[];
} & Omit<TypographyProps, "children">;

export default function Main({ text, ...rest }: Props) {
  return (
    <Typography
      variant="body1"
      component="h3"
      sx={{ textAlign: "center" }}
      gutterBottom
      {...rest}
    >
      {text.map((line, index) => (
        <React.Fragment key={index}>
          <Typography component="span">{line}</Typography>
          {text.length - 1 !== index && (
            <Box
              component="span"
              sx={{
                display: "inline-block",
                mx: 1,
                width: "1px",
                height: "1em",
                bgcolor: "text.primary",
              }}
            />
          )}
        </React.Fragment>
      ))}
    </Typography>
  );
}
