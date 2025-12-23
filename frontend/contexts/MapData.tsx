"use client";
import { createContext, useState, ReactNode, useContext, useMemo } from "react";
import { tOrganize } from "@/lib/api/organize/type";
import { tResponsiveMediaContent } from "@/lib/api/media/type";
import { tFormItem } from "@/lib/api/contactForm/type";
import { tHeaderItem } from "@/lib/api/header/type";
import { INIT as INIT_HEADER } from "@/lib/api/header/const";
import { INIT as INIT_ORGANIZE } from "@/lib/api/organize/const";
import { tPage, tMenuItem } from "@/lib/api/page/type";

interface DataContextProps {
  organize: tOrganize | null; // 会社情報
  logo: tResponsiveMediaContent | null; // ロゴ画像
  cfItems: tFormItem[]; // お問い合わせフォーム項目
  header: tHeaderItem;
  pages: tPage[];
  menus: tMenuItem[];
  getPageBySlug: (slug: string) => tPage | undefined;
}

// デフォルト値を定義
const defaultValue: DataContextProps = {
  organize: INIT_ORGANIZE,
  logo: null,
  cfItems: [],
  header: INIT_HEADER,
  pages: [],
  menus: [],
  getPageBySlug: () => undefined,
};

export const DataContext = createContext<DataContextProps>(defaultValue);

interface DataProviderProps {
  organize?: tOrganize;
  logo?: tResponsiveMediaContent | null;
  cfItems: tFormItem[];
  header: tHeaderItem;
  pages: tPage[];
  children: ReactNode;
}
export const Provider = (props: DataProviderProps) => {
  const [organize] = useState<tOrganize | null>(
    props.organize ?? INIT_ORGANIZE
  );
  const [logo] = useState<tResponsiveMediaContent | null>(props.logo ?? null);
  const [cfItems] = useState<tFormItem[]>(props.cfItems ?? []);
  const [header] = useState<tHeaderItem>(props.header ?? INIT_HEADER);
  const [pages] = useState<tPage[]>(props.pages ?? []);

  const menus = useMemo(
    () =>
      pages.map((page) => ({
        uuid: page.uuid,
        label: page.settings.title,
        slug: page.slug,
        img: page.settings.kv,
      })),
    [pages]
  );

  const getPageBySlug = (slug: string): tPage | undefined => {
    return pages.find((page) => page.slug === slug);
  };

  return (
    <DataContext.Provider
      value={{ organize, logo, cfItems, header, pages, menus, getPageBySlug }}
    >
      {props.children}
    </DataContext.Provider>
  );
};

export const Contents = (): DataContextProps => {
  const context = useContext(DataContext);
  if (!context)
    throw new Error("useContents must be used within a MapDataProvider");
  return context;
};
