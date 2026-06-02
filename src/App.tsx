import { useEffect, useReducer, useState } from "react";
import { GameScreen } from "./components/GameScreen";
import { HomeScreen } from "./components/HomeScreen";
import { ResultScreen } from "./components/ResultScreen";
import { RulesScreen } from "./components/RulesScreen";
import { SettingsPanel } from "./components/SettingsPanel";
import { createInitialState, gameReducer } from "./game/gameReducer";
import { loadHighScore, loadSettings, saveHighScore, saveSettings } from "./game/storage";
import type { ActiveTarget, GameMode, Settings } from "./game/gameTypes";
import { useGameLoop } from "./hooks/useGameLoop";
import { useResponsiveScale } from "./hooks/useResponsiveScale";
import { useSound } from "./hooks/useSound";
import "./styles/global.css";
import "./styles/layout.css";
import "./styles/animations.css";

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => createInitialState(loadHighScore(), loadSettings()));
  const [settingsOpen, setSettingsOpen] = useState(false);
  const playSound = useSound(state.soundEnabled);
  useResponsiveScale();
  useGameLoop(state, dispatch);

  useEffect(() => saveHighScore(state.highScore), [state.highScore]);
  useEffect(() => saveSettings({ soundEnabled: state.soundEnabled, effectsEnabled: state.effectsEnabled, reducedMotion: state.reducedMotion }), [state.effectsEnabled, state.reducedMotion, state.soundEnabled]);
  useEffect(() => {
    document.documentElement.classList.toggle("reduced-motion", state.reducedMotion);
  }, [state.reducedMotion]);

  const start = () => {
    playSound("start");
    dispatch({ type: "START_GAME", now: Date.now() });
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.key === "Enter" || event.key === " ") && (state.screen === "home" || state.screen === "result") && !settingsOpen) {
        event.preventDefault();
        start();
      }
      if (event.key === "Escape" && state.screen === "game") {
        dispatch({ type: state.isPaused ? "RESUME" : "PAUSE", now: Date.now() });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const hit = (target: ActiveTarget) => {
    playSound(target.type);
    dispatch({ type: "HIT_TARGET", targetId: target.id, now: Date.now() });
  };

  const miss = () => {
    playSound("miss");
    dispatch({ type: "MISS_EMPTY" });
  };

  const setMode = (mode: GameMode) => dispatch({ type: "SET_MODE", mode });
  const updateSettings = (settings: Partial<Settings>) => dispatch({ type: "SET_SETTINGS", settings });
  const home = () => dispatch({ type: "SET_SCREEN", screen: "home" });

  return (
    <div className="app-shell">
      {state.screen === "home" && <HomeScreen mode={state.mode} highScore={state.highScore} onModeChange={setMode} onStart={start} onRules={() => dispatch({ type: "SET_SCREEN", screen: "rules" })} />}
      {state.screen === "rules" && <RulesScreen onHome={home} />}
      {state.screen === "game" && <GameScreen state={state} onHit={hit} onMiss={miss} onPause={() => dispatch({ type: "PAUSE", now: Date.now() })} onResume={() => dispatch({ type: "RESUME", now: Date.now() })} onRestart={start} onHome={home} />}
      {state.screen === "result" && <ResultScreen state={state} onRestart={start} onHome={home} onModeChange={setMode} />}
      <button className="settings-button" type="button" onClick={() => setSettingsOpen(true)} aria-label="開啟設定">⚙</button>
      {settingsOpen && <SettingsPanel settings={state} onChange={updateSettings} onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}
