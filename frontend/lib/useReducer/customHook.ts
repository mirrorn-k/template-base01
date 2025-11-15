import arrayReducer, { findIndexInArray } from "./array";
import { keyedObjectReducer, objectReducer } from "./reducer";
import { useReducer } from "react";
import { tKeyedObjectReturn } from "./type";

// 通常の配列用
export const useArrayList = <T>(initialState: T[] = []) => {
  const [state, dispatch] = useReducer(arrayReducer<T>, initialState);

  return {
    list: state,
    addItem: (item: T) => dispatch({ type: "ADD", item }),
    updateItem: (index: number, item: T) =>
      dispatch({ type: "UPDATE", index, item }),
    removeItem: (index: number) => dispatch({ type: "REMOVE", index }),
    clearList: () => dispatch({ type: "CLEAR" }),
    find: (item: T) => findIndexInArray(state, item),
    switch: (item: T) => dispatch({ type: "SWITCH", item }),
  };
};

/**
 * 連想配列用のカスタムフック
 * @param initialState
 * @returns
 */
export const useKeyedObject = <T extends object>(
  initialState: T
): tKeyedObjectReturn<T> => {
  const [list, dispatch] = useReducer(keyedObjectReducer<T>, initialState);

  return {
    list,
    setList: (items: T) => dispatch({ type: "SET_LIST", items }),
    addItem: (key: keyof T, item: T[keyof T]) =>
      dispatch({ type: "ADD", key, item }),
    updateItem: (
      key: keyof T,
      item: T[keyof T] // 🔥 `Partial<T[keyof T]>` → `T[keyof T]`
    ) => dispatch({ type: "UPDATE", key, item }), // 🔥 部分更新ではなく、完全上書き
    updateItems: (
      items: Partial<T> // 🔥 複数項目を一括更新
    ) => dispatch({ type: "UPDATE_MULTIPLE", items }),
    removeItem: (key: keyof T) => dispatch({ type: "REMOVE", key }),
    clearList: () => dispatch({ type: "CLEAR" }),
  };
};

// 連想配列の配列（オブジェクトの配列）用
export const useObjectList = <T>(initialState: T[] = []) => {
  const [state, dispatch] = useReducer(objectReducer<T>, initialState);

  return {
    list: state,
    setList: (items: T[]) => dispatch({ type: "SET_LIST", items }),
    addItem: (item: T) => dispatch({ type: "ADD", item }),
    updateItem: (index: number, item: Partial<T>) =>
      dispatch({ type: "UPDATE", index, item }), // ✅ `index` を追加
    removeItem: (index: number) => dispatch({ type: "REMOVE", index }),
    clearList: () => dispatch({ type: "CLEAR" }),
  };
};
