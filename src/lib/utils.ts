import { matchLevelConfig, type MatchLevel } from "@/data/foods";

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function getMatchConfig(level: MatchLevel) {
  return matchLevelConfig[level];
}

export function storeQuizResult(result: { primaryType: string; secondaryType: string | null; scores: Record<string, number> }) {
  if (typeof window !== "undefined") {
    localStorage.setItem("tcm_constitution_result", JSON.stringify(result));
  }
}

export function getQuizResult(): { primaryType: string; secondaryType: string | null; scores: Record<string, number> } | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("tcm_constitution_result");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function clearQuizResult() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("tcm_constitution_result");
  }
}

export function storeBodyData(data: Record<string, string>) {
  if (typeof window !== "undefined") {
    localStorage.setItem("tcm_body_data", JSON.stringify(data));
  }
}

export function getBodyData(): Record<string, string> | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("tcm_body_data");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
  }
  return null;
}
