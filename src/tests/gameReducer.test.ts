import { describe, expect, it } from "vitest";
import { createInitialState, gameReducer } from "../game/gameReducer";

describe("game reducer", () => {
  it("freezes and restores active target visibility when paused", () => {
    const state = createInitialState();
    state.screen = "game";
    state.activeHoles = [{ id: 1, hole: 0, type: "normal", hp: 1, visibleUntil: 2000 }];
    const paused = gameReducer(state, { type: "PAUSE", now: 1000 });
    const resumed = gameReducer(paused, { type: "RESUME", now: 2500 });
    expect(resumed.activeHoles[0].visibleUntil).toBe(3500);
  });

  it("breaks combo after an empty-hole tap", () => {
    const state = createInitialState();
    state.screen = "game";
    state.combo = 6;
    const next = gameReducer(state, { type: "MISS_EMPTY" });
    expect(next.combo).toBe(0);
    expect(next.misses).toBe(1);
  });

  it("requires two hits to score a shield mole", () => {
    const state = createInitialState();
    state.screen = "game";
    state.activeHoles = [{ id: 1, hole: 0, type: "shield", hp: 2, visibleUntil: 5000 }];
    const first = gameReducer(state, { type: "HIT_TARGET", targetId: 1, now: 1000 });
    const second = gameReducer(first, { type: "HIT_TARGET", targetId: 1, now: 1100 });
    expect(first.score).toBe(0);
    expect(first.activeHoles[0].hp).toBe(1);
    expect(second.score).toBe(25);
    expect(second.activeHoles).toHaveLength(0);
  });

  it("starts a configured level without replacing arcade mode", () => {
    const state = createInitialState();
    const levelState = gameReducer(state, { type: "START_LEVEL", levelId: 1, now: 1000 });
    const arcadeState = gameReducer(levelState, { type: "START_GAME", now: 1100 });
    expect(levelState.playMode).toBe("level");
    expect(levelState.levelId).toBe(1);
    expect(levelState.timeRemaining).toBe(30);
    expect(arcadeState.playMode).toBe("arcade");
    expect(arcadeState.levelId).toBeNull();
  });
});
