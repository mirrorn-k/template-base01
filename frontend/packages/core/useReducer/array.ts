export type ArrayAction<T> =
  | { type: "FIND"; item: T }
  | { type: "ADD"; item: T }
  | { type: "UPDATE"; index: number; item: T }
  | { type: "REMOVE"; index: number }
  | { type: "CLEAR" }
  | { type: "SWITCH"; item: T };

const arrayReducer = <T>(
  state: T[],
  action: Exclude<ArrayAction<T>, { type: "FIND" }>
): T[] => {
  switch (action.type) {
    case "ADD":
      return [...state, action.item];

    case "UPDATE":
      return state.map((item, i) => (i === action.index ? action.item : item));

    case "REMOVE":
      return state.filter((_, i) => i !== action.index);

    case "CLEAR":
      return [];

    case "SWITCH": {
      const index = findIndexInArray(state, action.item);
      if (index >= 0) {
        // すでにあれば削除
        return state.filter((_, i) => i !== index);
      }
      // なければ追加
      return [...state, action.item];
    }

    default:
      return state;
  }
};

// find は別にする
export const findIndexInArray = <T>(state: T[], item: T): number => {
  return state.findIndex((v) => v === item);
};

export default arrayReducer;
