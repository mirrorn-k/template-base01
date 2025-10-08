"use client";
import { createContext, useState, ReactNode, useContext } from "react";
import { tOrganize } from "../organize/type";

interface DataContextProps {
  organize: tOrganize | null; // 会社情報
}

// デフォルト値を定義
const defaultValue: DataContextProps = {
  organize: null,
};

export const DataContext = createContext<DataContextProps>(defaultValue);

interface DataProviderProps {
  initialOrganize?: tOrganize | null;
  children: ReactNode;
}
export const Provider = (props: DataProviderProps) => {
  const [organize] = useState<tOrganize | null>(props.initialOrganize ?? null);

  return (
    <DataContext.Provider value={{ organize }}>
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
