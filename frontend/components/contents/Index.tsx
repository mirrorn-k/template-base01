import Content01 from "./Content01";
import Content02 from "./Content02";
import Content03 from "./Content03";
import Content04 from "./Content04";
import { tPage } from "@/lib/api/page/type";

interface Props {
  contents: tPage["contents"];
}

export default function Main({ contents }: Props) {
  console.log("Main contents", contents);

  return contents.map((data, index) => {
    switch (data.type) {
      case "content01":
        return (
          <Content01
            key={`top-content-${index}`}
            media={data.media}
            caption={data.caption}
            linkHref={data.linkHref}
            linkText={data.linkText}
          />
        );
      case "content02":
        return (
          <Content02
            key={`top-content-${index}`}
            media={data.media}
            title={data.title}
            caption={data.caption}
          />
        );
      case "content03":
        return (
          <Content03
            key={`top-content-${index}`}
            media={data.media}
            title={data.title}
            caption={data.caption}
            linkHref={data.linkHref}
            linkText={data.linkText}
          />
        );
      case "content04":
        return (
          <Content04
            key={`top-content-${index}`}
            media={data.media}
            title1={data.title1}
            title2={data.title2}
            caption={data.caption}
            linkHref={data.linkHref}
            linkText={data.linkText}
          />
        );
      default:
        console.log("未対応のコンテンツタイプ ", data);
        return <></>;
    }
  });
}
