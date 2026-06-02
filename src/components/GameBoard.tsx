import type { ActiveTarget, HitEffect } from "../game/gameTypes";
import { MoleHole } from "./MoleHole";

interface GameBoardProps {
  activeTargets: ActiveTarget[];
  effect: HitEffect | null;
  onHit: (target: ActiveTarget) => void;
  onMiss: () => void;
}

export function GameBoard({ activeTargets, effect, onHit, onMiss }: GameBoardProps) {
  return (
    <div className="game-board" aria-label="九宮格打地鼠遊戲區">
      {Array.from({ length: 9 }, (_, index) => (
        <MoleHole
          effect={effect?.hole === index ? effect : undefined}
          index={index}
          key={index}
          target={activeTargets.find((target) => target.hole === index)}
          onHit={onHit}
          onMiss={onMiss}
        />
      ))}
    </div>
  );
}
