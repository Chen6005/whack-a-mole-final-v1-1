import type { Difficulty, GameMode, LevelConfig, TargetType } from "./gameTypes";

export const MODE_SECONDS: Record<GameMode, number> = {
  quick: 30,
  challenge: 45,
  normal: 60,
};

export const MODE_LABELS: Record<GameMode, string> = {
  quick: "極速 30 秒",
  challenge: "挑戰 45 秒",
  normal: "標準 60 秒",
};

export const TARGET_POINTS: Record<TargetType, number> = {
  normal: 10,
  golden: 30,
  time: 5,
  bomb: -20,
  shield: 25,
};

export const TARGET_HP: Record<TargetType, number> = {
  normal: 1,
  golden: 1,
  time: 1,
  bomb: 1,
  shield: 2,
};

export interface DifficultyConfig {
  level: Difficulty;
  visibleMs: number;
  spawnMs: number;
  maxSimultaneous: number;
  multiSpawnChance: number;
  specialBoost: number;
}

export function getDifficulty(timeRemaining: number, mode: GameMode, levelConfig: LevelConfig | null = null): DifficultyConfig {
  const ratio = timeRemaining / (levelConfig?.duration ?? MODE_SECONDS[mode]);
  const speedMultiplier = levelConfig?.speedMultiplier ?? 1;
  const specialMultiplier = levelConfig?.specialMultiplier ?? 1;
  const scale = (config: DifficultyConfig): DifficultyConfig => ({
    ...config,
    visibleMs: Math.round(config.visibleMs / speedMultiplier),
    spawnMs: Math.round(config.spawnMs / speedMultiplier),
    specialBoost: config.specialBoost * specialMultiplier,
  });

  if (ratio <= 0.17) {
    return scale({ level: "frenzy", visibleMs: 780, spawnMs: 470, maxSimultaneous: 3, multiSpawnChance: 0.6, specialBoost: 1.35 });
  }
  if (ratio <= 0.42) {
    return scale({ level: "hard", visibleMs: 980, spawnMs: 650, maxSimultaneous: 3, multiSpawnChance: 0.42, specialBoost: 1.2 });
  }
  if (ratio <= 0.75) {
    return scale({ level: "medium", visibleMs: 1250, spawnMs: 850, maxSimultaneous: 2, multiSpawnChance: 0.22, specialBoost: 1.05 });
  }
  return scale({ level: "easy", visibleMs: 1450, spawnMs: 1050, maxSimultaneous: 1, multiSpawnChance: 0, specialBoost: 0.9 });
}
