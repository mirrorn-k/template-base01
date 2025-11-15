import Content01 from "./Content01";
import getFooter from "@/lib/api/footer";

export default async function Main() {
  const content = await getFooter();

  if (content.type === "Content01") {
    return (
      <Content01 key={`footer-content01-${content.uuid}`} contents={content} />
    );
  } else {
    console.log("未対応のスタイル TOP", content);
    return <></>;
  }
}
