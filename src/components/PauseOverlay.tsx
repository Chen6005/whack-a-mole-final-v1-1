import homeButton from "../assets/images/button_home.png";
import restartButton from "../assets/images/button_restart.png";
import resumeButton from "../assets/images/button_resume.png";

interface PauseOverlayProps {
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
}

export function PauseOverlay({ onResume, onRestart, onHome }: PauseOverlayProps) {
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="遊戲暫停">
      <section className="overlay-card">
        <p>TAKE A BREATH</p>
        <h2>遊戲暫停</h2>
        <button className="asset-button asset-button--primary" style={{ backgroundImage: `url(${resumeButton})` }} type="button" onClick={onResume}>繼續遊戲</button>
        <button className="asset-button asset-button--secondary" style={{ backgroundImage: `url(${restartButton})` }} type="button" onClick={onRestart}>重新開始</button>
        <button className="asset-button asset-button--secondary" style={{ backgroundImage: `url(${homeButton})` }} type="button" onClick={onHome}>回到首頁</button>
      </section>
    </div>
  );
}
