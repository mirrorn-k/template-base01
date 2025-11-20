"use client";
import { createContext, useState, ReactNode, useContext } from "react";
import { tOrganize } from "@/lib/api/organize/type";
import { tResponsiveMediaContent } from "@/lib/api/media/type";
import { tMenuItem } from "@/lib/api/menu/type";
import { tFormItem } from "@/lib/api/contactForm/type";
import { tHeaderItem } from "@/lib/api/header/type";
import { INIT as INIT_HEADER } from "@/lib/api/header/const";
import { INIT as INIT_ORGANIZE } from "@/lib/api/organize/const";

interface DataContextProps {
  organize: tOrganize | null; // 会社情報
  logo: tResponsiveMediaContent | null; // ロゴ画像
  menus: tMenuItem[];
  cfItems: tFormItem[]; // お問い合わせフォーム項目
  header: tHeaderItem;
}

// デフォルト値を定義
const defaultValue: DataContextProps = {
  organize: INIT_ORGANIZE,
  logo: null,
  menus: [],
  cfItems: [],
  header: INIT_HEADER,
};

export const DataContext = createContext<DataContextProps>(defaultValue);

interface DataProviderProps {
  organize?: tOrganize;
  logo?: tResponsiveMediaContent | null;
  menus: tMenuItem[];
  cfItems: tFormItem[];
  header: tHeaderItem;
  children: ReactNode;
}
export const Provider = (props: DataProviderProps) => {
  const [organize] = useState<tOrganize | null>(
    props.organize ?? INIT_ORGANIZE
  );
  const [logo] = useState<tResponsiveMediaContent | null>(props.logo ?? null);
  const [menus] = useState<tMenuItem[]>(props.menus ?? []);
  const [cfItems] = useState<tFormItem[]>(props.cfItems ?? []);
  const [header] = useState<tHeaderItem>(props.header ?? INIT_HEADER);

  return (
    <DataContext.Provider value={{ organize, logo, menus, cfItems, header }}>
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
