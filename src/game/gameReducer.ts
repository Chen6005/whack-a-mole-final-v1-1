import { MODE_SECONDS } from "./gameConfig";
import { evaluateLevel, getLevel } from "./levels";
import { calculateHitScore, updateHighScore } from "./scoring";
import type { EffectType, GameAction, GameState, Settings, TargetType } from "./gameTypes";

const DEFAULT_SETTINGS: Settings = {
  soundEnabled: true,
  effectsEnabled: true,
  reducedMotion: false,
};

export function createInitialState(highScore = 0, settings: Settings = DEFAULT_SETTINGS): GameState {
  return {
    screen: "home",
    playMode: "arcade",
    levelId: null,
    levelResult: null,
    mode: "normal",
    score: 0,
    highScore,
    timeRemaining: MODE_SECONDS.normal,
    isPaused: false,
    pausedAt: null,
    activeHoles: [],
    combo: 0,
    maxCombo: 0,
    hits: 0,
    misses: 0,
    goldenHits: 0,
    bombHits: 0,
    specialHits: 0,
    timeHits: 0,
    shieldHits: 0,
    multiplierUntil: 0,
    recentHoles: [],
    lastEffect: null,
    shakeId: 0,
    ...settings,
  };
}

function effectTypeFor(targetType: TargetType, combo: number): EffectType {
  if (combo >= 5) return "combo";
  if (targetType === "golden") return "golden";
  if (targetType === "time") return "time";
  if (targetType === "bomb") return "bomb";
  return "hit";
}

function finishRound(state: GameState): GameState {
  const highScore = updateHighScore(state.highScore, state.score);
  const levelConfig = getLevel(state.levelId);
  const levelResult = state.playMode === "level" && levelConfig ? evaluateLevel(levelConfig, state) : null;
  return { ...state, screen: "result", isPaused: false, pausedAt: null, activeHoles: [], highScore, levelResult };
}

function resetRound(state: GameState, timeRemaining: number): GameState {
  return {
    ...state,
    screen: "game",
    score: 0,
    timeRemaining,
    isPaused: false,
    pausedAt: null,
    activeHoles: [],
    combo: 0,
    maxCombo: 0,
    hits: 0,
    misses: 0,
    goldenHits: 0,
    bombHits: 0,
    specialHits: 0,
    timeHits: 0,
    shieldHits: 0,
    multiplierUntil: 0,
    recentHoles: [],
    lastEffect: null,
    levelResult: null,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SET_SCREEN":
      return { ...state, screen: action.screen, isPaused: false, pausedAt: null };
    case "SET_MODE":
      return { ...state, mode: action.mode, timeRemaining: MODE_SECONDS[action.mode] };
    case "START_GAME":
      return resetRound({ ...state, playMode: "arcade", levelId: null }, MODE_SECONDS[state.mode]);
    case "START_LEVEL": {
      const levelConfig = getLevel(action.levelId);
      return levelConfig ? resetRound({ ...state, playMode: "level", levelId: levelConfig.id }, levelConfig.duration) : state;
    }
    case "TICK": {
      if (state.screen !== "game" || state.isPaused) return state;
      const activeHoles = state.activeHoles.filter((target) => target.visibleUntil > action.now);
      if (state.timeRemaining <= 1) return finishRound({ ...state, activeHoles, timeRemaining: 0 });
      return { ...state, activeHoles, timeRemaining: state.timeRemaining - 1 };
    }
    case "SPAWN": {
      if (state.screen !== "game" || state.isPaused || action.targets.length === 0) return state;
      const newHoles = action.targets.map((target) => target.hole);
      return {
        ...state,
        activeHoles: [...state.activeHoles, ...action.targets],
        recentHoles: [...newHoles, ...state.recentHoles].slice(0, 3),
      };
    }
    case "HIT_TARGET": {
      if (state.isPaused || state.screen !== "game") return state;
      const target = state.activeHoles.find((item) => item.id === action.targetId && item.visibleUntil > action.now);
      if (!target) return { ...state, misses: state.misses + 1, combo: 0 };

      if (target.type === "shield" && target.hp > 1) {
        return {
          ...state,
          activeHoles: state.activeHoles.map((item) => item.id === target.id ? { ...item, hp: item.hp - 1 } : item),
          lastEffect: state.effectsEnabled ? { id: action.now, hole: target.hole, type: "hit", label: "再一下！" } : null,
        };
      }

      const multiplierActive = state.multiplierUntil > action.now;
      const result = calculateHitScore(target.type, state.combo, multiplierActive);
      const isBomb = target.type === "bomb";
      const doubleActivated = target.type === "shield";
      const multiplierUntil = !isBomb && (result.multiplierActive || doubleActivated) ? action.now + 3500 : isBomb ? 0 : state.multiplierUntil;
      const label = isBomb ? "-20" : target.type === "time" ? `+${result.points} · +5秒` : doubleActivated ? `+${result.points} · DOUBLE` : `+${result.points}`;

      return {
        ...state,
        score: Math.max(0, state.score + result.points),
        timeRemaining: target.type === "time" ? state.timeRemaining + 5 : state.timeRemaining,
        activeHoles: state.activeHoles.filter((item) => item.id !== target.id),
        combo: result.nextCombo,
        maxCombo: Math.max(state.maxCombo, result.nextCombo),
        hits: isBomb ? state.hits : state.hits + 1,
        misses: isBomb ? state.misses + 1 : state.misses,
        goldenHits: target.type === "golden" ? state.goldenHits + 1 : state.goldenHits,
        bombHits: isBomb ? state.bombHits + 1 : state.bombHits,
        specialHits: target.type !== "normal" && target.type !== "bomb" ? state.specialHits + 1 : state.specialHits,
        timeHits: target.type === "time" ? state.timeHits + 1 : state.timeHits,
        shieldHits: target.type === "shield" ? state.shieldHits + 1 : state.shieldHits,
        multiplierUntil,
        shakeId: isBomb ? state.shakeId + 1 : state.shakeId,
        lastEffect: state.effectsEnabled ? { id: action.now, hole: target.hole, type: effectTypeFor(target.type, result.nextCombo), label } : null,
      };
    }
    case "MISS_EMPTY":
      if (state.isPaused || state.screen !== "game") return state;
      return { ...state, misses: state.misses + 1, combo: 0, multiplierUntil: 0 };
    case "PAUSE":
      return state.screen === "game" && !state.isPaused ? { ...state, isPaused: true, pausedAt: action.now } : state;
    case "RESUME": {
      if (!state.isPaused || state.pausedAt === null) return state;
      const pauseDuration = action.now - state.pausedAt;
      return {
        ...state,
        isPaused: false,
        pausedAt: null,
        activeHoles: state.activeHoles.map((target) => ({ ...target, visibleUntil: target.visibleUntil + pauseDuration })),
      };
    }
    case "CLEAR_EFFECT":
      return state.lastEffect?.id === action.effectId ? { ...state, lastEffect: null } : state;
    case "SET_SETTINGS":
      return { ...state, ...action.settings };
    default:
      return state;
  }
}
