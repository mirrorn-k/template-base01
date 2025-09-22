export type KeyedObjectAction<T> =
  | { type: 'SET'; key: string; value: T } // 指定したキーの値を設定
  | { type: 'UPDATE'; key: string; value: Partial<T> } // 指定したキーの値を部分更新
  | { type: 'REMOVE'; key: string } // 指定したキーの値を削除
  | { type: 'CLEAR' }; // 連想配列を空にする

const keyedObjectReducer = <T>(
  state: Record<string, T>,
  action: KeyedObjectAction<T>
): Record<string, T> => {
  switch (action.type) {
    case 'SET':
      return { ...state, [action.key]: action.value };

    case 'UPDATE':
      return state[action.key]
        ? { ...state, [action.key]: { ...state[action.key], ...action.value } }
        : state;

    case 'REMOVE': {
      const newState = { ...state };
      delete newState[action.key];
      return newState;
    }
    case 'CLEAR':
      return {};

    default:
      return state;
  }
};

export default keyedObjectReducer;
