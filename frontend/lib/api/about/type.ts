import * as tMap from "@/types/ttnouMap";

export type tAboutContentType = tMap.tMapContentType;

export type tAboutItemType = tMap.tMapTypeItem;

export type tAboutContentItem = tMap.tMapContentItem<unknown>;

export type tAboutListContent = tMap.tMapContent<tAboutContentItem>;

export type tAboutApiResponse = tMap.tMapApiResponseList<tAboutListContent>;

// 整形後のフロント用シンプルデータ
export interface tAbout {
  uuid: string;
  label: string;
  value: string;
}
