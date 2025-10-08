// components/chat-scenario/HistoryView.tsx
"use client";

import { Box } from "@mui/material";
import SpeechBubble from "@/packages/ui/components/chat-scenario/ChatBubble";
import { scenarioMap } from "@/component/chat-scenario/scenarios/index";
import { useContexts } from "@/packages/ui/components/chat-scenario/Context";

type ViewProps = {
  isBusy?: boolean; // チャットが処理中かどうか
};
export default function HistoryView({ isBusy = true }: ViewProps) {
  const { currentId, history, admin, customer, answers } = useContexts();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        backgroundColor: "yellow",
      }}
    >
      {history.list.map((id, idx) => {
        if (isBusy) {
          // 履歴のノード情報を判定
          if (idx === history.list.length - 1) {
            if (id === currentId) return null; // 最後の履歴が現在地と同じなら表示しない
          }
        }

        const node = scenarioMap[id];
        const rtn = [];
        if (!node) return null;

        // 1) botのメッセージを表示
        rtn.push(
          <SpeechBubble
            key={`${id}-bot`}
            imageSrc={admin.imageSrc}
            name={admin.name}
            message={node.text}
            align="left"
            shape="rounded"
          />
        );

        if (node.type === "message") return rtn; // messageならここで終了

        // 2) message以外はユーザー回答を表示（なければ未回答=現在位置）
        const ans = answers.list[id]; // hook側のgetter名に合わせて適宜変更
        const message =
          ans === undefined
            ? "未回答（現在位置）"
            : Array.isArray(ans)
            ? ans.join("、")
            : ans;

        rtn.push(
          <SpeechBubble
            key={`${id}-user`}
            imageSrc={customer.imageSrc}
            name={customer.name}
            message={message}
            align="right"
          />
        );

        return rtn;
      })}
    </Box>
  );
}
