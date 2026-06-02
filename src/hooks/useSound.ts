import { useCallback, useRef } from "react";
import type { TargetType } from "../game/gameTypes";

const FREQUENCIES: Record<TargetType | "miss" | "start", number> = {
  normal: 520,
  golden: 820,
  time: 680,
  bomb: 120,
  shield: 360,
  miss: 180,
  start: 440,
};

export function useSound(enabled: boolean) {
  const contextRef = useRef<AudioContext | null>(null);

  return useCallback((sound: TargetType | "miss" | "start") => {
    if (!enabled) return;
    const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;
    if (!AudioContextClass) return;
    const context = contextRef.current ?? new AudioContextClass();
    contextRef.current = context;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = sound === "bomb" ? "sawtooth" : "sine";
    oscillator.frequency.setValueAtTime(FREQUENCIES[sound], context.currentTime);
    gain.gain.setValueAtTime(0.08, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.16);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.17);
  }, [enabled]);
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
