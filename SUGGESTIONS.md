# Chief Jumper - Audience Pass Suggestions

_Updated: 2026-05-30_

---

## Evangelist Persona

The ideal sharer is a mid-level tech worker who posts to r/antiwork or r/cscareerquestions,
lurks r/webgames, and genuinely laughs at corporate jargon. They use Dino Game or Mini Metro
as their go-to browser time-kill. What makes them screenshot: reaching "VP" or higher and
immediately getting laid off, then sharing the "LAID OFF / VP" death card to their group chat
with zero context. What makes them bounce in 5 seconds: anything that feels like a generic
game that just slapped "corporate" in the title without committing to the bit.

---

## Ground Truth (Repo HEAD vs Live)

**Repo HEAD state (commit a41d1ed):**
- Game loads and runs end-to-end as a static no-build ES-module site.
- "LAID OFF" death screen header (red) + earned job title in gold: DONE in HEAD.
- Personal best persistence via localStorage (PersonalBest.js, try/catch safe): DONE in HEAD.
- "Your best: X as Manager" on menu screen: DONE in HEAD.
- "NEW BEST!" pulsing gold banner on game-over when beaten: DONE in HEAD.
- Share card: "I made [title] with a score of [X] before getting laid off in Chief Jumper": DONE.
- No fabricated data, no fake live/real-time claims, no example.com links. CLEAN.

**Deploy mismatch (flagged):**
The live site at https://chief-jumper.vercel.app still serves the old pre-fix build.
Evidence: `curl .../src/ui/GameOverScreen.js` returns the OLD draw() signature
(no personalBest param, no "LAID OFF" header). The repo HEAD fixes are committed and pushed
to GitHub but Vercel has not re-deployed. The repo is the source of truth; the live URL
is stale. This is a deploy-needed flag, not a code problem.

**Off-brand immersion breaks (still in HEAD):**
- MenuScreen.js subtitle: "A Spartan Roguelike" - sci-fi/Halo-flavored, clashes with corporate satire theme.
- LevelTransition.js: "Approaching next planet..." - completely off-theme (space explorer, not office drone).
- LevelTransition.js: "LEVEL COMPLETE" banner - generic; misses a corporate satire opportunity.
- MenuScreen.js: tap prompt says "TAP TO START" only; desktop users see the same text (minor).
- HUD: job title is shown on death screen but NOT shown during play on the HUD (missed context).

---

## Prioritized Plan

### Quick Wins (S - contained, syntax-checkable, no build needed)

**1. Fix off-brand sci-fi language in LevelTransition (DONE THIS PASS)**
- File: `src/ui/LevelTransition.js`
- Change "Approaching next planet..." to "Relocating to next floor..." and "LEVEL COMPLETE" to
  "PROMOTED!" so the corporate satire runs through the whole session, not just death.
- Why: The evangelist who loves the "LAID OFF" punchline will bounce if the between-level screen
  reads like Halo. Immersion gap breaks the joke.
- Effort: S (2-line change). No deploy needed to verify JS logic; deploy needed for visual confirm.

**2. Fix off-brand subtitle on menu (DONE THIS PASS)**
- File: `src/ui/MenuScreen.js`
- Change "A Spartan Roguelike" to "Climb the Corporate Ladder" (matches the HTML title tag).
- Why: First 5-second impression sets the tone. "Spartan Roguelike" signals wrong genre.
- Effort: S (1-line change).

**3. Add job title to HUD during play**
- File: `src/ui/HUD.js`
- Show current job title (from `titleForLevel(level)`) small/dim in the top bar next to "LVL X".
- Why: The evangelist wants to feel the corporate ascent while climbing, not just at death.
- Effort: S. No deploy needed to verify.

**4. Dual tap/click prompt on menu for desktop**
- File: `src/ui/MenuScreen.js`
- Detect `navigator.maxTouchPoints > 0` or just show "TAP / CLICK TO START".
- Why: Desktop r/webgames lurkers see "TAP TO START" and feel the game is not for them.
- Effort: S.

### Medium Bets (M - worth doing, slightly more surface area)

**5. Corporate-flavored difficulty announcements in LevelTransition**
- Show the next level's job title ("Now entering: Manager territory") during flight scene.
- File: `src/ui/LevelTransition.js`
- Why: Teases the next promotion, raises stakes. Rewards players who push through.
- Effort: M (pass level number, derive title, lay out text).

**6. Shareable score card with job title badge**
- The current share card text is a plain sentence. A small emoji-based score card
  (e.g., "LAID OFF [Manager] | Score: 4,230") that looks copy-paste-ready for Discord.
- File: `src/ui/ShareCard.js`
- Why: More scannable in a group chat - the corporate joke lands faster.
- Effort: M.

**7. Controls hint that is desktop-aware**
- File: `src/ui/MenuScreen.js` + `src/Game.js`
- Show separate desktop vs mobile controls hint based on touch detection.
- Effort: M.

### Bigger Bets (L - multi-session work, flag for Michael)

**8. Leaderboard (anonymous, serverless)**
- Global top-10 by score with job titles. Major shareable hook ("I'm ranked 4th SVP").
- Needs Vercel KV or similar. Flagged for Michael.

**9. More corporate enemy types / bosses**
- A "HR Department" boss at level 5, a "Reorg Wave" that reshuffles platforms.
- Effort: L. Requires new entity classes, sprites, and level design.

**10. Sound design pass**
- Add "promotion fanfare" on level complete, corporate hold-music loop on menu.
- Effort: M-L depending on audio sourcing.

---

## Deploy Note

The two prior-pass fixes (LAID OFF death screen, personal best persistence) are in HEAD but
the live site is running the old build. A Vercel re-deploy will surface 2 iters of improvements
at once. Flag: `deploy-mismatch`.
