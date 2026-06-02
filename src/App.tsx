import { useEffect, useReducer, useRef, useState } from "react";
import { GameScreen } from "./components/GameScreen";
import { HomeScreen } from "./components/HomeScreen";
import { LevelBriefingOverlay } from "./components/LevelBriefingOverlay";
import { LevelSelectScreen } from "./components/LevelSelectScreen";
import { ResultScreen } from "./components/ResultScreen";
import { RulesScreen } from "./components/RulesScreen";
import { SettingsPanel } from "./components/SettingsPanel";
import { createInitialState, gameReducer } from "./game/gameReducer";
import { getLevel, updateLevelProgress } from "./game/levels";
import { loadHighScore, loadLevelProgress, loadSettings, saveHighScore, saveLevelProgress, saveSettings } from "./game/storage";
import type { ActiveTarget, GameMode, Settings } from "./game/gameTypes";
import { useGameLoop } from "./hooks/useGameLoop";
import { useResponsiveScale } from "./hooks/useResponsiveScale";
import { useSound } from "./hooks/useSound";
import "./styles/global.css";
import "./styles/layout.css";
import "./styles/animations.css";

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => createInitialState(loadHighScore(), loadSettings()));
  const [levelProgress, setLevelProgress] = useState(loadLevelProgress);
  const [briefingLevelId, setBriefingLevelId] = useState<number | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const processedLevelResult = useRef<string | null>(null);
  const playSound = useSound(state.soundEnabled);
  useResponsiveScale();
  useGameLoop(state, dispatch);

  useEffect(() => saveHighScore(state.highScore), [state.highScore]);
  useEffect(() => saveLevelProgress(levelProgress), [levelProgress]);
  useEffect(() => saveSettings({ soundEnabled: state.soundEnabled, effectsEnabled: state.effectsEnabled, reducedMotion: state.reducedMotion }), [state.effectsEnabled, state.reducedMotion, state.soundEnabled]);
  useEffect(() => {
    document.documentElement.classList.toggle("reduced-motion", state.reducedMotion);
  }, [state.reducedMotion]);
  useEffect(() => {
    if (!state.levelResult || state.screen !== "result") return;
    const resultKey = `${state.levelResult.levelId}:${state.score}:${state.levelResult.stars}:${state.levelResult.passed}`;
    if (processedLevelResult.current === resultKey) return;
    processedLevelResult.current = resultKey;
    setLevelProgress((progress) => updateLevelProgress(progress, state.levelResult!, state.score));
  }, [state.levelResult, state.score, state.screen]);

  const startArcade = () => {
    playSound("start");
    dispatch({ type: "START_GAME", now: Date.now() });
  };
  const startLevel = (levelId: number) => {
    if (levelId > levelProgress.unlockedLevel) return;
    processedLevelResult.current = null;
    playSound("start");
    dispatch({ type: "START_LEVEL", levelId, now: Date.now() });
  };
  const openLevelBriefing = (levelId: number) => {
    if (levelId <= levelProgress.unlockedLevel) setBriefingLevelId(levelId);
  };
  const confirmLevel = () => {
    if (briefingLevelId === null) return;
    const levelId = briefingLevelId;
    setBriefingLevelId(null);
    startLevel(levelId);
  };
  const restart = () => state.playMode === "level" && state.levelId ? startLevel(state.levelId) : startArcade();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.key === "Enter" || event.key === " ") && (state.screen === "home" || state.screen === "result") && !settingsOpen) {
        event.preventDefault();
        restart();
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
      {state.screen === "home" && <HomeScreen mode={state.mode} highScore={state.highScore} onModeChange={setMode} onStart={startArcade} onLevels={() => dispatch({ type: "SET_SCREEN", screen: "levels" })} onRules={() => dispatch({ type: "SET_SCREEN", screen: "rules" })} />}
      {state.screen === "rules" && <RulesScreen onHome={home} />}
      {state.screen === "levels" && <LevelSelectScreen progress={levelProgress} onHome={home} onSelect={openLevelBriefing} />}
      {state.screen === "game" && <GameScreen state={state} onHit={hit} onMiss={miss} onPause={() => dispatch({ type: "PAUSE", now: Date.now() })} onResume={() => dispatch({ type: "RESUME", now: Date.now() })} onRestart={restart} onHome={home} />}
      {state.screen === "result" && <ResultScreen state={state} onRestart={restart} onHome={home} onLevels={() => dispatch({ type: "SET_SCREEN", screen: "levels" })} onNextLevel={openLevelBriefing} onModeChange={setMode} />}
      <button className="settings-button" type="button" onClick={() => setSettingsOpen(true)} aria-label="開啟設定">⚙</button>
      {settingsOpen && <SettingsPanel settings={state} onChange={updateSettings} onClose={() => setSettingsOpen(false)} />}
      {briefingLevelId !== null && getLevel(briefingLevelId) && <LevelBriefingOverlay level={getLevel(briefingLevelId)!} onCancel={() => setBriefingLevelId(null)} onStart={confirmLevel} />}
    </div>
  );
}
