/**
 * objectList用
 */
export type ObjectAction<T> =
  | { type: 'SET_LIST'; items: T[] }
  | { type: 'ADD'; item: T }
  | { type: 'UPDATE'; index: number; item: Partial<T> }
  | { type: 'REMOVE'; index: number }
  | { type: 'CLEAR' };

export const objectReducer = <T>(state: T[], action: ObjectAction<T>): T[] => {
  switch (action.type) {
    case 'SET_LIST':
      return action.items;

    case 'ADD':
      return [...state, action.item];

    case 'UPDATE':
      return state.map((obj, index) => {
        if (index === action.index) {
          return { ...obj, ...action.item }; // 指定したインデックスのみ更新
        }
        return obj;
      });

    case 'REMOVE':
      // index番目の要素を削除
      return state.filter((_, index) => index !== action.index);

    case 'CLEAR':
      return [];

    default:
      return state;
  }
};

/**
 * keydObject用
 */
export type Action<T> =
  | { type: 'SET_LIST'; items: T } // 全体更新
  | { type: 'ADD'; key: keyof T; item: T[keyof T] } // 特定キーを追加
  | { type: 'UPDATE'; key: keyof T; item: T[keyof T] } // 特定キーをそのまま上書き
  | { type: 'UPDATE_MULTIPLE'; items: Partial<T> } // 🔥 複数項目を一括更新
  | { type: 'REMOVE'; key: keyof T } // 特定キー削除
  | { type: 'CLEAR' }; // 全削除

export const keyedObjectReducer = <T extends object>(
  state: T,
  action: Action<T>
): T => {
  switch (action.type) {
    case 'SET_LIST': // 全体更新
      return { ...action.items };

    case 'ADD': // 特定キーを新規セット
    case 'UPDATE': // 特定キーをそのまま上書き（キーがなければ追加）
      return { ...state, [action.key]: action.item };

    case 'UPDATE_MULTIPLE': // 🔥 複数項目を一括更新
      return {
        ...state,
        ...action.items, // 🔥 `Partial<T>` を適用して一括更新
      };

    case 'REMOVE': {
      // 特定キー削除
      const newState = { ...state };
      delete newState[action.key];
      return newState;
    }

    case 'CLEAR': // 全削除
      return {} as T;

    default:
      return state;
  }
};
