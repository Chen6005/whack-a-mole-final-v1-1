import homeButton from "../assets/images/button_home.png";

interface RulesScreenProps {
  onHome: () => void;
}

const targets = [
  ["普通地鼠", "+10 分", "穩定累積分數"],
  ["黃金地鼠", "+30 分", "稀有高分目標"],
  ["時間地鼠", "+5 分、+5 秒", "延長你的回合"],
  ["炸彈地鼠", "-20 分", "Combo 會中斷"],
  ["護甲地鼠", "+25 分", "需要連續擊中兩次"],
];

export function RulesScreen({ onHome }: RulesScreenProps) {
  return (
    <main className="screen screen--rules">
      <section className="rules-card">
        <header className="section-heading">
          <p>HOW TO PLAY</p>
          <h1>遊戲規則</h1>
        </header>
        <p>在倒數結束前快速點擊冒出的地鼠。點到空洞或炸彈都會中斷 Combo，越後段節奏越快，也會同時冒出更多目標。</p>
        <div className="rule-callout">連擊 3 次獲得額外分數，5 次觸發特效，10 次啟動短暫雙倍分數！</div>
        <h2>地鼠類型</h2>
        <div className="rules-table">
          {targets.map(([name, score, detail]) => (
            <div className="rule-row" key={name}>
              <strong>{name}</strong><span>{score}</span><small>{detail}</small>
            </div>
          ))}
        </div>
        <h2>遊戲模式</h2>
        <p>極速 30 秒、挑戰 45 秒、標準 60 秒。每種模式都會逐步進入簡單、中等、困難與狂熱階段。</p>
        <h2>手機操作</h2>
        <p>單指輕觸洞口即可揮槌。暫停後，倒數與畫面上的地鼠會一起凍結，恢復時接著玩。</p>
        <button className="asset-button asset-button--secondary" style={{ backgroundImage: `url(${homeButton})` }} type="button" onClick={onHome}>
          回到首頁
        </button>
      </section>
    </main>
  );
}
