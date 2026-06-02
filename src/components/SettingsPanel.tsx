import type { Settings } from "../game/gameTypes";

interface SettingsPanelProps {
  settings: Settings;
  onChange: (settings: Partial<Settings>) => void;
  onClose: () => void;
}

export function SettingsPanel({ settings, onChange, onClose }: SettingsPanelProps) {
  const toggles: Array<[keyof Settings, string, string]> = [
    ["soundEnabled", "音效", "點擊、Combo 與炸彈提示音"],
    ["effectsEnabled", "視覺特效", "火花、浮動分數與畫面震動"],
    ["reducedMotion", "減少動態", "降低彈出與轉場動畫幅度"],
  ];

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="遊戲設定">
      <section className="overlay-card settings-card">
        <p>SETTINGS</p>
        <h2>遊戲設定</h2>
        {toggles.map(([key, label, detail]) => (
          <label className="toggle-row" key={key}>
            <span><strong>{label}</strong><small>{detail}</small></span>
            <input type="checkbox" checked={settings[key]} onChange={(event) => onChange({ [key]: event.target.checked })} />
          </label>
        ))}
        <button className="text-button" type="button" onClick={onClose}>完成</button>
      </section>
    </div>
  );
}
