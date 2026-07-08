# DESIGN.md - Chief Jumper (source of truth for the AAA relaunch build)

Read PERSONA.md (Dana, the joke curator) and BRAND.md (corporate-noir, deadpan HR voice) first. This file defines what gets built and honored.

## Layout / IA intent

Single-page, full-viewport canvas game. No marketing site, no nav, no scroll. The entire IA is the game's state machine:

MENU -> PLAYING -> LEVEL_TRANSITION (PROMOTED!) -> ... -> GAME_OVER (LAID OFF) -> share or retry -> MENU

The only DOM outside the canvas: the share card overlay (existing #share-card) and noscript fallback. Keep it that way. Any new UI (leaderboard, settings) renders in-canvas or as a matching overlay in the same corporate-blue-bordered style.

## Hero / landing concept

The menu screen IS the landing page. First frame requirements, in priority order:

1. CHIEF JUMPER title (2-tone: player blue + visor cyan, current treatment is fine)
2. Subtitle: "Climb the Corporate Ladder" (already fixed at HEAD)
3. Positioning line under it: "Climb the org chart. Get laid off anyway."
4. Input-aware start prompt: TAP TO START (touch) / CLICK TO START (desktop), already at HEAD
5. Personal best line if present: "Your best: 4,120 as Manager"
6. Idle motion within 500ms of load (pulsing prompt + animated starfield) so the page never reads as frozen. Dana bounces on a static black canvas.

Optional polish bet: silhouetted office-tower skyline strip along the bottom of the menu, converting the leftover starfield into "night above the towers" per BRAND.md.

## Key screens list

1. **Menu** (landing, above)
2. **Gameplay + HUD**: score, health, current job title visible at all times (HEAD already shows title on HUD; keep top placement, gold)
3. **Level transition**: "PROMOTED!" + new title in gold + "Relocating to next floor..." (exists at HEAD; add sub-400ms gold flourish)
4. **Game over / death card**: the product's centerpiece. Composition top to bottom: LAID OFF (red, stamped in hard), job title (gold, large), score (white), personal best or NEW BEST banner, retry prompt, and small "chief-jumper.vercel.app" fine print so raw screenshots carry the URL
5. **Share card overlay**: existing DOM overlay with Copy result + Share on X (keep; tighten copy to the pre-filled line in PERSONA.md)
6. **Pause / focus-lost state** (new, small): auto-pause on blur with deadpan copy, e.g. "Meeting in progress. Tap to resume."

## Empty / loading / error state intent

- **Loading:** asset load is small; if a loading frame is ever visible, render "Onboarding..." in gray monospace on the navy background. Never a blank white or blank black frame.
- **Empty (no personal best):** menu simply omits the best line. Never show "Your best: 0."
- **Error:** noscript block exists. Add a top-level try/catch around boot that paints a canvas message: "The office is closed. Refresh to try again." localStorage access already try/catch-safe (PersonalBest.js); preserve that, private-mode Safari must never crash the game.
- **Unsupported input edge:** if neither touch nor mouse fires within the menu, prompt still pulses; no dead ends.

## Metadata / OG intent (X-readiness, mandatory)

Existing head is already strong: full OG + twitter:card summary_large_image + canonical + 1200x630 og-image.png (served 200 on live). Relaunch requirements:

1. Rebuild og-image.png to match the death-card poster: navy background, LAID OFF red + gold title composition, game name, positioning line. The OG image should look like the screenshot people share, so link previews and organic screenshots are the same artifact.
2. Update og/twitter description strings to the new positioning line.
3. Keep og:image as PNG (SVG regression already fixed once in f07eaa4; do not reintroduce).
4. theme-color stays #0a0a1a.
5. Verify with a card validator against the LIVE deploy after Michael redeploys, not against HEAD.

## The screenshot-worthy moment to engineer

**The LAID OFF death card at thumbnail size.** Acceptance test: screenshot the game-over screen on an iPhone, shrink it to a group-chat thumbnail; LAID OFF and the gold job title must still be legible and the joke must still land with zero caption. Add the URL fine print so the screenshot self-attributes. Secondary shareable: the NEW BEST gold banner variant.

Bigger bets carried from the roster (build only if time allows, in this order): sound pass (promotion fanfare, corporate hold-music menu loop), more corporate enemy types (HR boss, Reorg Wave), serverless leaderboard with job titles (blocked on Vercel KV, Michael provisions).

## Data honesty

Clean. The game claims no real data: no fetch/API calls, no fake live stats, no fabricated leaderboards. Personal best is genuinely local (localStorage) and labeled as "Your best," which is true. Nothing to disclose. Constraint going forward: if the global leaderboard bet ships, it must show only real submitted runs; never seed it with fake entries, and label it "All-time layoffs" or similar only once real data exists.

## Deploy truth (blocker, not a design item)

Live https://chief-jumper.vercel.app serves a stale pre-fix build: verified today (2026-07-08) that the served GameOverScreen.js contains 0 instances of "LAID OFF" while repo HEAD (2c0646c) has the full satire layer. All design judgments in this file are against repo HEAD. Michael must trigger the redeploy (npx vercel --prod or a push-triggered build); execution agents must not deploy.
