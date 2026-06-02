export type GameMode = "quick" | "challenge" | "normal";
export type Screen = "home" | "rules" | "game" | "result";
export type TargetType = "normal" | "golden" | "time" | "bomb" | "shield";
export type Difficulty = "easy" | "medium" | "hard" | "frenzy";
export type EffectType = "hit" | "golden" | "time" | "bomb" | "combo";

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

export interface GameState extends Settings {
  screen: Screen;
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
  multiplierUntil: number;
  recentHoles: number[];
  lastEffect: HitEffect | null;
  shakeId: number;
}

export type GameAction =
  | { type: "SET_SCREEN"; screen: Screen }
  | { type: "SET_MODE"; mode: GameMode }
  | { type: "START_GAME"; now: number }
  | { type: "TICK"; now: number }
  | { type: "SPAWN"; targets: ActiveTarget[] }
  | { type: "HIT_TARGET"; targetId: number; now: number }
  | { type: "MISS_EMPTY" }
  | { type: "PAUSE"; now: number }
  | { type: "RESUME"; now: number }
  | { type: "CLEAR_EFFECT"; effectId: number }
  | { type: "SET_SETTINGS"; settings: Partial<Settings> };
