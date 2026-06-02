import { createDefaultLevelProgress } from "./levels";
import type { LevelProgress, Settings } from "./gameTypes";

const HIGH_SCORE_KEY = "garden-mole-high-score";
const SETTINGS_KEY = "garden-mole-settings";
const LEVEL_PROGRESS_KEY = "garden-mole-level-progress";

export function loadHighScore(): number {
  const value = Number(window.localStorage.getItem(HIGH_SCORE_KEY) ?? 0);
  return Number.isFinite(value) ? value : 0;
}

export function saveHighScore(score: number): void {
  window.localStorage.setItem(HIGH_SCORE_KEY, String(score));
}

export function loadSettings(): Settings {
  const defaults: Settings = { soundEnabled: true, effectsEnabled: true, reducedMotion: false };
  try {
    return { ...defaults, ...JSON.parse(window.localStorage.getItem(SETTINGS_KEY) ?? "{}") };
  } catch {
    return defaults;
  }
}

export function saveSettings(settings: Settings): void {
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function loadLevelProgress(): LevelProgress {
  try {
    const stored = JSON.parse(window.localStorage.getItem(LEVEL_PROGRESS_KEY) ?? "{}") as Partial<LevelProgress>;
    if (stored.version !== 2) return createDefaultLevelProgress();
    return { ...createDefaultLevelProgress(), ...stored };
  } catch {
    return createDefaultLevelProgress();
  }
}

export function saveLevelProgress(progress: LevelProgress): void {
  window.localStorage.setItem(LEVEL_PROGRESS_KEY, JSON.stringify(progress));
}
