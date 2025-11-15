import React from "react";
import { Typography } from "@mui/material";
import { FlexBox } from "@/atoms/Box";

const Main = ({ tags }: { tags: string[] }) => {
  if (!tags || tags.length === 0) {
    return null; // タグがない場合は何も表示しない
  }
  try {
    return (
      <FlexBox
        sx={{
          justifyContent: "right",
          marginRight: "1rem",
          marginLeft: "auto",
          flexFlow: "wrap",
        }}
      >
        {tags.map((tag, index) => (
          <Typography
            key={index}
            variant="h5"
            component="h5"
            className={"hashtag"}
            sx={{ whiteSpace: "nowrap" }}
          >
            {tag}
          </Typography>
        ))}
      </FlexBox>
    );
  } catch (e) {
    console.error("Error rendering hashtags:", tags, e);
    return null; // エラーが発生した場合は何も表示しない
  }
};

export default Main;
