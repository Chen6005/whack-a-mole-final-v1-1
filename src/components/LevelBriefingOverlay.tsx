import { getLevelPassLabel, getLevelStarLabels } from "../game/levels";
import type { LevelConfig } from "../game/gameTypes";

interface LevelBriefingOverlayProps {
  level: LevelConfig;
  onCancel: () => void;
  onStart: () => void;
}

export function LevelBriefingOverlay({ level, onCancel, onStart }: LevelBriefingOverlayProps) {
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label={`Level ${level.id} 任務提示`}>
      <section className="overlay-card briefing-card">
        <p>{level.isBoss ? "BOSS CHALLENGE" : "LEVEL MISSION"}</p>
        <h2>LEVEL {level.id} · {level.name}</h2>
        <div className="briefing-summary">
          <span><b>時間限制</b><strong>{level.duration} 秒</strong></span>
          <span><b>速度倍率</b><strong>×{level.speedMultiplier.toFixed(2)}</strong></span>
        </div>
        <div className="briefing-section">
          <h3>通關條件</h3>
          <p>{getLevelPassLabel(level)}</p>
        </div>
        <div className="briefing-section">
          <h3>星級條件</h3>
          {getLevelStarLabels(level).map((label) => <p key={label}>{label}</p>)}
        </div>
        <div className="briefing-hint"><strong>特殊提示</strong><span>{level.hint}</span></div>
        <button className="text-button briefing-start" type="button" onClick={onStart}>開始挑戰</button>
        <button className="briefing-cancel" type="button" onClick={onCancel}>返回關卡列表</button>
      </section>
    </div>
  );
}
