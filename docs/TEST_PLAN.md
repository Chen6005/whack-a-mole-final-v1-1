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
