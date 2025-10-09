"use client";

import useSWR from "swr";
import axios from "axios";
import * as tMapNotice from "@/types/mapNotice";
import { tList01 } from "@/packages/component/list/List01";
import { tParams } from "@/packages/core/api/type";
import { PaginationMeta } from "@/packages/component/list/type";
import normalizeMediaUrl from "@/packages/component/media/lib/nomalizeMediaUrl";

export type tTerms = {
  id?: number;
};

const fetcher = <T>(url: string, params?: tParams<tTerms>) =>
  axios.get<T>(url, { params }).then((res) => res.data);

function convert(contentList?: tMapNotice.NoticeContent[]): tList01[] {
  if (!contentList) return [];
  return contentList.map((item) => {
    const findValue = (label: string) =>
      item.content_items.find((ci) => ci.label === label)?.raw_value ?? "";

    const findMedia = (label: string) => {
      const m = item.content_items.find((ci) => ci.label === label)?.content;
      return normalizeMediaUrl(m || undefined);
    };

    return {
      uuid: item.uuid,
      kbn: findValue("区分"),
      title: findValue("タイトル"),
      caption: findValue("キャプション"),
      img: findMedia("イメージ"),
      released_at: item.released_at,
    };
  });
}

export function useNotices(props: tParams<tTerms>) {
  const baseUrl = process.env.NEXT_PUBLIC_MAP_API_NOTICES!;

  const { data, error, isLoading, mutate } = useSWR<
    tMapNotice.NoticesApiResponse, // Data 型
    Error, // Error 型
    [string, tParams<tTerms>] // Key 型
  >([baseUrl, props], ([url, params]) => fetcher(url, params), {
    refreshInterval: 60000,
  });

  const notices = Array.isArray(data?.listContent.data)
    ? convert(data?.listContent.data)
    : [];

  const pagination: PaginationMeta = data?.listContent as PaginationMeta;

  return { notices, pagination, error, isLoading, mutate };
}
