import Footer01 from "./Footer01";
import Footer02 from "./Footer02";
import getFooter from "@/lib/api/footer";

export default async function Main() {
  const content = await getFooter();

  console.log("Footerコンテンツ", content);

  if (content.type === "Footer01") {
    return (
      <Footer01 key={`footer-Footer01-${content.uuid}`} content={content} />
    );
  } else if (content.type === "Footer02") {
    return (
      <Footer02 key={`footer-Footer02-${content.uuid}`} content={content} />
    );
  } else {
    console.log("未対応のスタイル", content);
    return <></>;
  }
}
