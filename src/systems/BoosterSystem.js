import {
    BOOSTER_MAX_CHARGE, BOOSTER_MIN_IMPULSE_X,
    BOOSTER_MAX_IMPULSE_X, BOOSTER_VERTICAL_BOOST,
} from '../data/constants.js';
import { clamp, lerp } from '../utils/math.js';
import { SFX } from '../data/sounds.js';

export class BoosterSystem {
    constructor(inputManager) {
        this.input = inputManager;
        this.chargePercent = 0;
        this.chargingSide = null;

        inputManager.on('booster-start', ({ side }) => {
            this.chargingSide = side;
        });

        inputManager.on('booster-release', ({ side, chargeTime }) => {
            this.lastRelease = { side, chargeTime };
            this.chargingSide = null;
            this.chargePercent = 0;
        });

        this.lastRelease = null;
    }

    update(dt) {
        if (this.chargingSide) {
            const elapsed = this.input.getBoosterChargeTime();
            this.chargePercent = clamp(elapsed / BOOSTER_MAX_CHARGE, 0, 1);
        }
    }

    consumeRelease(player) {
        if (!this.lastRelease) return false;

        const { side, chargeTime } = this.lastRelease;
        this.lastRelease = null;

        const pct = clamp(chargeTime / BOOSTER_MAX_CHARGE, 0, 1);
        const magnitude = lerp(BOOSTER_MIN_IMPULSE_X, BOOSTER_MAX_IMPULSE_X, pct);

        // Left press -> go right, Right press -> go left
        const vx = side === 'left' ? magnitude : -magnitude;
        const vy = BOOSTER_VERTICAL_BOOST * pct;

        player.vx += vx;
        player.vy += vy;
        SFX.boostRelease();

        return true;
    }

    getChargePercent() {
        return this.chargePercent;
    }

    getChargingSide() {
        return this.chargingSide;
    }
}
