import logo from "../assets/images/game_logo.png";
import startButton from "../assets/images/button_start.png";
import rulesButton from "../assets/images/button_rules.png";
import { MODE_LABELS } from "../game/gameConfig";
import type { GameMode } from "../game/gameTypes";

interface HomeScreenProps {
  mode: GameMode;
  highScore: number;
  onModeChange: (mode: GameMode) => void;
  onStart: () => void;
  onRules: () => void;
}

export function HomeScreen({ mode, highScore, onModeChange, onStart, onRules }: HomeScreenProps) {
  return (
    <main className="screen screen--home">
      <section className="home-card">
        <img className="game-logo" src={logo} alt="" />
        <div className="title-lockup">
          <p>GARDEN ARCADE</p>
          <h1>花園打地鼠</h1>
          <span>WHACK-A-MOLE</span>
        </div>
        <div className="high-score-pill" aria-label={`最高分 ${highScore}`}>🏆 最高分 <strong>{highScore}</strong></div>
        <div className="mode-picker" aria-label="選擇遊戲模式">
          {(Object.keys(MODE_LABELS) as GameMode[]).map((item) => (
            <button
              className={`mode-button ${mode === item ? "is-selected" : ""}`}
              key={item}
              type="button"
              onClick={() => onModeChange(item)}
              aria-pressed={mode === item}
            >
              {MODE_LABELS[item]}
            </button>
          ))}
        </div>
        <button className="asset-button asset-button--primary" style={{ backgroundImage: `url(${startButton})` }} type="button" onClick={onStart}>
          開始遊戲
        </button>
        <button className="asset-button asset-button--secondary" style={{ backgroundImage: `url(${rulesButton})` }} type="button" onClick={onRules}>
          遊戲規則
        </button>
        <p className="keyboard-hint">按 Enter 或空白鍵快速開始</p>
      </section>
    </main>
  );
}
