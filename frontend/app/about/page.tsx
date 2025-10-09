export const dynamic = "force-dynamic";
import SubpageKv from "@/components/kv/Subpage";
import getMenus from "@/functions/api/menus";
import ContentsSelecter from "@/packages/component/contents/Index";
import { getSubpageContents } from "@/functions/api/contents";
import Table01, { column } from "@/packages/component/table/Table01";
import ResponsiveBox, { FlexColumnBox } from "@/packages/core/atoms/Box";
import getAboutList from "@/functions/api/about";
import Contact01 from "@/components/contact/Contact01";
import getMeta from "@/packages/core/meta/api";

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
      <Contact01 />
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
