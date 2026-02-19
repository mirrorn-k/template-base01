export const dynamic = "force-dynamic";
import getAboutList from "@/lib/api/about";
import getPage from "@/lib/api/page/index";
import Content from "./Content";
import metaConvert from "@/lib/meta/converter";
import { getSite } from "@/lib/api/site/index";

// メタデータを設定
export async function generateMetadata() {
  const site = await getSite();
  const page = await getPage(site.uuid, `/about`);
  return metaConvert(page.meta);
}

export default async function Home() {
  const { aboutList } = await api();

  return <Content aboutList={aboutList ?? []} />;
}

const api = async () => {
  const [aboutList] = await Promise.all([getAboutList()]);

  return { aboutList };
};
