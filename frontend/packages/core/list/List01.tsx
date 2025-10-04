"use client";

import { Button, Box, Typography } from "@mui/material";
import * as Image from "@/packages/core/media/Index";
import { FlexColumnBox } from "@/packages/core/atoms/Box";
import { tMedia } from "@/packages/core/media/type";
import React from "react";
import Link from "next/link";
import { Responsive } from "@/packages/core/function/responsiveValue/type";
import * as ContextCommon from "@/packages/core/context/Common";
import { getResponsiveValue } from "@/packages/core/function/responsiveValue/index";

/**
 * お知らせ形式
 */
export type tList01 = {
  uuid: string;
  kbn: string;
  title: string;
  caption: string;
  img?: tMedia;
  released_at: string;
};

export const List01 = ({ list, route }: { list: tList01[]; route: string }) => {
  return (
    <Box>
      {list.map((item) => (
        <Link
          key={item.uuid}
          href={`/${route}/${item.uuid}`}
          style={{
            cursor: "pointer",
            borderBottom: "1px solid #ccc",
            paddingTop: 2,
          }}
        >
          <FlexColumnBox
            gapSize={2}
            sx={{
              flexDirection: { xs: "column", md: "row" },
              gap: "16px",
              alignItems: { xs: "left", md: "center" },
              padding: 2,
              borderTop: "1px solid #000",
              "&:last-child": {
                borderBottom: "1px solid #000",
              },
            }}
          >
            {/* 左: 日付 & 区分 */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "row", md: "column" },
                alignContent: "left",
                gap: 1,
                minWidth: { md: "150px" }, // 固定 or 最小幅
              }}
            >
              <Typography variant="body1">
                {item.released_at.split(" ")[0]}
              </Typography>
              <Typography variant="body1">{item.kbn}</Typography>
            </Box>

            {/* 中央: タイトル */}
            <Box
              sx={{
                flex: 1, // 残りを全部取る
              }}
            >
              <Typography variant="h6" component="h4" className="textAlignLeft">
                {item.title}
              </Typography>
            </Box>

            {/* 右: 画像 */}
            {item.img && (
              <Box
                sx={{
                  flexShrink: 0,
                  display: { xs: "none", md: "block" },
                  width: "200px", // 固定サイズ
                  height: "150px", // 必要なら高さも固定
                  overflow: "hidden",
                }}
              >
                <Image.MediaImage
                  media={item.img}
                  imgProps={{
                    style: {
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    },
                  }}
                />
              </Box>
            )}
          </FlexColumnBox>
        </Link>
      ))}
    </Box>
  );
};

type Props = {
  current: number;
  total: number;
  onChange: (page: number) => void;
};
export const Pagenation = ({ current, total, onChange }: Props) => {
  const pageNumbers = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <Box
      mt={4}
      display="flex"
      justifyContent="center"
      alignItems="center"
      gap={1}
    >
      {" "}
      <Button
        variant="outlined"
        color="primary"
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
      >
        {" "}
        &lt;{" "}
      </Button>{" "}
      {pageNumbers.map((num) => (
        <Button
          key={num}
          variant={num === current ? "contained" : "outlined"}
          color="primary"
          onClick={() => onChange(num)}
          sx={{
            minWidth: "60px",
            height: "60px",
            borderRadius: "50%",
            padding: 0,
            fontSize: "1.2rem",
          }}
        >
          {" "}
          {num}{" "}
        </Button>
      ))}{" "}
      <Button
        variant="outlined"
        color="primary"
        onClick={() => onChange(current + 1)}
        disabled={current === total}
      >
        {" "}
        &gt;{" "}
      </Button>{" "}
    </Box>
  );
};

/**
 * リストアイテムの詳細表示
 * @param param0
 * @returns
 */
export const Detail = ({ item }: { item: tList01 }) => {
  const { screenSize } = ContextCommon.useContents();

  const imgSize: Responsive<number> = { xs: 250, sm: 300, md: 380 };

  return (
    <FlexColumnBox gapSize={4}>
      <Image.MediaImage
        media={item.img}
        imgProps={{
          style: {
            maxHeight: getResponsiveValue<number>(imgSize, screenSize),
            maxWidth: "100%",
          },
        }}
      />
      <Typography
        variant="body1"
        component="p"
        dangerouslySetInnerHTML={{ __html: item.caption }}
      />
    </FlexColumnBox>
  );
};
