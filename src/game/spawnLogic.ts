import { getDifficulty, TARGET_HP } from "./gameConfig";
import type { ActiveTarget, GameState, TargetType } from "./gameTypes";

export type RandomSource = () => number;

export function pickTargetType(random: RandomSource = Math.random, specialBoost = 1): TargetType {
  const roll = random();
  const golden = 0.08 * specialBoost;
  const time = golden + 0.07 * specialBoost;
  const bomb = time + 0.12 * specialBoost;
  const shield = bomb + 0.13 * specialBoost;

  if (roll < golden) return "golden";
  if (roll < time) return "time";
  if (roll < bomb) return "bomb";
  if (roll < shield) return "shield";
  return "normal";
}

export function createSpawnTargets(state: GameState, now: number, random: RandomSource = Math.random): ActiveTarget[] {
  const config = getDifficulty(state.timeRemaining, state.mode);
  const occupied = new Set(state.activeHoles.filter((target) => target.visibleUntil > now).map((target) => target.hole));
  let available = Array.from({ length: 9 }, (_, index) => index).filter((hole) => !occupied.has(hole));
  const fresh = available.filter((hole) => !state.recentHoles.includes(hole));
  if (fresh.length > 0) available = fresh;

  const remainingCapacity = Math.min(config.maxSimultaneous - occupied.size, available.length);
  if (remainingCapacity <= 0) return [];

  const count = remainingCapacity > 1 && random() < config.multiSpawnChance ? 2 : 1;
  const targets: ActiveTarget[] = [];

  for (let index = 0; index < Math.min(count, remainingCapacity); index += 1) {
    const selectedIndex = Math.floor(random() * available.length);
    const [hole] = available.splice(selectedIndex, 1);
    const type = pickTargetType(random, config.specialBoost);
    targets.push({
      id: now * 10 + index,
      hole,
      type,
      hp: TARGET_HP[type],
      visibleUntil: now + config.visibleMs,
    });
  }

  return targets;
}
