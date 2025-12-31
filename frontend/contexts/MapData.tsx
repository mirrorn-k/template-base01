"use client";
import { createContext, useState, ReactNode, useContext, useMemo } from "react";
import { tOrganize } from "@/lib/api/organize/type";
import { tResponsiveMediaContent } from "@/lib/api/media/type";
import { tFormItem } from "@/lib/api/contactForm/type";
import { INIT as INIT_ORGANIZE } from "@/lib/api/organize/const";
import { tPage } from "@/lib/api/page/type";
import { tMenuItem } from "@/types/ttnouMap";
import { RESPONSIVE_MEDIA_SUBPAGE_KV } from "@/const/ResponsiveImage";
import { tSite } from "@/lib/api/site/type";

interface DataContextProps {
  organize: tOrganize | null; // 会社情報
  logo: tResponsiveMediaContent | null; // ロゴ画像
  cfItems: tFormItem[]; // お問い合わせフォーム項目
  pages: tPage[];
  menus: tMenuItem[];
  site: tSite;
  getPageBySlug: (slug: string) => tPage | undefined;
}

// デフォルト値を定義
const defaultValue: DataContextProps = {
  organize: INIT_ORGANIZE,
  logo: null,
  cfItems: [],
  pages: [],
  menus: [],
  site: {} as tSite,
  getPageBySlug: () => undefined,
};

export const DataContext = createContext<DataContextProps>(defaultValue);

interface DataProviderProps {
  organize?: tOrganize;
  logo?: tResponsiveMediaContent | null;
  cfItems: tFormItem[];
  pages: tPage[];
  site: tSite;
  children: ReactNode;
}
export const Provider = (props: DataProviderProps) => {
  const [organize] = useState<tOrganize | null>(
    props.organize ?? INIT_ORGANIZE
  );
  const [logo] = useState<tResponsiveMediaContent | null>(props.logo ?? null);
  const [cfItems] = useState<tFormItem[]>(props.cfItems ?? []);
  const [pages] = useState<tPage[]>(props.pages ?? []);
  const [site] = useState<tSite>(props.site);

  const menus = useMemo(
    () =>
      pages.map(
        (page): tMenuItem => ({
          uuid: page.uuid,
          label: page.name,
          slug: page.slug,
          img: page.kv.kv ?? RESPONSIVE_MEDIA_SUBPAGE_KV,
          flgHeadr: page.settings.flgShowHeader ?? true,
          flgFooter: page.settings.flgShowFooter ?? true,
        })
      ),
    [pages]
  );

  const getPageBySlug = (slug: string): tPage | undefined => {
    return pages.find((page) => page.slug === slug);
  };

  return (
    <DataContext.Provider
      value={{ organize, logo, cfItems, pages, menus, site, getPageBySlug }}
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
