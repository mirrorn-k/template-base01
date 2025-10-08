import { tMedia } from "@/packages/component/media/type";
import { Responsive } from "@/packages/core/function/responsiveValue/type";

export type tMediaContent = {
  name: string;
  caption: string;
  released_at: string;
} & Responsive<tMedia>;
