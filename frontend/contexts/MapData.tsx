"use client";
import { createContext, useState, ReactNode, useContext } from "react";
import { tOrganize } from "@/lib/api/organize/type";
import { tResponsiveMediaContent } from "@/lib/api/media/type";
import { tMenuItem } from "@/lib/api/menu/type";
import { tFormItem } from "@/lib/api/contactForm/type";

interface DataContextProps {
  organize: tOrganize | null; // 会社情報
  logo: tResponsiveMediaContent | null; // ロゴ画像
  menus: tMenuItem[];
  cfItems: tFormItem[]; // お問い合わせフォーム項目
}

// デフォルト値を定義
const defaultValue: DataContextProps = {
  organize: null,
  logo: null,
  menus: [],
  cfItems: [],
};

export const DataContext = createContext<DataContextProps>(defaultValue);

interface DataProviderProps {
  initialOrganize?: tOrganize | null;
  logo?: tResponsiveMediaContent | null;
  menus: tMenuItem[];
  cfItems: tFormItem[];
  children: ReactNode;
}
export const Provider = (props: DataProviderProps) => {
  const [organize] = useState<tOrganize | null>(props.initialOrganize ?? null);
  const [logo] = useState<tResponsiveMediaContent | null>(props.logo ?? null);
  const [menus] = useState<tMenuItem[]>(props.menus ?? []);
  const [cfItems] = useState<tFormItem[]>(props.cfItems ?? []);

  return (
    <DataContext.Provider value={{ organize, logo, menus, cfItems }}>
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
