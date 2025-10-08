import SubpageKv from "@/components/kv/Subpage";
import getMenus from "@/functions/api/menus";
import ContentsSelecter from "@/packages/component/contents/Index";
import { getSubpageContents } from "@/functions/api/contents";
import getMeta from "@/functions/api/meta";

// メタデータを設定
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  return await getMeta({ slug: params.slug || "" });
}

export default async function Home({ params }: { params: { slug: string } }) {
  const { menu, contents } = await api({ slug: params.slug });
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
