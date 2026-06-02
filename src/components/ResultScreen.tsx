import homeButton from "../assets/images/button_home.png";
import restartButton from "../assets/images/button_restart.png";
import { MODE_LABELS } from "../game/gameConfig";
import { calculateAccuracy, getRank } from "../game/scoring";
import type { GameMode, GameState } from "../game/gameTypes";

interface ResultScreenProps {
  state: GameState;
  onRestart: () => void;
  onHome: () => void;
  onModeChange: (mode: GameMode) => void;
}

export function ResultScreen({ state, onRestart, onHome, onModeChange }: ResultScreenProps) {
  const rank = getRank(state.score);
  const accuracy = calculateAccuracy(state.hits, state.misses);

  return (
    <main className="screen screen--result">
      <section className="result-card">
        <p>ROUND COMPLETE</p>
        <h1>本局結算</h1>
        <div className={`rank-badge rank-badge--${rank}`}>{rank}</div>
        <div className="final-score"><span>最終分數</span><strong>{state.score}</strong></div>
        <div className="result-stats">
          <span>最高分<strong>{state.highScore}</strong></span>
          <span>命中率<strong>{accuracy}%</strong></span>
          <span>最佳連擊<strong>{state.maxCombo}</strong></span>
          <span>命中 / 失誤<strong>{state.hits} / {state.misses}</strong></span>
        </div>
        <label className="result-mode">
          <span>切換模式</span>
          <select value={state.mode} onChange={(event) => onModeChange(event.target.value as GameMode)}>
            {(Object.keys(MODE_LABELS) as GameMode[]).map((mode) => <option value={mode} key={mode}>{MODE_LABELS[mode]}</option>)}
          </select>
        </label>
        <button className="asset-button asset-button--primary" style={{ backgroundImage: `url(${restartButton})` }} type="button" onClick={onRestart}>再玩一次</button>
        <button className="asset-button asset-button--secondary" style={{ backgroundImage: `url(${homeButton})` }} type="button" onClick={onHome}>回到首頁</button>
      </section>
    </main>
  );
}
