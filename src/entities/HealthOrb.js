import { Entity } from './Entity.js';
import { ORB_HEAL_AMOUNT, ORB_SIZE, ORB_LIFETIME, COLORS } from '../data/constants.js';

export class HealthOrb extends Entity {
    constructor(x, y) {
        super(x, y, ORB_SIZE, ORB_SIZE);
        this.healAmount = ORB_HEAL_AMOUNT;
        this.lifetime = ORB_LIFETIME;
        this.vy = -30; // Gentle upward float
        this.pulseTimer = Math.random() * Math.PI * 2;
    }

    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.lifetime -= dt;
        this.pulseTimer += dt * 4;

        if (this.lifetime <= 0) this.active = false;

        // Slow down drift over time
        this.vy *= 0.99;
    }

    draw(ctx, camera) {
        const sx = this.x;
        const sy = camera.worldToScreenY(this.y);
        const pulse = 1 + Math.sin(this.pulseTimer) * 0.2;
        const r = (this.width / 2) * pulse;

        // Fade out near end of lifetime
        if (this.lifetime < 2) {
            ctx.globalAlpha = this.lifetime / 2;
        }

        // Glow
        ctx.fillStyle = COLORS.healthOrb;
        ctx.globalAlpha *= 0.3;
        ctx.beginPath();
        ctx.arc(Math.floor(sx), Math.floor(sy), r + 4, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.globalAlpha = this.lifetime < 2 ? this.lifetime / 2 : 1;
        ctx.fillStyle = COLORS.healthOrb;
        ctx.beginPath();
        ctx.arc(Math.floor(sx), Math.floor(sy), r, 0, Math.PI * 2);
        ctx.fill();

        // Bright center
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(Math.floor(sx), Math.floor(sy), r * 0.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;
    }
}
