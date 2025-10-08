/**
 * addonem CPサイトがベース
 */

import { Box, Typography } from "@mui/material";
import * as Image from "@/packages/component/media/Index";
import { FlexColumnBox } from "@/packages/core/atoms/Box";
import React from "react";
import { useRouter } from "next/navigation";
import Hashtags from "@/packages/component/hashtag/Hashtag01";
import { tMedia } from "@/packages/component/media/type";

/**
 * お知らせ形式
 */
export type tList02 = {
  uuid: string;
  kbn: string;
  title: string;
  caption: string;
  thumbnail: tMedia;
  tags?: string[];
  released_at: string;
};

const Main = ({ list, route }: { list: tList02[]; route: string }) => {
  const router = useRouter();
  return (
    <Box>
      <FlexColumnBox
        gapSize={2}
        sx={{
          padding: 2,
          borderTop: "1px solid #000",
          "&:last-child": {
            borderBottom: "1px solid #000",
          },
        }}
      >
        {list.map((notice) => (
          <Box
            key={`list-index-${notice.uuid}`}
            onClick={() => router.push(`/${route}/${notice.uuid}`)}
            sx={{
              display: "flex",
              gap: 2,
              cursor: "pointer",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
            }}
          >
            {/* 左：日時（固定幅） */}
            <Box
              sx={{
                flex: { xs: "100%", sm: "0 0 240px" }, // xsは自動幅、sm以上で固定
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h5"
                component="h5"
                className={`category-chip SNS`}
              >
                {notice.released_at.slice(0, 10).replace(/-/g, "/")}
              </Typography>
            </Box>

            {/* 中央：タイトル（残り幅） */}
            <Box
              sx={{
                flex: 1, // ← 残り幅いっぱい
                width: "100%", // xsのときは全幅
                minWidth: 0, // ← タイトル長い時に折り返しや省略効かせる用
                display: "flex",
                gap: 1,
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography variant="h4" component="h4" className="textAlignLeft">
                {notice.title}
              </Typography>

              <Hashtags tags={notice.tags || []} />
            </Box>

            {/* 右：サムネ（固定幅・PCのみ表示） */}
            {notice.thumbnail && (
              <Box
                sx={{
                  flex: "0 0 200px", // ← 固定幅
                  display: { xs: "none", md: "block" },
                }}
              >
                <Image.MediaImage
                  media={notice.thumbnail}
                  imgProps={{
                    height: 120,
                    width: 200,
                  }}
                />
              </Box>
            )}
          </Box>
        ))}
      </FlexColumnBox>
    </Box>
  );
};

export default Main;
