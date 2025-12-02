export const dynamic = "force-dynamic";
import SubpageKv from "@/components/kv/Subpage";
import getMenus from "@/lib/api/menu/index";
import ContentsSelecter from "@/components/contents/Index";
import { getSubpageContents } from "@/lib/api/contents";
import Table01, { column } from "@/components/table/Table01";
import ResponsiveBox, { FlexColumnBox } from "@/atoms/Box";
import getAboutList from "@/lib/api/about";
import getMeta from "@/lib/api/meta/index";

// メタデータを設定
export async function generateMetadata() {
  return await getMeta({ slug: "about" });
}

export default async function Home() {
  const { menu, contents, convertedAboutList } = await api({ slug: "about" });
  if (!menu) {
    return (
      <>
        <SubpageKv medias={undefined} title={"メニューが見つかりません"} />
      </>
    );
  }
  return (
    <FlexColumnBox gapSize={8}>
      <SubpageKv medias={menu?.img} title={menu.label} />
      <ResponsiveBox maxWidth="md" sx={{ m: "auto", p: 2 }}>
        <Table01 items={convertedAboutList} />
      </ResponsiveBox>
      <ContentsSelecter contents={contents} />
    </FlexColumnBox>
  );
}

const api = async (props: { slug: string }) => {
  const [menus, contents, aboutList] = await Promise.all([
    getMenus(),
    getSubpageContents({ slug: props.slug }),
    getAboutList(),
  ]);

  const menu = menus.find((m) => m.slug === props.slug);

  // aboutList の型をcolumn[]に変換
  const convertedAboutList: column[] =
    aboutList?.map((item) => ({
      uuid: item.uuid.toString(),
      label: item.label,
      value: item.value,
    })) || [];

  return { menu, contents, convertedAboutList };
};
