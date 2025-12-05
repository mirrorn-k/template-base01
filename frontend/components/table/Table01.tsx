"use client";

/**
 * ラベルと値の2カラム表示
 * 主な用途は会社概要のような情報表示
 */

import React from "react";
import styled from "@mui/material/styles/styled";
import { Grid2 as Grid, Typography } from "@mui/material";
import HtmlText from "@/atoms/Typography";

// 親Gridコンテナのカスタムスタイル
const GridContainer = styled(Grid)(({ theme }) => ({
  alignItems: "center", // 垂直方向の位置を揃える（必要に応じて）
  borderTop: "1px solid #ccc",
  "&:last-child": {
    borderBottom: "1px solid #ccc",
  },
  gap: theme.spacing(0),
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(1),
  },
}));

const CommonGridItem = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(1),
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(2),
  },
}));

const LabelGrid = styled(CommonGridItem)(({}) => ({
  textAlign: "center",
}));

const ValueGrid = styled(CommonGridItem)(({ theme }) => ({
  gridColumnStart: 2,
  marginLeft: "auto", // 親要素内で右寄せ
  [theme.breakpoints.down("md")]: {
    paddingTop: 0,
  },
}));

export type column = {
  uuid: string;
  label: string;
  value: string;
};

interface MainProps {
  items: column[];
}

const Main = ({ items }: MainProps) => {
  console.log("props.items", items);
  return (
    <>
      {items.map((item, index) => {
        return (
          <GridContainer container key={`table01-${index}-${item.uuid}`}>
            <LabelGrid size={{ xs: 10, sm: 4, md: 4 }}>
              <Typography
                variant="h6"
                component="h4"
                sx={(theme) => ({
                  fontWeight: 700,
                  whiteSpace: "normal",
                  wordBreak: "keep-all",
                  overflowWrap: "break-word",
                  [theme.breakpoints.down("sm")]: {
                    textAlign: "left",
                  },
                })}
              >
                {item.label}
              </Typography>
            </LabelGrid>
            <ValueGrid size={{ xs: 10, sm: 8, md: 8 }}>
              <HtmlText text={item.value} variant="body1" />
            </ValueGrid>
          </GridContainer>
        );
      })}
    </>
  );
};

export default Main;

export const testItems: column[] = [
  {
    uuid: "1",
    label: "会社名",
    value: "株式会社サンプル",
  },
  {
    uuid: "2",
    label: "所在地",
    value: "〒123-4567<br>東京都渋谷区道玄坂1-2-3 サンプルビル4F",
  },
  {
    uuid: "3",
    label: "設立",
    value: "2020年1月1日",
  },
  {
    uuid: "4",
    label: "資本金",
    value: "1,000万円",
  },
  {
    uuid: "5",
    label: "代表者",
    value: "山田 太郎",
  },
  {
    uuid: "6",
    label: "事業内容",
    value:
      "ウェブサービスの企画・開発・運営<br>ITコンサルティング<br>システムインテグレーション",
  },
];
