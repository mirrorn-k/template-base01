import { Typography } from "@mui/material";
import { FlexBox } from "@/packages/core/atoms/Box";
import * as Link from "@/packages/core/atoms/Link";

type tPageLink = {
  uuid: string;
  title: string;
};

/**
 * 記事詳細のページャー
 */
export const ArticlePager = ({
  prev,
  next,
}: {
  prev: tPageLink;
  next: tPageLink;
}) => {
  return (
    <FlexBox sx={{ justifyContent: "space-between", mt: 8 }}>
      {prev ? (
        <Link.LinkBox href={`${prev.uuid}`}>
          <Typography variant="body1" component="p">
            {prev.title}
          </Typography>
        </Link.LinkBox>
      ) : (
        <Typography variant="body1" component="p">
          前の記事はありません
        </Typography>
      )}
      {next ? (
        <Link.LinkBox href={`${next.uuid}`}>
          <Typography variant="body1" component="p">
            {next.title}
          </Typography>
        </Link.LinkBox>
      ) : (
        <Typography variant="body1" component="p">
          次の記事はありません
        </Typography>
      )}
    </FlexBox>
  );
};
