export const dynamic = "force-dynamic";
import Content from "./Content";
import getPage from "@/lib/api/page/index";
import metaConvert from "@/lib/meta/converter";

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
  const page = await getPage(`/${slug}`);
  return metaConvert(page.meta);
}

export default async function Home({
  params,
}: {
  params: Promise<{ slug?: string | string[] }>;
}) {
  const resolved = await params; // 👈 awaitが必須

  // 配列の場合は/で結合
  const slug = Array.isArray(resolved.slug)
    ? "/" + resolved.slug.join("/")
    : resolved.slug ?? "";

  return <Content slug={slug} />;
}
