// packages/api/getFormContent.ts
import getFetch from "@/packages/api/getFetch";
import { FormApiResponse, ListContent, tFormItem } from "./type";

interface Props {
  url: string;
}

export default async function getFormContent(
  props: Props
): Promise<tFormItem[]> {
  const res: FormApiResponse = await getFetch(props.url);
  return convert(res.listContent as ListContent[]);
}

function convert(contentList?: ListContent[]): tFormItem[] {
  if (!contentList) return [];

  try {
    const items: tFormItem[] = contentList.map((lc: ListContent) => {
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
        systemName: findValue("システム名"),
        label: findValue("項目名"),
        type: findType("入力形式"),
        required: findValue("必須") === "true" ? true : false,
        placeholder: findValue("プレースホルダー"),
        row: Number(findValue("行数")),
        options: findOptions("オプション"),
      };
      console.log("item", item);
      return item;
    });

    return items;
  } catch (error) {
    console.error("Error converting form content:", error);
    return [];
  }
}
