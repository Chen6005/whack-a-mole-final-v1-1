# UI Design Direction

## Style

Cute 3D cartoon arcade garden style.

## Screens

- Home
- Level Select
- Rules
- Game
- Pause
- Result
- Settings

## Board

3x3 hole grid.

## Mobile Requirements

- Use 100dvh
- Respect safe-area insets
- No white top or bottom bars
- Touch-friendly controls
- Rules page must scroll
- Board must remain visible within screen height
- Preserve a 3x3 board at small phone sizes

## Responsive Behavior

- Primary reference viewport: 390x844 portrait
- Mobile shell: full viewport height and width
- Tablet and desktop: portrait game area capped at 540px and centered on a deep-green canvas
- Result card and rules card: independent vertical scrolling when needed
- Level select: scrollable two-column touch cards with lock state, stars, score and boss ribbon

## Visual Feedback

- Hit spark
- Combo burst
- Bomb shake
- Golden glow
- Floating score text
- Reduced-motion override
