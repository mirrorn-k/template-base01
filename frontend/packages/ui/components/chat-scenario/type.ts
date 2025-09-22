// 会話ノードの種類
export type NodeType = "message" | "choice" | "select" | "input" | "branch";

/** 共通ノード型 */
export interface BaseNode {
  id: string;
  type: NodeType;
  text?: string;
  nextId?: string;
}

/** 単一選択肢 */
export interface ChoiceOption {
  label: string;
  nextId: string;
}

export interface ChoiceNode extends BaseNode {
  type: "choice";
  options: ChoiceOption[];
}

/** 複数選択肢 */
export interface SelectNode extends BaseNode {
  type: "select";
  options: string[]; // 複数選択可
  nextId: string; // 分岐させたい場合は branch に飛ばす
}

/** 自由入力 */
export interface InputNode extends BaseNode {
  type: "input";
}

/** メッセージ */
export interface MessageNode extends BaseNode {
  type: "message";
}

/** 条件式 */
export type ConditionExpr =
  | { includes: string } // 選択肢を含む
  | { equals: string } // 値と一致
  | { and: ConditionExpr[] }
  | { or: ConditionExpr[] }
  | { selectedCount: { op: "==" | ">" | "<" | ">=" | "<="; value: number } }; // 選択数

/** 分岐ノード */
export interface BranchCondition {
  if: ConditionExpr;
  nextId: string;
}

export interface BranchNode extends BaseNode {
  type: "branch";
  conditions: BranchCondition[];
  defaultNextId?: string;
}

/** 全体型 */
export type ScenarioNode =
  | ChoiceNode
  | SelectNode
  | InputNode
  | MessageNode
  | BranchNode;
