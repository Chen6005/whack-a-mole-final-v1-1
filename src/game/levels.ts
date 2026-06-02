import { calculateAccuracy } from "./scoring";
import type { GameState, LevelConfig, LevelProgress, LevelRecord, LevelResult } from "./gameTypes";

const level = (
  id: number,
  name: string,
  duration: number,
  goalType: LevelConfig["goalType"],
  goalValue: number,
  targetScore: number,
  star2Score: number,
  star3Score: number,
  speedMultiplier: number,
  specialMultiplier: number,
  bombMultiplier: number,
  comboRequirement = 0,
  isBoss = false,
  hint = "保持節奏，留意特殊地鼠。",
): LevelConfig => ({
  id, name, duration, goalType, goalValue, targetScore, star2Score, star3Score,
  speedMultiplier, specialMultiplier, bombMultiplier, comboRequirement, isBoss, hint,
});

export const LEVELS: LevelConfig[] = [
  level(1, "正式挑戰", 30, "score", 180, 180, 250, 340, 1, 0.9, 0.7, 0, false, "從第一秒開始就是正式賽。穩定命中，建立節奏。"),
  level(2, "疾風花圃", 32, "score", 280, 280, 380, 500, 1.08, 0.98, 0.78, 0, false, "速度提高了。避免打空，保持 Combo。"),
  level(3, "黃金追擊", 35, "golden", 2, 260, 380, 520, 1.14, 1.45, 0.82, 0, false, "黃金地鼠 +30 分。命中 2 隻並達到基本分數。"),
  level(4, "Combo 風暴", 36, "combo", 8, 340, 460, 620, 1.2, 1.08, 0.88, 8, false, "連續正確擊中 8 次。打空或炸彈會中斷 Combo。"),
  level(5, "Boss 限時賽", 38, "score", 520, 520, 680, 860, 1.26, 1.18, 1.05, 6, true, "第一場 Boss 挑戰：限時衝高分，同時維持至少 6 Combo。"),
  level(6, "時間接力", 40, "time", 2, 430, 570, 740, 1.32, 1.62, 0.96, 0, false, "命中 2 隻時間地鼠，利用 +5 秒延長回合。"),
  level(7, "Double 爆發", 42, "double", 3, 560, 720, 920, 1.38, 1.58, 1, 0, false, "完成 3 隻 Double 護甲地鼠：每隻需點兩次，完成後啟動短暫雙倍分數。"),
  level(8, "高速追獵", 43, "score", 760, 760, 920, 1120, 1.47, 1.28, 1.06, 8, false, "高速節奏來臨。先求準確，再追求高分。"),
  level(9, "特殊混戰", 46, "special", 12, 880, 1060, 1300, 1.54, 1.8, 1.14, 10, false, "黃金、時間與 Double 護甲地鼠混合出現。善用每一種效果。"),
  level(10, "終極園丁", 50, "score", 1250, 1250, 1480, 1780, 1.64, 1.95, 1.28, 14, true, "最終 Boss 挑戰：最高速度、特殊地鼠混戰與高分門檻。"),
];

export function getLevel(levelId: number | null): LevelConfig | null {
  return levelId === null ? null : LEVELS.find((item) => item.id === levelId) ?? null;
}

export function getLevelGoalLabel(config: LevelConfig): string {
  switch (config.goalType) {
    case "score": return `獲得 ${config.goalValue} 分`;
    case "combo": return `達成 ${config.goalValue} Combo`;
    case "golden": return `命中 ${config.goalValue} 隻黃金地鼠`;
    case "time": return `命中 ${config.goalValue} 隻時間地鼠`;
    case "double": return `完成 ${config.goalValue} 隻 Double 護甲地鼠`;
    case "special": return `命中 ${config.goalValue} 隻特殊地鼠`;
  }
}

export function getLevelPassLabel(config: LevelConfig): string {
  const score = config.goalType === "score" ? "" : `，並達到 ${config.targetScore} 分`;
  const combo = config.comboRequirement > 0 && config.goalType !== "combo" ? `，至少 ${config.comboRequirement} Combo` : "";
  return `${getLevelGoalLabel(config)}${score}${combo}`;
}

export function getLevelStarLabels(config: LevelConfig): string[] {
  return [
    `★ 通關：${getLevelPassLabel(config)}`,
    `★★ 良好：${config.star2Score} 分，命中率至少 65%`,
    `★★★ 完美：${config.star3Score} 分，命中率至少 80%，至少 ${Math.max(3, config.comboRequirement)} Combo`,
  ];
}

export function getLevelGoalProgress(config: LevelConfig, state: GameState): number {
  switch (config.goalType) {
    case "score": return state.score;
    case "combo": return state.maxCombo;
    case "golden": return state.goldenHits;
    case "time": return state.timeHits;
    case "double": return state.shieldHits;
    case "special": return state.specialHits;
  }
}

export function evaluateLevel(config: LevelConfig, state: GameState): LevelResult {
  const goalProgress = getLevelGoalProgress(config, state);
  const comboPassed = state.maxCombo >= config.comboRequirement;
  const scorePassed = state.score >= config.targetScore;
  const passed = goalProgress >= config.goalValue && scorePassed && comboPassed;
  if (!passed) return { levelId: config.id, passed, stars: 0, goalProgress };

  const accuracy = calculateAccuracy(state.hits, state.misses);
  let stars = 1;
  if (state.score >= config.star2Score && accuracy >= 65) stars += 1;
  if (state.score >= config.star3Score && accuracy >= 80 && state.maxCombo >= Math.max(3, config.comboRequirement)) stars += 1;
  return { levelId: config.id, passed, stars, goalProgress };
}

export function createDefaultLevelProgress(): LevelProgress {
  return { version: 2, unlockedLevel: 1, records: {} };
}

export function updateLevelProgress(progress: LevelProgress, result: LevelResult, score: number): LevelProgress {
  const previous: LevelRecord = progress.records[result.levelId] ?? { stars: 0, highScore: 0 };
  return {
    version: 2,
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
