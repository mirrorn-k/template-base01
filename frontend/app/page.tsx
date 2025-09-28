import { Metadata } from "next";
import * as funcMeta from "@/packages/core/meta";
import KV from "@/components/kv/Index";

// メタデータを設定
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const resolved = await params;
  return funcMeta.getMetaData(resolved, "top");
}

export default function Home() {
  return <KV />;
}
