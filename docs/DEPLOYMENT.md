# Deployment

## Local

npm install
npm run build
npm run test

## GitHub

Commit only after build and tests pass.

Commit message:

feat: complete whack-a-mole final release

## Vercel

Deploy the project to Vercel.

After deployment, open the live URL and verify gameplay.

## Production Verification

Verify the production URL after each release:

- home, rules, gameplay, pause, settings and result screens
- mobile portrait viewport and desktop compatibility
- no missing assets or browser errors
- high-score persistence after reload

## Final Release v1.1

- GitHub: https://github.com/Chen6005/whack-a-mole-final-v1-1
- Production: https://whackamolefinalcodexpackage.vercel.app
- Status: `READY`

Verified on production:

- home screen and all local Image 2 assets load
- rules screen opens
- game board renders 9 holes
- easy-phase target spawns and a hit increases score from 0 to 10
- full round reaches result screen with score, accuracy, combo and action buttons
- browser console error scan is clean
