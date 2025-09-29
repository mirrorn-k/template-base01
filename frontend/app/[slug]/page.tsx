import { Metadata } from "next";
import SUbpageKv from "@/components/kv/Subpage";
import { IMAGE_SUBPAGE_KV } from "@/const/Image";

// メタデータを設定
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const resolved = await params;
  return {};
}

export default function Home() {
  return (
    <>
      <SUbpageKv media={IMAGE_SUBPAGE_KV} title="サブページのKV" />
    </>
  );
}
