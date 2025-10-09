import getFetch from "@/packages/core/api/getFetch";
import { Responsive } from "@/packages/core/function/responsiveValue/type";
import { tMedia } from "@/packages/component/media/type";
import { tMapContent, Content } from "@/packages/component/media/type";
import normalizeMediaUrl from "@/packages/component/media/lib/nomalizeMediaUrl";

export default async function getContentItem({
  url,
}: {
  url: string;
}): Promise<tMapContent | undefined> {
  // API呼び出し
  const data = await getFetch(`${url}`);

  return convert(data);
}

function convert(content?: Content): tMapContent | undefined {
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
