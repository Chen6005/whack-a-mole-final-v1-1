import homeButton from "../assets/images/button_home.png";
import restartButton from "../assets/images/button_restart.png";
import { MODE_LABELS } from "../game/gameConfig";
import { getLevel, LEVELS } from "../game/levels";
import { calculateAccuracy, getRank } from "../game/scoring";
import type { GameMode, GameState } from "../game/gameTypes";

interface ResultScreenProps {
  state: GameState;
  onRestart: () => void;
  onHome: () => void;
  onModeChange: (mode: GameMode) => void;
  onLevels: () => void;
  onNextLevel: (levelId: number) => void;
}

export function ResultScreen({ state, onRestart, onHome, onModeChange, onLevels, onNextLevel }: ResultScreenProps) {
  const rank = getRank(state.score);
  const accuracy = calculateAccuracy(state.hits, state.misses);
  const levelConfig = getLevel(state.levelId);
  const levelResult = state.levelResult;

  return (
    <main className="screen screen--result">
      <section className="result-card">
        <p>ROUND COMPLETE</p>
        <h1>本局結算</h1>
        <div className={`rank-badge rank-badge--${rank}`}>{rank}</div>
        {levelConfig && levelResult && (
          <div className={`level-result ${levelResult.passed ? "is-passed" : "is-failed"}`}>
            <strong>LEVEL {levelConfig.id} {levelResult.passed ? "通關成功！" : "挑戰失敗"}</strong>
            <span>{levelResult.passed ? `${"★".repeat(levelResult.stars)}${"☆".repeat(3 - levelResult.stars)}` : "未達成通關條件，再挑戰一次！"}</span>
          </div>
        )}
        {levelConfig?.id === LEVELS.length && levelResult?.passed && <div className="all-levels-complete">🏆 全部關卡完成！</div>}
        <div className="final-score"><span>最終分數</span><strong>{state.score}</strong></div>
        <div className="result-stats">
          <span>最高分<strong>{state.highScore}</strong></span>
          <span>命中率<strong>{accuracy}%</strong></span>
          <span>最佳連擊<strong>{state.maxCombo}</strong></span>
          <span>命中 / 失誤<strong>{state.hits} / {state.misses}</strong></span>
        </div>
        {!levelConfig && <label className="result-mode">
          <span>切換模式</span>
          <select value={state.mode} onChange={(event) => onModeChange(event.target.value as GameMode)}>
            {(Object.keys(MODE_LABELS) as GameMode[]).map((mode) => <option value={mode} key={mode}>{MODE_LABELS[mode]}</option>)}
          </select>
        </label>}
        <button className="asset-button asset-button--primary" style={{ backgroundImage: `url(${restartButton})` }} type="button" onClick={onRestart}>{levelConfig ? "重新挑戰" : "再玩一次"}</button>
        {levelConfig && levelResult?.passed && levelConfig.id < LEVELS.length && <button className="text-button result-next-button" type="button" onClick={() => onNextLevel(levelConfig.id + 1)}>下一關</button>}
        {levelConfig && <button className="text-button result-levels-button" type="button" onClick={onLevels}>回到關卡列表</button>}
        <button className="asset-button asset-button--secondary" style={{ backgroundImage: `url(${homeButton})` }} type="button" onClick={onHome}>回到首頁</button>
      </section>
    </main>
  );
}
