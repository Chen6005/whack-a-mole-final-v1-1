import { TARGET_POINTS } from "./gameConfig";
import type { TargetType } from "./gameTypes";

export interface ScoreResult {
  points: number;
  nextCombo: number;
  multiplierActive: boolean;
}

export function calculateHitScore(type: TargetType, combo: number, multiplierActive = false): ScoreResult {
  if (type === "bomb") {
    return { points: TARGET_POINTS.bomb, nextCombo: 0, multiplierActive: false };
  }

  const nextCombo = combo + 1;
  const comboBonus = nextCombo > 0 && nextCombo % 3 === 0 ? 5 : 0;
  const shouldMultiply = multiplierActive || nextCombo >= 10;
  const points = (TARGET_POINTS[type] + comboBonus) * (shouldMultiply ? 2 : 1);

  return { points, nextCombo, multiplierActive: shouldMultiply };
}

export function calculateAccuracy(hits: number, misses: number): number {
  const attempts = hits + misses;
  return attempts === 0 ? 0 : Math.round((hits / attempts) * 100);
}

export function getRank(score: number): "S" | "A" | "B" | "C" {
  if (score >= 600) return "S";
  if (score >= 400) return "A";
  if (score >= 220) return "B";
  return "C";
}

export function updateHighScore(currentHighScore: number, score: number): number {
  return Math.max(currentHighScore, score);
}
