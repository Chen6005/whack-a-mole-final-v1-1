import { calculateAccuracy } from "./scoring";
import type { GameState, LevelConfig, LevelProgress, LevelRecord, LevelResult } from "./gameTypes";

const level = (
  id: number,
  name: string,
  duration: number,
  goalType: LevelConfig["goalType"],
  goalValue: number,
  targetScore: number,
  speedMultiplier: number,
  specialMultiplier: number,
  bombMultiplier: number,
  comboRequirement = 0,
  isBoss = false,
): LevelConfig => ({
  id, name, duration, goalType, goalValue, targetScore, speedMultiplier,
  specialMultiplier, bombMultiplier, comboRequirement, isBoss,
});

export const LEVELS: LevelConfig[] = [
  level(1, "新芽練習", 30, "score", 70, 70, 1, 0.82, 0.55),
  level(2, "花圃巡邏", 32, "hits", 7, 95, 1.02, 0.88, 0.62),
  level(3, "連擊暖身", 34, "combo", 4, 115, 1.04, 0.92, 0.68, 4),
  level(4, "黃金花粉", 34, "golden", 1, 135, 1.06, 1.1, 0.7),
  level(5, "炸彈警報", 35, "noBomb", 120, 150, 1.08, 1, 1.18, 3, true),
  level(6, "晨光快手", 36, "score", 170, 190, 1.1, 1.02, 0.82),
  level(7, "泥土節拍", 36, "hits", 13, 210, 1.12, 1.04, 0.86),
  level(8, "護甲隊長", 38, "special", 6, 230, 1.14, 1.22, 0.88, 4),
  level(9, "金色連線", 38, "golden", 2, 250, 1.16, 1.28, 0.9),
  level(10, "園丁試煉", 40, "score", 280, 310, 1.18, 1.15, 1.12, 5, true),
  level(11, "風車加速", 40, "hits", 18, 330, 1.2, 1.14, 0.98),
  level(12, "十連擊", 42, "combo", 10, 350, 1.22, 1.18, 1, 10),
  level(13, "藍鐘滴答", 42, "special", 9, 380, 1.24, 1.32, 1.02, 5),
  level(14, "黃金收成", 43, "golden", 3, 410, 1.26, 1.42, 1.04),
  level(15, "雷雨花園", 44, "noBomb", 360, 450, 1.28, 1.28, 1.38, 6, true),
  level(16, "疾風草原", 44, "score", 470, 510, 1.3, 1.24, 1.08),
  level(17, "土丘連打", 45, "hits", 24, 530, 1.32, 1.26, 1.1),
  level(18, "金盾混戰", 46, "special", 13, 560, 1.34, 1.48, 1.12, 7),
  level(19, "閃耀時刻", 46, "golden", 4, 590, 1.36, 1.56, 1.14),
  level(20, "暮色守衛", 47, "combo", 14, 640, 1.38, 1.42, 1.42, 14, true),
  level(21, "花火狂奔", 48, "score", 680, 730, 1.4, 1.38, 1.18),
  level(22, "極速園遊", 48, "hits", 31, 770, 1.42, 1.4, 1.2),
  level(23, "黃金風暴", 49, "golden", 5, 810, 1.44, 1.68, 1.22),
  level(24, "連擊大師", 50, "combo", 18, 850, 1.46, 1.48, 1.24, 18),
  level(25, "炸彈迷宮", 50, "noBomb", 760, 910, 1.48, 1.52, 1.72, 10, true),
  level(26, "護甲浪潮", 52, "special", 18, 950, 1.5, 1.72, 1.3, 12),
  level(27, "黎明衝刺", 52, "score", 1020, 1100, 1.52, 1.58, 1.32),
  level(28, "花園英雄", 54, "hits", 42, 1160, 1.54, 1.62, 1.34),
  level(29, "傳說連擊", 55, "combo", 24, 1240, 1.56, 1.68, 1.38, 24),
  level(30, "終極園丁", 60, "special", 24, 1380, 1.6, 1.9, 1.75, 18, true),
];

export function getLevel(levelId: number | null): LevelConfig | null {
  return levelId === null ? null : LEVELS.find((item) => item.id === levelId) ?? null;
}

export function getLevelGoalLabel(config: LevelConfig): string {
  switch (config.goalType) {
    case "score": return `獲得 ${config.goalValue} 分`;
    case "hits": return `命中 ${config.goalValue} 隻地鼠`;
    case "combo": return `達成 ${config.goalValue} Combo`;
    case "noBomb": return `零炸彈並獲得 ${config.goalValue} 分`;
    case "golden": return `命中 ${config.goalValue} 隻黃金地鼠`;
    case "special": return `命中 ${config.goalValue} 隻特殊地鼠`;
  }
}

export function getLevelGoalProgress(config: LevelConfig, state: GameState): number {
  switch (config.goalType) {
    case "score": return state.score;
    case "hits": return state.hits;
    case "combo": return state.maxCombo;
    case "noBomb": return state.score;
    case "golden": return state.goldenHits;
    case "special": return state.specialHits;
  }
}

export function evaluateLevel(config: LevelConfig, state: GameState): LevelResult {
  const goalProgress = getLevelGoalProgress(config, state);
  const noBombPassed = config.goalType !== "noBomb" || state.bombHits === 0;
  const comboPassed = state.maxCombo >= config.comboRequirement;
  const passed = goalProgress >= config.goalValue && noBombPassed && comboPassed;
  if (!passed) return { levelId: config.id, passed, stars: 0, goalProgress };

  const accuracy = calculateAccuracy(state.hits, state.misses);
  let stars = 1;
  if (state.score >= config.targetScore && accuracy >= 65) stars += 1;
  if (state.score >= Math.round(config.targetScore * 1.35) && accuracy >= 80 && state.maxCombo >= Math.max(3, config.comboRequirement)) stars += 1;
  return { levelId: config.id, passed, stars, goalProgress };
}

export function createDefaultLevelProgress(): LevelProgress {
  return { unlockedLevel: 1, records: {} };
}

export function updateLevelProgress(progress: LevelProgress, result: LevelResult, score: number): LevelProgress {
  const previous: LevelRecord = progress.records[result.levelId] ?? { stars: 0, highScore: 0 };
  return {
    unlockedLevel: result.passed ? Math.min(LEVELS.length, Math.max(progress.unlockedLevel, result.levelId + 1)) : progress.unlockedLevel,
    records: {
      ...progress.records,
      [result.levelId]: {
        stars: Math.max(previous.stars, result.stars),
        highScore: Math.max(previous.highScore, score),
      },
    },
  };
}
