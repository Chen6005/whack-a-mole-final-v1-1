import { describe, expect, it } from "vitest";
import { MODE_SECONDS } from "../game/gameConfig";
import { calculateAccuracy, calculateHitScore, updateHighScore } from "../game/scoring";

describe("scoring", () => {
  it("scores each normal streak and adds a bonus every third combo", () => {
    expect(calculateHitScore("normal", 0).points).toBe(10);
    expect(calculateHitScore("normal", 2).points).toBe(15);
  });

  it("activates the double multiplier on the tenth combo", () => {
    expect(calculateHitScore("golden", 9)).toEqual({ points: 60, nextCombo: 10, multiplierActive: true });
  });

  it("resets combo and subtracts points for a bomb", () => {
    expect(calculateHitScore("bomb", 7)).toEqual({ points: -20, nextCombo: 0, multiplierActive: false });
  });

  it("calculates accuracy and updates high score", () => {
    expect(calculateAccuracy(3, 1)).toBe(75);
    expect(updateHighScore(100, 80)).toBe(100);
    expect(updateHighScore(100, 120)).toBe(120);
  });

  it("configures all required round durations", () => {
    expect(MODE_SECONDS).toEqual({ quick: 30, challenge: 45, normal: 60 });
  });
});
