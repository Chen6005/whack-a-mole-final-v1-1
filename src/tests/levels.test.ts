import { describe, expect, it } from "vitest";
import { getDifficulty } from "../game/gameConfig";
import { createInitialState } from "../game/gameReducer";
import { evaluateLevel, getLevel, LEVELS, updateLevelProgress } from "../game/levels";

describe("level system", () => {
  it("defines 10 distinct formal challenge levels including bosses", () => {
    expect(LEVELS).toHaveLength(10);
    expect(new Set(LEVELS.map((level) => level.id)).size).toBe(10);
    expect(LEVELS.filter((level) => level.isBoss).map((level) => level.id)).toEqual([5, 10]);
    expect(LEVELS.every((level, index) => index === 0 || level.speedMultiplier > LEVELS[index - 1].speedMultiplier)).toBe(true);
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
    state.score = 400;
    state.hits = 10;
    state.misses = 1;
    state.maxCombo = 5;
    expect(evaluateLevel(config, state)).toEqual({ levelId: 1, passed: true, stars: 3, goalProgress: 400 });
  });

  it("requires the basic score alongside a special target goal", () => {
    const config = getLevel(3)!;
    const state = createInitialState();
    state.score = 100;
    state.goldenHits = 2;
    expect(evaluateLevel(config, state).passed).toBe(false);
  });

  it("unlocks only the next level and preserves best records", () => {
    const progress = updateLevelProgress({ version: 2, unlockedLevel: 1, records: {} }, { levelId: 1, passed: true, stars: 2, goalProgress: 280 }, 280);
    const replay = updateLevelProgress(progress, { levelId: 1, passed: true, stars: 1, goalProgress: 70 }, 70);
    expect(replay.unlockedLevel).toBe(2);
    expect(replay.records[1]).toEqual({ stars: 2, highScore: 280 });
  });

  it("does not unlock the next level after a failed challenge", () => {
    const progress = updateLevelProgress({ version: 2, unlockedLevel: 1, records: {} }, { levelId: 1, passed: false, stars: 0, goalProgress: 50 }, 50);
    expect(progress.unlockedLevel).toBe(1);
  });
});
