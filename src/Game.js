import { GameLoop } from './core/GameLoop.js';
import { Camera } from './core/Camera.js';
import { InputManager } from './core/InputManager.js';
import { Player } from './entities/Player.js';
import { HealthOrb } from './entities/HealthOrb.js';
import { BoosterSystem } from './systems/BoosterSystem.js';
import { ShootingSystem } from './systems/ShootingSystem.js';
import { CollisionSystem } from './systems/CollisionSystem.js';
import { ParticleSystem } from './systems/ParticleSystem.js';
import { LevelGenerator } from './systems/LevelGenerator.js';
import { DifficultyManager } from './systems/DifficultyManager.js';
import { MagnetSystem } from './systems/MagnetSystem.js';
import { HUD } from './ui/HUD.js';
import { BoosterOverlay } from './ui/BoosterOverlay.js';
import { JoystickOverlay } from './ui/JoystickOverlay.js';
import { MenuScreen } from './ui/MenuScreen.js';
import { GameOverScreen } from './ui/GameOverScreen.js';
import { ShareCard } from './ui/ShareCard.js';
import { LevelTransition } from './ui/LevelTransition.js';
import { GAME_WIDTH, COLORS, titleForLevel } from './data/constants.js';
import { SFX } from './data/sounds.js';
import { loadPersonalBest, saveIfPersonalBest } from './core/PersonalBest.js';

const STATES = {
    MENU: 'MENU',
    PLAYING: 'PLAYING',
    LEVEL_TRANSITION: 'LEVEL_TRANSITION',
    GAME_OVER: 'GAME_OVER',
};

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.state = STATES.MENU;
        this.level = 1;

        // Size the canvas
        this._resize();
        window.addEventListener('resize', () => this._resize());

        // Core systems
        this.loop = new GameLoop();
        this.input = new InputManager(canvas);
        this.camera = new Camera(canvas.height);

        // Gameplay systems
        this.booster = new BoosterSystem(this.input);
        this.shooting = new ShootingSystem(this.input);
        this.collision = new CollisionSystem();
        this.particles = new ParticleSystem();
        this.difficulty = new DifficultyManager();
        this.levelGen = new LevelGenerator(this.difficulty);
        this.magnet = new MagnetSystem();

        // UI
        this.hud = new HUD();
        this.boosterOverlay = new BoosterOverlay();
        this.joystickOverlay = new JoystickOverlay();
        this.menuScreen = new MenuScreen();
        this.gameOverScreen = new GameOverScreen();
        this.shareCard = new ShareCard();
        this.levelTransition = new LevelTransition();

        // Personal best (persisted across sessions)
        this.personalBest = loadPersonalBest();
        this.isNewBest = false;

        // World entities
        this.player = null;
        this.projectiles = [];
        this.orbs = [];

        // Background stars (persistent)
        this.bgStars = [];
        for (let i = 0; i < 50; i++) {
            this.bgStars.push({
                x: Math.random() * GAME_WIDTH,
                y: Math.random() * 2000,
                size: 1 + Math.random(),
                brightness: 0.2 + Math.random() * 0.5,
            });
        }

        // Menu tap handler
        this._setupMenuInput();
    }

    _resize() {
        const w = window.innerWidth;
        const h = window.innerHeight;

        this.canvas.width = GAME_WIDTH;
        this.canvas.height = Math.floor(GAME_WIDTH * (h / w));

        this.canvas.style.width = w + 'px';
        this.canvas.style.height = h + 'px';

        if (this.camera) {
            this.camera.canvasHeight = this.canvas.height;
        }
    }

    _setupMenuInput() {
        const handler = () => {
            if (this.state === STATES.MENU) {
                this._startLevel(1);
            } else if (this.state === STATES.GAME_OVER) {
                this.shareCard.hide();
                this.state = STATES.MENU;
            }
        };

        this.canvas.addEventListener('touchstart', handler);
        this.canvas.addEventListener('mousedown', handler);
    }

    start() {
        this.loop.start(
            (dt) => this._update(dt),
            (alpha) => this._render(alpha)
        );
    }

    _startLevel(level) {
        this.level = level;
        this.difficulty.setLevel(level);
        this.state = STATES.PLAYING;
        if (this.shareCard) this.shareCard.hide();

        const startY = 5000;
        this.player = new Player(GAME_WIDTH / 2, startY);
        this.projectiles = [];
        this.orbs = [];

        this.levelGen.init(startY, level);
        this.camera.reset(startY);

        // Clear input state so menu click doesn't affect gameplay
        this.input.reset();
        this.booster.lastRelease = null;
    }

    _update(dt) {
        switch (this.state) {
            case STATES.MENU:
                this.menuScreen.update(dt);
                break;

            case STATES.PLAYING:
                this._updatePlaying(dt);
                break;

            case STATES.LEVEL_TRANSITION:
                this.levelTransition.update(dt);
                if (this.levelTransition.isDone()) {
                    this._startLevel(this.level + 1);
                }
                break;

            case STATES.GAME_OVER:
                this.gameOverScreen.update(dt);
                break;
        }
    }

    _updatePlaying(dt) {
        const p = this.player;

        // Booster system
        this.booster.update(dt);
        this.booster.consumeRelease(p);

        // Player physics
        p.update(dt);

        // Shooting
        this.shooting.update(dt, p, this.projectiles);

        // Level generation
        this.levelGen.update(this.camera.y, this.canvas.height);

        // Update platforms
        for (const plat of this.levelGen.platforms) {
            if (plat.active) plat.update(dt);
        }

        // Update enemies
        for (const enemy of this.levelGen.enemies) {
            if (enemy.active) {
                enemy.update(dt, p.x, p.y, this.projectiles);
            }
        }

        // Update projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            this.projectiles[i].update(dt);
            if (!this.projectiles[i].active) {
                this.projectiles.splice(i, 1);
            }
        }

        // Update orbs
        for (let i = this.orbs.length - 1; i >= 0; i--) {
            this.orbs[i].update(dt);
            if (!this.orbs[i].active) {
                this.orbs.splice(i, 1);
            }
        }

        // Collisions
        this.collision.update(
            p,
            this.levelGen.platforms,
            this.levelGen.enemies,
            this.projectiles,
            this.orbs,
            (enemy) => this._onEnemyKilled(enemy)
        );

        // Magnetic orb pickup
        this.magnet.update(dt, p, this.orbs);

        // Particles
        this.particles.update(dt);

        // Camera
        this.camera.update(p.y, dt);

        // Death check
        if (p.y > this.camera.getDeathLineY() || p.isDead) {
            this.state = STATES.GAME_OVER;
            SFX.gameOver();
            const runTitle = titleForLevel(this.level);
            this.isNewBest = saveIfPersonalBest(p.score, runTitle);
            if (this.isNewBest) this.personalBest = { score: p.score, title: runTitle };
            this.shareCard.show(this.player.score, this.level);
            return;
        }

        // Level complete check
        if (this.levelGen.isLevelComplete(p.y)) {
            this.state = STATES.LEVEL_TRANSITION;
            this.levelTransition.start(this.level, p.y, this.canvas.height);
            SFX.levelComplete();
        }
    }

    _onEnemyKilled(enemy) {
        SFX.enemyKill();

        // Particles
        this.particles.emit({
            x: enemy.x, y: enemy.y,
            count: 8, color: COLORS[enemy.type] || '#ff6633',
            speed: 120, lifetime: 0.4, gravity: 300,
        });

        // Score
        this.player.score += enemy.type === 'hunter' ? 500 : (enemy.type === 'elite' ? 200 : 100);

        // Drop health orb
        if (enemy.shouldDropOrb()) {
            this.orbs.push(new HealthOrb(enemy.x, enemy.y));
        }
    }

    _render(alpha) {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.imageSmoothingEnabled = false;

        // Clear
        ctx.fillStyle = COLORS.bg;
        ctx.fillRect(0, 0, w, h);

        switch (this.state) {
            case STATES.MENU:
                this.menuScreen.draw(ctx, w, h, this.personalBest);
                break;

            case STATES.PLAYING:
                this._renderPlaying(ctx, w, h);
                break;

            case STATES.LEVEL_TRANSITION:
                this._renderPlaying(ctx, w, h);
                this.levelTransition.draw(ctx, w, h);
                break;

            case STATES.GAME_OVER:
                this._renderPlaying(ctx, w, h);
                this.gameOverScreen.draw(ctx, w, h, this.player.score, this.level, this.personalBest, this.isNewBest);
                break;
        }
    }

    _renderPlaying(ctx, w, h) {
        // Background stars (parallax)
        this._drawBackground(ctx, w, h);

        // Platforms
        for (const plat of this.levelGen.platforms) {
            if (plat.active && this.camera.isOnScreen(plat.y, plat.height)) {
                plat.draw(ctx, this.camera);
            }
        }

        // Enemies
        for (const enemy of this.levelGen.enemies) {
            if (enemy.active && this.camera.isOnScreen(enemy.y, enemy.height)) {
                enemy.draw(ctx, this.camera);
            }
        }

        // Health orbs
        for (const orb of this.orbs) {
            if (orb.active) orb.draw(ctx, this.camera);
        }

        // Projectiles
        for (const proj of this.projectiles) {
            if (proj.active) proj.draw(ctx, this.camera);
        }

        // Player
        if (this.player) {
            this.player.draw(ctx, this.camera);
        }

        // Particles
        this.particles.draw(ctx, this.camera);

        // UI (screen space)
        if (this.player) {
            this.hud.draw(ctx, w, h, this.player, this.booster, this.level);
        }
        this.boosterOverlay.draw(ctx, w, h, this.booster);
        this.joystickOverlay.draw(ctx, this.input);
    }

    _drawBackground(ctx, w, h) {
        for (const star of this.bgStars) {
            // Parallax: stars move slower than camera
            const parallaxY = star.y - this.camera.y * 0.1;
            const screenY = ((parallaxY % h) + h) % h;

            ctx.globalAlpha = star.brightness;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(Math.floor(star.x), Math.floor(screenY), star.size, star.size);
        }
        ctx.globalAlpha = 1;
    }
}
