import { describe, expect, it } from "vitest";
import { createInitialState } from "../game/gameReducer";
import { createSpawnTargets, pickTargetType } from "../game/spawnLogic";

describe("spawn logic", () => {
  it("maps probability ranges to special targets", () => {
    expect(pickTargetType(() => 0.01)).toBe("golden");
    expect(pickTargetType(() => 0.1)).toBe("time");
    expect(pickTargetType(() => 0.2)).toBe("bomb");
    expect(pickTargetType(() => 0.34)).toBe("shield");
    expect(pickTargetType(() => 0.9)).toBe("normal");
  });

  it("avoids occupied and recently used holes", () => {
    const state = createInitialState();
    state.timeRemaining = 5;
    state.recentHoles = [0, 1, 2];
    state.activeHoles = [{ id: 1, hole: 3, type: "normal", hp: 1, visibleUntil: 5000 }];
    const [target] = createSpawnTargets(state, 1000, () => 0);
    expect([0, 1, 2, 3]).not.toContain(target.hole);
  });

  it("can spawn multiple targets during frenzy without overlap", () => {
    const state = createInitialState();
    state.timeRemaining = 5;
    const targets = createSpawnTargets(state, 1000, () => 0);
    expect(targets).toHaveLength(2);
    expect(targets[0].hole).not.toBe(targets[1].hole);
  });
});
