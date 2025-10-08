import type { ScenarioNode } from "./type";
import { evaluateCondition } from "./conversation";

export type ScenarioMap = Record<string, ScenarioNode>;

/** JSON配列を id → node のマップに変換 */
export function createScenarioMap(nodes: ScenarioNode[]): ScenarioMap {
  return Object.fromEntries(nodes.map((node) => [node.id, node]));
}

/** 会話状態を進めるためのユーティリティ */
export function getNextNode(
  scenarioMap: ScenarioMap,
  currentId: string,
  answer?: string | string[]
): ScenarioNode | undefined {
  const current = scenarioMap[currentId];
  if (!current) return;

  // 次のIDをまず決定
  let nextId: string | undefined;

  if (current.type === "choice") {
    if (answer) {
      const opt = current.options.find((o) => o.label === answer);
      nextId = opt?.nextId;
    }
  } else if (
    current.type === "select" ||
    current.type === "input" ||
    current.type === "message"
  ) {
    nextId = current.nextId;
  }

  if (!nextId) return;

  // 次ノードを取得
  let nextNode = scenarioMap[nextId];

  // branch を解決しきる
  while (nextNode?.type === "branch") {
    let matched: ScenarioNode | undefined;

    for (const cond of nextNode.conditions) {
      if (evaluateCondition(answer ?? "", cond.if)) {
        matched = scenarioMap[cond.nextId];
        break;
      }
    }

    if (!matched && nextNode.defaultNextId) {
      matched = scenarioMap[nextNode.defaultNextId];
    }

    if (!matched) return;
    nextNode = matched;
  }

  return nextNode;
}
