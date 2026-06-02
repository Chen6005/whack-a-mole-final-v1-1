import bombEffect from "../assets/images/bomb_smoke.png";
import comboEffect from "../assets/images/combo_burst.png";
import dirtPatch from "../assets/images/dirt_patch.png";
import goldenEffect from "../assets/images/golden_spark.png";
import hitEffect from "../assets/images/hit_spark.png";
import activeShadow from "../assets/images/hole_active_shadow.png";
import emptyHole from "../assets/images/hole_empty.png";
import bombMole from "../assets/images/mole_bomb.png";
import goldenMole from "../assets/images/mole_golden.png";
import normalMole from "../assets/images/mole_normal.png";
import shieldMole from "../assets/images/mole_shield.png";
import timeMole from "../assets/images/mole_time.png";
import timeEffect from "../assets/images/time_glow.png";
import type { ActiveTarget, HitEffect, TargetType } from "../game/gameTypes";

const targetImages: Record<TargetType, string> = {
  normal: normalMole,
  golden: goldenMole,
  time: timeMole,
  bomb: bombMole,
  shield: shieldMole,
};

const effectImages: Record<HitEffect["type"], string> = {
  hit: hitEffect,
  golden: goldenEffect,
  time: timeEffect,
  bomb: bombEffect,
  combo: comboEffect,
};

interface MoleHoleProps {
  index: number;
  target?: ActiveTarget;
  effect?: HitEffect;
  onHit: (target: ActiveTarget) => void;
  onMiss: () => void;
}

export function MoleHole({ index, target, effect, onHit, onMiss }: MoleHoleProps) {
  return (
    <button
      className={`mole-hole ${target ? "is-active" : ""}`}
      type="button"
      aria-label={target ? `擊打${target.type}地鼠` : `空洞 ${index + 1}`}
      onClick={() => target ? onHit(target) : onMiss()}
    >
      <img className="dirt-patch" src={dirtPatch} alt="" />
      <img className="empty-hole" src={emptyHole} alt="" />
      {target && <img className="active-shadow" src={activeShadow} alt="" />}
      {target && <img className={`mole-sprite mole-sprite--${target.type}`} src={targetImages[target.type]} alt="" draggable="false" />}
      {target?.type === "shield" && <span className="shield-hp">{target.hp}</span>}
      {effect && (
        <span className="hit-feedback" key={effect.id}>
          <img src={effectImages[effect.type]} alt="" />
          <strong>{effect.label}</strong>
        </span>
      )}
    </button>
  );
}
