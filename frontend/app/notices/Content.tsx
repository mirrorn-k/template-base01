"use client";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import * as NewsList from "@/packages/core/list/List01";
import ResponsiveBox from "@/packages/core/atoms/Box";
import { useNotices } from "@/hooks/useNotices";

export const List = () => {
  // 何件目から表示しているか
  const [current, setCurrent] = useState<number>(1);

  const { notices, pagination, error, isLoading, mutate } = useNotices({
    page: current,
    limit: 10,
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  if (error) {
    return (
      <ResponsiveBox id={"news"} maxWidth={"lg"}>
        <Typography variant="h4" component="p">
          お知らせの取得に失敗しました。
        </Typography>
      </ResponsiveBox>
    );
  }

  if (isLoading) {
    return (
      <ResponsiveBox id={"news"} maxWidth={"lg"}>
        <Typography variant="h4" component="p">
          お知らせを取得中...
        </Typography>
      </ResponsiveBox>
    );
  }

  return (
    <ResponsiveBox id={"news"} maxWidth={"lg"}>
      {notices.length === 0 ? (
        <Typography variant="h4" component="p">
          現在お知らせはありません。
        </Typography>
      ) : (
        <NewsList.List01 list={notices} route={"notices"} />
      )}
      <NewsList.Pagenation
        current={pagination?.current_page || 1}
        total={pagination?.last_page || 1}
        onChange={(page: number) => setCurrent(page)}
      />
    </ResponsiveBox>
  );
};
