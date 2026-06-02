export type GameMode = "quick" | "challenge" | "normal";
export type Screen = "home" | "rules" | "levels" | "game" | "result";
export type TargetType = "normal" | "golden" | "time" | "bomb" | "shield";
export type Difficulty = "easy" | "medium" | "hard" | "frenzy";
export type EffectType = "hit" | "golden" | "time" | "bomb" | "combo";
export type PlayMode = "arcade" | "level";
export type LevelGoalType = "score" | "combo" | "golden" | "time" | "double" | "special";

export interface ActiveTarget {
  id: number;
  hole: number;
  type: TargetType;
  hp: number;
  visibleUntil: number;
}

export interface HitEffect {
  id: number;
  hole: number;
  type: EffectType;
  label: string;
}

export interface Settings {
  soundEnabled: boolean;
  effectsEnabled: boolean;
  reducedMotion: boolean;
}

export interface LevelConfig {
  id: number;
  name: string;
  duration: number;
  goalType: LevelGoalType;
  goalValue: number;
  targetScore: number;
  star2Score: number;
  star3Score: number;
  speedMultiplier: number;
  specialMultiplier: number;
  bombMultiplier: number;
  comboRequirement: number;
  isBoss: boolean;
  hint: string;
}

export interface LevelResult {
  levelId: number;
  passed: boolean;
  stars: number;
  goalProgress: number;
}

export interface LevelRecord {
  stars: number;
  highScore: number;
}

export interface LevelProgress {
  version: number;
  unlockedLevel: number;
  records: Record<number, LevelRecord>;
}

export interface GameState extends Settings {
  screen: Screen;
  playMode: PlayMode;
  levelId: number | null;
  levelResult: LevelResult | null;
  mode: GameMode;
  score: number;
  highScore: number;
  timeRemaining: number;
  isPaused: boolean;
  pausedAt: number | null;
  activeHoles: ActiveTarget[];
  combo: number;
  maxCombo: number;
  hits: number;
  misses: number;
  goldenHits: number;
  bombHits: number;
  specialHits: number;
  timeHits: number;
  shieldHits: number;
  multiplierUntil: number;
  recentHoles: number[];
  lastEffect: HitEffect | null;
  shakeId: number;
}

export type GameAction =
  | { type: "SET_SCREEN"; screen: Screen }
  | { type: "SET_MODE"; mode: GameMode }
  | { type: "START_GAME"; now: number }
  | { type: "START_LEVEL"; levelId: number; now: number }
  | { type: "TICK"; now: number }
  | { type: "SPAWN"; targets: ActiveTarget[] }
  | { type: "HIT_TARGET"; targetId: number; now: number }
  | { type: "MISS_EMPTY" }
  | { type: "PAUSE"; now: number }
  | { type: "RESUME"; now: number }
  | { type: "CLEAR_EFFECT"; effectId: number }
  | { type: "SET_SETTINGS"; settings: Partial<Settings> };
