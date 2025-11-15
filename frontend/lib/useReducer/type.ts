/**
 * 単純な配列用
 */
export type tArrayListReturn<T> = {
  list: T[];
  addItem: (item: T) => void;
  updateItem: (index: number, item: T) => void;
  removeItem: (index: number) => void;
  clearList: () => void;
};

/**
 * 連想配列用
 */
export type tKeyedObjectReturn<T extends object> = {
  list: T;
  setList: (items: T) => void; // 全体をセット
  addItem: (key: keyof T, item: T[keyof T]) => void; // 特定キーを追加
  updateItem: (key: keyof T, item: T[keyof T]) => void; // 特定キーの部分更新
  updateItems: (items: Partial<T>) => void; // 🔥 複数項目を一括更新
  removeItem: (key: keyof T) => void; // 特定キーを削除
  clearList: () => void; // 全削除
};

/**
 * オブジェクトの配列用
 */
export type tObjectListReturn<T extends { id?: number }> = {
  list: T[];
  setList: (items: T[]) => void;
  addItem: (item: T) => void;
  updateItem: (id: number, item: Partial<T>) => void;
  removeItem: (id: number) => void;
  clearList: () => void;
};
