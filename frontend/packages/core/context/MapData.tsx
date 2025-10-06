"use client";
import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { tOrganize } from "../organize/type";
import getOrganize from "../organize/api";

interface DataContextProps {
  Organize: tOrganize | null; // 会社情報
}

// デフォルト値を定義
const defaultValue: DataContextProps = {
  Organize: null,
};

export const DataContext = createContext<DataContextProps>(defaultValue);

interface DataProviderProps {
  children: ReactNode;
}
export const Provider = (props: DataProviderProps) => {
  const [Organize, setOrganize] = useState<tOrganize | null>(null);

  useEffect(() => {
    console.log("[MapData] useEffect");

    /**
     * 会社情報の取得とコンバート処理
     */
    /*
    const fetchOrg = async () => {
      const org: tOrganize | null = await getOrganize();
      setOrganize(org);
    };
    fetchOrg();
    */
  }, []);

  return (
    <DataContext.Provider value={{ Organize }}>
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
