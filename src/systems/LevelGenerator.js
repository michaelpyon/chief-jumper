import { Platform } from '../entities/Platform.js';
import { Enemy } from '../entities/Enemy.js';
import {
    CHUNK_HEIGHT, GAME_WIDTH, PLATFORM_WIDTH,
    BOUNCE_VELOCITY, GRAVITY,
} from '../data/constants.js';
import { randomRange, clamp } from '../utils/math.js';

// Max bounce height: v²/(2g)
const MAX_BOUNCE_HEIGHT = (BOUNCE_VELOCITY * BOUNCE_VELOCITY) / (2 * GRAVITY);
const BASE_V_GAP = MAX_BOUNCE_HEIGHT * 0.65;
const MARGIN = PLATFORM_WIDTH / 2 + 10;
const X_MIN = MARGIN;
const X_MAX = GAME_WIDTH - MARGIN;

export class LevelGenerator {
    constructor(difficultyManager) {
        this.difficulty = difficultyManager;
        this.chunks = new Map();
        this.platforms = [];
        this.enemies = [];
        this.startY = 0;
        this.targetHeight = 0;
        this.lastPlatX = GAME_WIDTH / 2;
        this.stepCount = 0;
    }

    init(startY, level) {
        this.chunks.clear();
        this.platforms = [];
        this.enemies = [];
        this.startY = startY;
        this.targetHeight = startY - this.difficulty.getLevelTargetHeight(level);
        this.lastPlatX = GAME_WIDTH / 2;
        this.stepCount = 0;

        this.platforms.push(new Platform(GAME_WIDTH / 2, startY + 40, 'normal'));

        const startChunk = this._getChunkIndex(startY);
        for (let i = startChunk; i >= startChunk - 5; i--) {
            this._generateChunk(i);
        }
    }

    update(cameraY, canvasHeight) {
        const topChunk = this._getChunkIndex(cameraY - CHUNK_HEIGHT);
        const bottomChunk = this._getChunkIndex(cameraY + canvasHeight + CHUNK_HEIGHT);

        for (let i = topChunk; i <= bottomChunk; i++) {
            if (!this.chunks.has(i)) {
                this._generateChunk(i);
            }
        }

        const cleanupThreshold = bottomChunk + 3;
        for (const [idx] of this.chunks) {
            if (idx > cleanupThreshold) {
                this.chunks.delete(idx);
            }
        }

        this.platforms = this.platforms.filter(p => p.active);
        this.enemies = this.enemies.filter(e => e.active);
    }

    _getChunkIndex(worldY) {
        return Math.floor(worldY / CHUNK_HEIGHT);
    }

    _generateChunk(index) {
        if (this.chunks.has(index)) return;
        this.chunks.set(index, true);

        const yTop = index * CHUNK_HEIGHT;
        const yBottom = yTop + CHUNK_HEIGHT;

        if (yTop > this.startY + CHUNK_HEIGHT) return;

        const heightProgress = this.startY - yTop > 0
            ? (this.startY - yTop) / Math.max(1, this.startY - this.targetHeight)
            : 0;

        const params = this.difficulty.getParams(heightProgress);

        let y = yBottom;

        while (y > yTop) {
            const vGap = randomRange(BASE_V_GAP * 0.6, BASE_V_GAP * 0.9);
            y -= vGap;
            if (y >= this.startY) continue;

            this.stepCount++;

            // === MAIN PLATFORM: wide random walk (±PLATFORM_WIDTH) ===
            // Covers full screen over ~5-6 steps. Reachable with light booster use.
            const offset = randomRange(-PLATFORM_WIDTH, PLATFORM_WIDTH);
            let gx = clamp(this.lastPlatX + offset, X_MIN, X_MAX);

            // Push away from walls to prevent sticking
            if (gx < X_MIN + 20) gx += randomRange(25, 60);
            if (gx > X_MAX - 20) gx -= randomRange(25, 60);
            gx = clamp(gx, X_MIN, X_MAX);

            const gType = this._rollType(params, true);
            this.platforms.push(new Platform(gx, y, gType));

            // If jump is big (>half platform width), add a bridge for passive players
            const hDist = Math.abs(gx - this.lastPlatX);
            if (hDist > PLATFORM_WIDTH * 0.6) {
                // Bridge at 40% of the way from previous toward current
                const bridgeX = this.lastPlatX + (gx - this.lastPlatX) * 0.4 + randomRange(-8, 8);
                const bridgeY = y + vGap * 0.5;
                this.platforms.push(new Platform(
                    clamp(bridgeX, X_MIN, X_MAX), bridgeY, 'normal'
                ));
            }

            this.lastPlatX = gx;
        }

        this._spawnEnemies(yTop, params);
    }

    _rollType(params, isGuaranteed) {
        const r = Math.random();
        if (isGuaranteed) {
            if (r < params.jumpPadChance) return 'jumppad';
            if (r < params.jumpPadChance + params.movingPlatformChance * 0.3) return 'moving';
            return 'normal';
        }
        if (r < params.breakablePlatformChance) return 'breakable';
        if (r < params.breakablePlatformChance + params.jumpPadChance) return 'jumppad';
        if (r < params.breakablePlatformChance + params.jumpPadChance + params.movingPlatformChance) return 'moving';
        return 'normal';
    }

    _spawnEnemies(yTop, params) {
        const enemyCount = Math.random() < (params.enemiesPerChunk % 1)
            ? Math.ceil(params.enemiesPerChunk)
            : Math.floor(params.enemiesPerChunk);

        for (let i = 0; i < enemyCount; i++) {
            const ey = yTop + randomRange(50, CHUNK_HEIGHT - 50);
            const ex = randomRange(X_MIN + 10, X_MAX - 10);

            let type = 'grunt';
            const roll = Math.random();
            if (roll < params.chasingEnemyChance) {
                type = 'hunter';
            } else if (roll < params.chasingEnemyChance + params.shootingEnemyChance) {
                type = 'jackal';
            } else if (roll < 0.5) {
                type = 'elite';
            }

            const enemy = new Enemy(ex, ey, type);
            enemy.health = Math.ceil(enemy.health * params.enemyHealthMultiplier);
            this.enemies.push(enemy);
        }
    }

    isLevelComplete(playerY) {
        return playerY <= this.targetHeight;
    }
}
