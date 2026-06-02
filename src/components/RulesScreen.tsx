import homeButton from "../assets/images/button_home.png";

interface RulesScreenProps {
  onHome: () => void;
}

const targets = [
  ["普通地鼠", "+10 分", "穩定累積分數，連續命中可建立 Combo。"],
  ["黃金地鼠", "+30 分", "稀有高分目標，黃金挑戰關的關鍵。"],
  ["時間地鼠", "+5 分、+5 秒", "命中後延長本局時間，適合在後段爭取反攻。"],
  ["Double 護甲地鼠", "第二擊 +25 分", "必須點擊兩次。第一擊只削減護甲；第二擊才算完成，並啟動約 3.5 秒雙倍分數。"],
  ["炸彈地鼠", "-20 分", "會造成畫面震動、扣分並立刻中斷 Combo。"],
];

export function RulesScreen({ onHome }: RulesScreenProps) {
  return (
    <main className="screen screen--rules">
      <section className="rules-card">
        <header className="section-heading">
          <p>COMPLETE GUIDE</p>
          <h1>遊戲規則</h1>
        </header>

        <section className="rules-section">
          <h2>1. 基本玩法</h2>
          <p>在限定時間內，點擊從九個洞口冒出的地鼠。正確命中會得分，特殊地鼠還會帶來額外效果。點到空洞、點錯目標或打中炸彈都會影響表現。時間結束後，自由模式會顯示本局成績；關卡模式則會依照任務條件判定是否通關。</p>
        </section>

        <section className="rules-section">
          <h2>2. 地鼠與得分</h2>
          <div className="rules-table">
            {targets.map(([name, score, detail]) => (
              <div className="rule-row" key={name}>
                <strong>{name}</strong><span>{score}</span><small>{detail}</small>
              </div>
            ))}
          </div>
          <div className="rule-callout">Double 護甲地鼠一定要點兩次：第一擊不算完全擊中，第二擊完成後才會給分並啟動雙倍分數。</div>
        </section>

        <section className="rules-section">
          <h2>3. Combo 規則</h2>
          <p>連續正確擊中地鼠會累積 Combo。每達到 3 的倍數 Combo 會追加 +5 分；5 Combo 起會出現強化特效；10 Combo 起會啟動短暫雙倍分數。打空洞或打中炸彈會立刻中斷 Combo，雙倍狀態也會消失。Combo 同時會影響部分關卡的通關條件與三星評價。</p>
        </section>

        <section className="rules-section">
          <h2>4. 自由模式與加速</h2>
          <p>自由模式包含極速 30 秒、挑戰 45 秒與標準 60 秒。每局都會隨著剩餘時間減少，依序進入簡單、中等、困難與狂熱階段：地鼠停留時間縮短、冒出間隔變短，後段也可能同時出現多個目標。</p>
        </section>

        <section className="rules-section">
          <h2>5. 十關挑戰</h2>
          <p>關卡模式共有 10 關正式挑戰。每一關都有自己的時間限制、速度倍率、特殊地鼠配置與通關條件。關卡速度倍率會疊加在原本的局內加速上，所以每一關本身更快，遊戲後段仍會繼續加速。</p>
          <p>關卡可能要求指定分數、黃金地鼠數量、Combo、時間地鼠、Double 護甲地鼠或混合特殊地鼠。特殊任務關除了完成指定任務，也必須達到任務面板顯示的基本分數。</p>
        </section>

        <section className="rules-section">
          <h2>6. 通關與解鎖</h2>
          <p>點擊關卡卡片後，開始前會先顯示任務面板，列出 Level 編號、關卡名稱、時間、速度、通關條件、星級條件與特殊提示。達成通關條件後會顯示「通關成功」，保存成績並解鎖下一關；未達成則會顯示「挑戰失敗」，需要重新挑戰。</p>
          <p>第一次遊玩只開放 Level 1。完成 Level 1 後解鎖 Level 2，依此類推。已解鎖關卡可以重複挑戰，以提高最高分與星級。完成 Level 10 後會獲得全部關卡完成提示。</p>
        </section>

        <section className="rules-section">
          <h2>7. 星級評價</h2>
          <p>每關最高可獲得 3 星。★ 代表完成基本通關；★★ 代表達到較高分數且命中率至少 65%；★★★ 代表達到最佳分數、命中率至少 80%，並達成指定 Combo。每關的詳細門檻會在開始前任務面板中顯示。系統會保存每關最高星級與最高分。</p>
        </section>

        <section className="rules-section">
          <h2>8. 手機操作</h2>
          <p>單指輕觸洞口即可揮槌。所有洞口與按鈕都針對手機觸控設計。暫停後，倒數與畫面上的地鼠會一起凍結；恢復時會接著玩。關卡列表與規則頁都可以上下滑動。</p>
        </section>

        <button className="asset-button asset-button--secondary" style={{ backgroundImage: `url(${homeButton})` }} type="button" onClick={onHome}>
          回到首頁
        </button>
      </section>
    </main>
  );
}
