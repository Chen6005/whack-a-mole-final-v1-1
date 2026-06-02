import { describe, expect, it } from "vitest";
import { getDifficulty } from "../game/gameConfig";
import { createInitialState } from "../game/gameReducer";
import { evaluateLevel, getLevel, LEVELS, updateLevelProgress } from "../game/levels";

describe("level system", () => {
  it("defines 30 distinct levels including boss challenges", () => {
    expect(LEVELS).toHaveLength(30);
    expect(new Set(LEVELS.map((level) => level.id)).size).toBe(30);
    expect(LEVELS.filter((level) => level.isBoss).length).toBeGreaterThanOrEqual(5);
  });

  it("keeps progressive in-round speed growth on top of level tuning", () => {
    const config = getLevel(10)!;
    const early = getDifficulty(config.duration, "normal", config);
    const frenzy = getDifficulty(3, "normal", config);
    expect(early.level).toBe("easy");
    expect(frenzy.level).toBe("frenzy");
    expect(frenzy.spawnMs).toBeLessThan(early.spawnMs);
    expect(early.spawnMs).toBeLessThan(1050);
  });

  it("passes score goals and awards one to three stars", () => {
    const config = getLevel(1)!;
    const state = createInitialState();
    state.score = 130;
    state.hits = 10;
    state.misses = 1;
    state.maxCombo = 5;
    expect(evaluateLevel(config, state)).toEqual({ levelId: 1, passed: true, stars: 3, goalProgress: 130 });
  });

  it("does not pass no-bomb challenges after a bomb hit", () => {
    const config = getLevel(5)!;
    const state = createInitialState();
    state.score = 300;
    state.maxCombo = 5;
    state.bombHits = 1;
    expect(evaluateLevel(config, state).passed).toBe(false);
  });

  it("unlocks only the next level and preserves best records", () => {
    const progress = updateLevelProgress({ unlockedLevel: 1, records: {} }, { levelId: 1, passed: true, stars: 2, goalProgress: 80 }, 80);
    const replay = updateLevelProgress(progress, { levelId: 1, passed: true, stars: 1, goalProgress: 70 }, 70);
    expect(replay.unlockedLevel).toBe(2);
    expect(replay.records[1]).toEqual({ stars: 2, highScore: 80 });
  });
});
