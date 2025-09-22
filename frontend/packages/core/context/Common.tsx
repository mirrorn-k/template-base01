"use client";
import { createContext, useState, ReactNode, useContext } from "react";
import { useMediaQuery, useTheme } from "@mui/material";

interface DataContextProps {
  screenSize: "xs" | "sm" | "md" | "lg" | "xl";

  // セレクトビュー
  selectView: number; //現在のselectViewの値
  flgChange: (no?: number) => void; //selectViewを変更する関数

  // メニューモーダル
  flgMenus: boolean; // メニューモーダルの状態
  setFlgMenus: (flg: boolean) => void; // メニューモーダルの状態を変更する関数

  // 問い合わせモーダル
  flgContactModal: boolean; // 問い合わせモーダルの状態
  setFlgContactModal: (flg: boolean) => void; // 問い合わせモーダルの状態を変更する関数
}

// デフォルト値を定義
const defaultValue: DataContextProps = {
  screenSize: "xs",

  flgChange: () => {},
  selectView: 0,

  // メニューモーダル
  flgMenus: false,
  setFlgMenus: () => {},

  // 問い合わせモーダル
  flgContactModal: false,
  setFlgContactModal: () => {},
};

const maxSelectView = 1;

export const DataContext = createContext<DataContextProps>(defaultValue);

interface DataProviderProps {
  children: ReactNode;
}
export const Provider = (props: DataProviderProps) => {
  const [selectView, setSelectView] = useState<number>(0);

  const flgChange = (no?: number) => {
    if (no !== undefined) {
      setSelectView(no);
      return;
    }
    setSelectView((prev) => {
      if (prev === maxSelectView) {
        return 0;
      } else {
        return prev + 1;
      }
    });
  };

  const [flgMenus, setFlgMenus] = useState<boolean>(false);

  /**
   * 画面サイズ取得処理
   */
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isMd = useMediaQuery(theme.breakpoints.only("md"));
  const isLg = useMediaQuery(theme.breakpoints.only("lg"));
  const isXl = useMediaQuery(theme.breakpoints.only("xl"));

  let screenSize: "xs" | "sm" | "md" | "lg" | "xl" = "xs";
  if (isXs) screenSize = "xs";
  else if (isSm) screenSize = "sm";
  else if (isMd) screenSize = "md";
  else if (isLg) screenSize = "lg";
  else if (isXl) screenSize = "xl";

  // 問い合わせモーダルの状態
  const [flgContactModal, setFlgContactModal] = useState<boolean>(false);

  return (
    <DataContext.Provider
      value={{
        flgChange,
        selectView,
        screenSize,
        flgMenus,
        setFlgMenus,
        flgContactModal,
        setFlgContactModal,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};

export const useContents = (): DataContextProps => {
  const context = useContext(DataContext);
  if (!context)
    throw new Error(
      "useContents must be used within a packages Common Provider"
    );
  return context;
};
