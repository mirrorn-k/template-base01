export const dynamic = "force-dynamic";
import getAboutList from "@/lib/api/about";
import getMeta from "@/lib/api/meta/index";
import Content from "./Content";

// メタデータを設定
export async function generateMetadata() {
  return await getMeta({ slug: "about" });
}

export default async function Home() {
  const { aboutList } = await api();

  return <Content aboutList={aboutList ?? []} />;
}

const api = async () => {
  const [aboutList] = await Promise.all([getAboutList()]);

  return { aboutList };
};
