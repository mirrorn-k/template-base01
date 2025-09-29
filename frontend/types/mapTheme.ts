export interface ThemeContentItem {
  label: string; // "項目名" or "値"
  raw_value: string; // 実際の値
}

export interface ThemeListContent {
  content_items: ThemeContentItem[];
}

export interface ThemeApiResponse {
  listContent: ThemeListContent[];
}
