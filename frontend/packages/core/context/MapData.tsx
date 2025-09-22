"use client";
import { createContext, useState, ReactNode, useContext } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import * as TypeForm from "../form/type";
import { tOrganize } from "../organize/type";

interface DataContextProps {
  ContactFormItems: TypeForm.tFormItem[]; // お問い合わせフォームの項目
  Organize: tOrganize | null; // 会社情報
}

// デフォルト値を定義
const defaultValue: DataContextProps = {
  ContactFormItems: [],
  Organize: null,
};

const maxSelectView = 1;

export const DataContext = createContext<DataContextProps>(defaultValue);

interface DataProviderProps {
  children: ReactNode;
}
export const Provider = (props: DataProviderProps) => {
  const [ContactFormItems, setContactFormItems] = useState<
    TypeForm.tFormItem[]
  >([]);
  const [Organize, setOrganize] = useState<tOrganize | null>(null);
  return (
    <DataContext.Provider value={{ ContactFormItems, Organize }}>
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
