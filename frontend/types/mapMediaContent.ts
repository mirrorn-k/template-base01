import { tMedia } from "@/packages/core/media/type";
import { Responsive } from "@/packages/core/function/responsiveValue/type";

export type tMediaContent = {
  name: string;
  caption: string;
  released_at: string;
} & Responsive<tMedia>;
