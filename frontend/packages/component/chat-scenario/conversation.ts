import { ConditionExpr } from "./type";

/**
 * チャットbot分岐判定処理
 * @param answer
 * @param expr
 * @returns
 */
export function evaluateCondition(
  answer: string | string[],
  expr: ConditionExpr
): boolean {
  if ("includes" in expr) {
    return Array.isArray(answer)
      ? answer.includes(expr.includes)
      : answer === expr.includes;
  }
  if ("equals" in expr) {
    return answer === expr.equals;
  }
  if ("and" in expr) {
    return expr.and.every((e) => evaluateCondition(answer, e));
  }
  if ("or" in expr) {
    return expr.or.some((e) => evaluateCondition(answer, e));
  }
  if ("selectedCount" in expr) {
    if (!Array.isArray(answer)) return false;
    const count = answer.length;
    switch (expr.selectedCount.op) {
      case "==":
        return count === expr.selectedCount.value;
      case ">":
        return count > expr.selectedCount.value;
      case "<":
        return count < expr.selectedCount.value;
      case ">=":
        return count >= expr.selectedCount.value;
      case "<=":
        return count <= expr.selectedCount.value;
    }
  }
  return false;
}
