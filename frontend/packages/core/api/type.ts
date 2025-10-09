/**
 * APIのパラメータ型
 */
export type tParams<T> = {
  page?: number;
  limit?: number;
  filter?: T;
  orderby?: { field: string; direction: "asc" | "desc" }[];
};
