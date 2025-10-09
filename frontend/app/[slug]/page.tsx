export const dynamic = "force-dynamic";
import SubpageKv from "@/components/kv/Subpage";
import getMenus from "@/functions/api/menus";
import ContentsSelecter from "@/packages/component/contents/Index";
import { getSubpageContents } from "@/functions/api/contents";
import getMeta from "@/packages/core/meta/api";

// メタデータを設定
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string | string[] }>;
}) {
  const resolved = await params; // 👈 awaitが必須
  const slug = Array.isArray(resolved.slug)
    ? resolved.slug[0]
    : resolved.slug ?? "";
  return await getMeta({ slug });
}

export default async function Home({
  params,
}: {
  params: Promise<{ slug?: string | string[] }>;
}) {
  const resolved = await params; // 👈 awaitが必須
  const slug = Array.isArray(resolved.slug)
    ? resolved.slug[0]
    : resolved.slug ?? "";
  const { menu, contents } = await api({ slug });
  if (!menu) {
    return (
      <>
        <SubpageKv medias={undefined} title={"メニューが見つかりません"} />
      </>
    );
  }
  return (
    <>
      <SubpageKv medias={menu?.img} title={menu.label} />
      <ContentsSelecter contents={contents} />
    </>
  );
}

const api = async (props: { slug: string }) => {
  const menus = await getMenus();
  const menu = menus.find((m) => m.slug === props.slug);

  const contents = await getSubpageContents({ slug: props.slug });

  return { menu, contents };
};
