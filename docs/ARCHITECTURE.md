# Architecture

## Runtime

The game is a client-side React + TypeScript + Vite application. It does not require a backend or external game engine.

## State Model

`src/game/gameReducer.ts` owns screen navigation, mode, score, high score, timer, pause state, active holes, combo, hit/miss counts, visual feedback and settings. All gameplay transitions are explicit reducer actions.

## Loop Design

`src/hooks/useGameLoop.ts` runs two independent schedules:

- a one-second countdown that ends the round at zero
- a recursive spawn timer that reads the latest state without being reset by countdown renders

Pause stops both schedules. Resume shifts active-target expiry timestamps by the paused duration so visible targets remain frozen.

## Game Logic

- `gameConfig.ts`: mode durations, points and progressive difficulty
- `spawnLogic.ts`: target probabilities, unique-hole selection and multi-spawn rules
- `scoring.ts`: scoring, combo bonus, multiplier, accuracy, rank and high-score helpers
- `storage.ts`: Local Storage persistence for high score and settings

## Presentation

The component tree mirrors the required screens and overlays. CSS uses `100dvh`, safe-area insets and a centered maximum-width portrait shell for mobile-first behavior with desktop compatibility.
