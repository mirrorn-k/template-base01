// packages/api/getFormContent.ts
import getFetch from "@/lib/api/getFetch";
import { tFormApiResponse, tListContent, tFormItem } from "./type";

interface Props {
  url: string;
}

export default async function getFormContent(
  props: Props
): Promise<tFormItem[]> {
  try {
    const res: tFormApiResponse = await getFetch(props.url);
    return convert(res.listContent as tListContent[]);
  } catch (error) {
    console.error("Error fetching form content:", error);
    return [];
  }
}

function convert(contentList?: tListContent[]): tFormItem[] {
  if (!contentList) return [];

  try {
    const items: tFormItem[] = contentList.map((lc: tListContent) => {
      const findValue = (label: string) =>
        lc.content_items.find((ci) => ci.label === label)?.raw_value ?? "";

      const findType = (label: string) => {
        const inputType =
          lc.content_items.find((ci) => ci.label === label)?.raw_value ??
          "テキスト";

        if (inputType === "テキスト") return "text";
        if (inputType === "複数行テキスト") return "textarea";
        if (inputType === "メールアドレス") return "email";
        if (inputType === "数値") return "number";
        if (inputType === "電話番号") return "text";
        if (inputType === "択一選択") return "select";
        if (inputType === "複数選択") return "checkbox";
        return "text";
      };

      const findOptions = (label: string) => {
        const options = lc.content_items.find(
          (ci) => ci.label === label
        )?.options;
        if (options) return options;
        return [];
      };

      // 型変換
      const item: tFormItem = {
        uuid: lc.uuid,
        systemName: findValue("システム名") as string,
        label: lc.name as string,
        type: findType("入力形式"),
        required: findValue("必須") ? true : false,
        placeholder: findValue("プレースホルダー") as string,
        row: Number(findValue("行数")),
        options: findOptions("オプション"),
      };
      return item;
    });

    return items;
  } catch (error) {
    console.error("Error converting form content:", error);
    return [];
  }
}
