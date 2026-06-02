import pauseButton from "../assets/images/button_pause.png";
import comboBadge from "../assets/images/combo_badge.png";
import { getDifficulty } from "../game/gameConfig";
import { getLevel, getLevelGoalLabel } from "../game/levels";
import { calculateAccuracy } from "../game/scoring";
import type { ActiveTarget, GameState } from "../game/gameTypes";
import { GameBoard } from "./GameBoard";
import { PauseOverlay } from "./PauseOverlay";
import { StatPanel } from "./StatPanel";

interface GameScreenProps {
  state: GameState;
  onHit: (target: ActiveTarget) => void;
  onMiss: () => void;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
}

export function GameScreen({ state, onHit, onMiss, onPause, onResume, onRestart, onHome }: GameScreenProps) {
  const accuracy = calculateAccuracy(state.hits, state.misses);
  const levelConfig = getLevel(state.levelId);
  const difficulty = getDifficulty(state.timeRemaining, state.mode, levelConfig);
  const multiplierActive = state.multiplierUntil > Date.now();

  return (
    <main className={`screen screen--game ${state.shakeId > 0 ? "can-shake" : ""}`} key={state.shakeId}>
      <section className="game-hud">
        <div className="game-hud__top">
          <StatPanel label="分數" value={state.score} variant="score" />
          <StatPanel label="時間" value={`${state.timeRemaining}s`} variant="timer" />
          <button className="pause-button" type="button" onClick={onPause} aria-label="暫停遊戲">
            <img src={pauseButton} alt="" />
          </button>
        </div>
        <div className="game-hud__sub">
          <span>最高分 {state.highScore}</span>
          <span>命中率 {accuracy}%</span>
          <span className={`difficulty difficulty--${difficulty.level}`}>{difficulty.level}</span>
        </div>
      </section>
      {levelConfig && <div className="level-objective"><strong>LV.{levelConfig.id} {levelConfig.name}</strong><span>{getLevelGoalLabel(levelConfig)}</span></div>}
      <div className={`combo-ribbon ${state.combo >= 3 ? "is-hot" : ""}`}>
        <img src={comboBadge} alt="" />
        <strong>COMBO {state.combo}</strong>
        {multiplierActive && <em>×2</em>}
      </div>
      <GameBoard activeTargets={state.activeHoles} effect={state.lastEffect} onHit={onHit} onMiss={onMiss} />
      <p className="game-tip">瞄準冒出的地鼠，別敲到炸彈！</p>
      {state.isPaused && <PauseOverlay onResume={onResume} onRestart={onRestart} onHome={onHome} />}
    </main>
  );
}
