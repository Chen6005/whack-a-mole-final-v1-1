import { useEffect, useRef } from "react";
import { getDifficulty } from "../game/gameConfig";
import { createSpawnTargets } from "../game/spawnLogic";
import type { GameAction, GameState } from "../game/gameTypes";

export function useGameLoop(state: GameState, dispatch: React.Dispatch<GameAction>): void {
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (state.screen !== "game" || state.isPaused) return;
    const timer = window.setInterval(() => dispatch({ type: "TICK", now: Date.now() }), 1000);
    return () => window.clearInterval(timer);
  }, [dispatch, state.isPaused, state.screen]);

  useEffect(() => {
    if (state.screen !== "game" || state.isPaused) return;
    let timer = 0;
    let stopped = false;

    const queueSpawn = () => {
      const current = stateRef.current;
      timer = window.setTimeout(() => {
        if (stopped) return;
        const latest = stateRef.current;
        dispatch({ type: "SPAWN", targets: createSpawnTargets(latest, Date.now()) });
        queueSpawn();
      }, getDifficulty(current.timeRemaining, current.mode).spawnMs);
    };

    queueSpawn();
    return () => {
      stopped = true;
      window.clearTimeout(timer);
    };
  }, [dispatch, state.isPaused, state.mode, state.screen]);

  useEffect(() => {
    if (!state.lastEffect) return;
    const effectId = state.lastEffect.id;
    const timer = window.setTimeout(() => dispatch({ type: "CLEAR_EFFECT", effectId }), 650);
    return () => window.clearTimeout(timer);
  }, [dispatch, state.lastEffect]);
}
