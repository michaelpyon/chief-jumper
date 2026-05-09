# Chief Jumper

A canvas-based vertical platformer with a corporate twist. Boost, dodge, and climb your way up the org chart.

Live: https://chief-jumper.vercel.app

## Controls

**Mobile (touch)**
- Left quarter of screen: charge left booster, release to fire
- Second quarter: charge right booster, release to fire
- Right half: virtual joystick for movement and aiming

**Desktop (mouse)**
- Click and hold in left zones to charge boosters
- Click and drag in right half to use the joystick

Charge time controls boost strength. Use both boosters to fly higher and faster.

## Run Locally

It's a static site with ES modules. Any local web server works:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Project Structure

```
index.html          Entry point + meta tags
css/style.css       Canvas styling
src/
  main.js           Bootstraps the Game
  Game.js           Main state machine (MENU, PLAYING, LEVEL_TRANSITION, GAME_OVER)
  core/             GameLoop, Camera, InputManager, AssetLoader
  entities/         Player, Enemy, Platform, HealthOrb, Projectile
  systems/          Collision, Booster, Shooting, Magnet, Particles, LevelGenerator, DifficultyManager
  ui/               HUD, MenuScreen, GameOverScreen, BoosterOverlay, JoystickOverlay, LevelTransition
  data/             constants, sprites, sounds
  utils/            math helpers
assets/
  sprites/          Sprite art
  audio/            Sound effects
```

## Deploy

Linked to Vercel. Push to `main` for auto-deploy, or run `npx vercel --prod`.
