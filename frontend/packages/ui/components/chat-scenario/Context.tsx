"use client";

import React, { useEffect, createContext, useContext, useState } from "react";
import { scenarioMap } from "@/component/chat-scenario/scenarios/index"; // ← プロジェクト側のJSONを集約
import type {
  ScenarioNode,
  BaseNode,
} from "@/packages/ui/components/chat-scenario/type";
import { getNextNode } from "@/packages/ui/components/chat-scenario"; // ← requireではなくimport
import {
  useArrayList,
  useKeyedObject,
} from "@/packages/core/useReducer/customHook";
import {
  tArrayListReturn,
  tKeyedObjectReturn,
} from "@/packages/core/useReducer/type";

type UserAnswers = Record<string, string | string[]>;

type ContextValue = {
  currentId: string;
  node: ScenarioNode;
  history: tArrayListReturn<BaseNode["id"]>;
  goNext: (answer?: string | string[], nodeId?: ScenarioNode["id"]) => void;

  // 追加
  admin: { name: string; imageSrc: string };
  customer: { name: string; imageSrc: string };
  answers: tKeyedObjectReturn<UserAnswers>;
};

const Context = createContext<ContextValue | undefined>(undefined);

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [currentId, setCurrentId] = useState("start"); // 最初のノードIDを指定
  const history = useArrayList<BaseNode["id"]>([]); // 最初に start を入れておく
  const answers = useKeyedObject<UserAnswers>({});

  useEffect(() => {
    if (history.list.length === 0) return; // 履歴が空なら何もしない
    const lastNodeId = history.list[history.list.length - 1];
    const lastNode = scenarioMap[lastNodeId];
    if (!lastNode) return;

    // 選択肢の場合だけ回答によって次のノードが変わるので別処理
    if (lastNode.type === "message") {
      const nextNode = getNextNode(scenarioMap, lastNodeId);
      if (nextNode) {
        setCurrentId(nextNode.id);
      }
    } else {
      // answers に回答が存在するかをチェック
      const answer = answers.list[lastNodeId];
      if (answer === undefined) {
        setCurrentId(lastNodeId); // 無回答なので現在位置に
      } else {
        // 回答がある場合は次のノードを取得して進める
        const nextNode = getNextNode(scenarioMap, lastNodeId, answer);
        if (nextNode) {
          setCurrentId(nextNode.id);
        }
      }
    }
  }, []);

  useEffect(() => {
    console.log("Current ID changed:", currentId);
    // typeがmessageの場合は自動で次へ進む
    const node = scenarioMap[currentId];
    if (node && node.type === "message") {
      const timer = setTimeout(() => {
        const nextNode = getNextNode(scenarioMap, currentId);
        if (nextNode) {
          history.addItem(currentId);
          setCurrentId(nextNode.id);
        }
      }, 1000); // 1秒後に次へ進む

      return () => clearTimeout(timer); // クリーンアップ
    }
  }, [currentId]);

  // 管理者・お客様のプロフィール（固定でOKならここに書く）
  const admin = { name: "addonem 木本", imageSrc: "/tmp/キングダム大沢.jpeg" };
  const customer = { name: "あなた", imageSrc: "/tmp/綺麗なジャイアン.jpg" };

  const node = scenarioMap[currentId];

  const goNext = (answer?: string | string[], nodeId?: ScenarioNode["id"]) => {
    if (!nodeId) {
      nodeId = currentId;
    }

    if (answer !== undefined) {
      // 回答を保存
      answers.addItem(nodeId, answer);
    }

    const nextNode = getNextNode(scenarioMap, nodeId, answer);
    alert("goNext: " + (nextNode ? nextNode.id : "undefined"));
    if (nextNode) {
      history.addItem(nodeId);
      setCurrentId(nextNode.id);
    }
  };

  return (
    <Context.Provider
      value={{
        currentId,
        node,
        history,
        goNext,
        admin,
        customer,
        answers,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useContexts = () => {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error("useChatScenario must be used within ChatScenarioProvider");
  }
  return ctx;
};
