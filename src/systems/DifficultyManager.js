import { LEVEL_BASE_HEIGHT, LEVEL_HEIGHT_INCREMENT } from '../data/constants.js';
import { lerp, clamp } from '../utils/math.js';

export class DifficultyManager {
    constructor() {
        this.level = 1;
    }

    setLevel(n) {
        this.level = n;
    }

    getLevelTargetHeight(level) {
        return LEVEL_BASE_HEIGHT + (level - 1) * LEVEL_HEIGHT_INCREMENT;
    }

    getParams(heightInLevel) {
        const l = this.level;
        const heightPct = clamp(heightInLevel, 0, 1); // 0 = bottom, 1 = top of level

        // Base values scale with level, heightPct adds within-level ramp
        const levelFactor = clamp((l - 1) / 6, 0, 1); // 0 at level 1, 1 at level 7+
        const ramp = levelFactor + heightPct * 0.2;

        return {
            platformsPerChunk: Math.max(3, Math.floor(lerp(7, 3, ramp))),
            movingPlatformChance: lerp(0.05, 0.4, ramp),
            breakablePlatformChance: lerp(0.02, 0.2, ramp),
            jumpPadChance: lerp(0.08, 0.15, clamp(ramp, 0, 1)),
            enemiesPerChunk: Math.floor(lerp(0.5, 4, ramp)),
            shootingEnemyChance: lerp(0, 0.4, ramp),
            chasingEnemyChance: l >= 4 ? lerp(0, 0.2, ramp) : 0,
            enemyHealthMultiplier: lerp(1, 2, levelFactor),
        };
    }
}
