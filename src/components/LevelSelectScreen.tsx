import homeButton from "../assets/images/button_home.png";
import { getLevelGoalLabel, LEVELS } from "../game/levels";
import type { LevelProgress } from "../game/gameTypes";

interface LevelSelectScreenProps {
  progress: LevelProgress;
  onHome: () => void;
  onSelect: (levelId: number) => void;
}

function stars(value: number): string {
  return `${"★".repeat(value)}${"☆".repeat(3 - value)}`;
}

export function LevelSelectScreen({ progress, onHome, onSelect }: LevelSelectScreenProps) {
  return (
    <main className="screen screen--levels">
      <section className="levels-header">
        <p>GARDEN JOURNEY</p>
        <h1>花園關卡</h1>
        <span>逐關挑戰，保留每局加速節奏</span>
      </section>
      <div className="level-grid" aria-label="關卡選擇">
        {LEVELS.map((level) => {
          const unlocked = level.id <= progress.unlockedLevel;
          const record = progress.records[level.id] ?? { stars: 0, highScore: 0 };
          return (
            <button
              className={`level-card ${unlocked ? "is-unlocked" : "is-locked"} ${level.isBoss ? "is-boss" : ""}`}
              disabled={!unlocked}
              key={level.id}
              type="button"
              onClick={() => onSelect(level.id)}
              aria-label={`Level ${level.id} ${level.name}${unlocked ? "" : " 未解鎖"}`}
            >
              <span className="level-card__number">LEVEL {level.id}</span>
              <strong>{unlocked ? level.name : "尚未解鎖"}</strong>
              <small>{unlocked ? getLevelGoalLabel(level) : "🔒 完成前一關解鎖"}</small>
              <span className="level-card__meta">
                <em>{stars(record.stars)}</em>
                <b>最高 {record.highScore}</b>
              </span>
              {level.isBoss && <i>BOSS</i>}
            </button>
          );
        })}
      </div>
      <div className="levels-footer">
        <button className="asset-button asset-button--secondary" style={{ backgroundImage: `url(${homeButton})` }} type="button" onClick={onHome}>回到首頁</button>
      </div>
    </main>
  );
}
