import { CAMERA_LERP_SPEED, DEATH_BUFFER } from '../data/constants.js';
import { lerp } from '../utils/math.js';

export class Camera {
    constructor(canvasHeight) {
        this.y = 0;             // World Y of top of viewport
        this.canvasHeight = canvasHeight;
        this.targetY = 0;
    }

    reset(playerY) {
        // Position camera so player is in lower third
        this.y = playerY - this.canvasHeight * 0.65;
        this.targetY = this.y;
    }

    update(playerY, dt) {
        // Target: player in the lower 60% of screen (more room above to see platforms)
        const desiredY = playerY - this.canvasHeight * 0.6;

        // Only move camera up, never down
        if (desiredY < this.targetY) {
            this.targetY = desiredY;
        }

        // Fast lerp so camera keeps up with bouncing player
        this.y = lerp(this.y, this.targetY, CAMERA_LERP_SPEED * 2 * dt);
    }

    worldToScreenY(worldY) {
        return worldY - this.y;
    }

    screenToWorldY(screenY) {
        return screenY + this.y;
    }

    isOnScreen(worldY, height) {
        const screenY = this.worldToScreenY(worldY);
        return screenY + height / 2 > -50 && screenY - height / 2 < this.canvasHeight + 50;
    }

    getDeathLineY() {
        return this.y + this.canvasHeight + DEATH_BUFFER;
    }
}
