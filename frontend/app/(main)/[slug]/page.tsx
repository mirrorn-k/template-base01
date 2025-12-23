export const dynamic = "force-dynamic";
import getMeta from "@/lib/api/meta/index";
import Content from "./Content";

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

  // 配列の場合は/で結合
  const slug = Array.isArray(resolved.slug)
    ? "/" + resolved.slug.join("/")
    : resolved.slug ?? "";

  return <Content slug={slug} />;
}
