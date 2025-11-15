import getFetch from "@/lib/api/getFetch";
import { Responsive } from "@/lib/responsiveValue/type";
import { tMedia } from "@/types/ttnouMap";
import {
  tResponsiveMediaContent,
  tResponsiveMediaApiResponsive,
  tResponsiveMediaContentApi,
} from "@/lib/api/media/type";
import normalizeMediaUrl from "@/components/media/lib/nomalizeMediaUrl";

export default async function getItem({
  url,
}: {
  url: string;
}): Promise<tResponsiveMediaContent | undefined> {
  try {
    // API呼び出し
    const data: tResponsiveMediaApiResponsive = await getFetch(`${url}`);

    return convert(data.content);
  } catch (e) {
    console.error("[getContentItem] fetch error", e);
    return undefined;
  }
}

function convert(
  content?: tResponsiveMediaContentApi
): tResponsiveMediaContent | undefined {
  if (!content) return undefined;

  const responsive: Responsive<tMedia> = {
    xs: undefined,
    sm: undefined,
    md: undefined,
    lg: undefined,
    xl: undefined,
  };

  (["xs", "sm", "md", "lg", "xl"] as const).forEach((bp) => {
    const item = content.content_items.find((ci) => ci.label === bp);
    if (item?.content) {
      responsive[bp] = normalizeMediaUrl(item.content);
    }
  });

  return {
    uuid: content.uuid,
    contentType_uuid: content.contentType_uuid,
    domain: content.domain,
    order: content.order,
    name: content.name,
    caption: content.caption,
    released_at: content.released_at,
    deadline: content.deadline,
    created_at: content.created_at,
    updated_at: content.updated_at,
    deleted_at: content.deleted_at,
    content_items: responsive,
  };
}
