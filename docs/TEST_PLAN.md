# Test Plan

## Automated Tests

Vitest covers:

- standard scoring and three-hit bonus
- ten-hit multiplier
- bomb penalty and combo reset
- accuracy and high-score update
- all three timer mode values
- special-target probability ranges
- occupied and recent-hole avoidance
- frenzy multi-spawn uniqueness
- pause target-freeze behavior
- empty-hole combo reset
- two-hit shield behavior
- 10 distinct formal challenge definitions, increasing speed and boss stages
- level speed multiplier layered over original easy-to-frenzy acceleration
- level goal pass/fail and one-to-three-star calculation
- no-bomb challenge failure after bomb hit
- sequential unlock and best-record preservation

## Local Browser Verification

- 390x844 phone viewport: full-height home screen with no white border
- Rules screen: `overflow-y: auto`, scroll height greater than viewport height
- Game screen: nine touch targets and board fully visible
- Target spawn: target appears in the easy phase and tapping increases score from 0 to 10
- Pause/resume: timer remains at 28s while paused, then resumes countdown
- Result and settings overlays render with touch-friendly actions
- Local Storage: high score survives reload
- 1440x1000 desktop viewport: portrait shell is centered at 540px width
- Browser errors: none detected

## Level-System Browser Verification

- 390x844 phone viewport: home remains full-height after adding the level entry
- Level select: 10 cards, initial state has 1 unlocked and 9 locked
- Level select: `overflow-y: auto`, 983px scroll content inside an 844px viewport
- Mission briefing: Level, timer, speed, pass condition, star thresholds and hint fit in the phone viewport
- Rules page: complete guide scrolls, explains Double two-hit behavior, unlocking and stars
- Level 1: target label renders, nine-hole board remains intact
- Completion: Level 1 earns stars and writes Local Storage progress
- Unlock: list changes to 2 unlocked and 28 locked cards; Level 1 best score remains visible
- Arcade regression: original start button still launches gameplay without a level objective
