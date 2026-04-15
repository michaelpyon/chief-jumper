import { Entity } from './Entity.js';
import { BULLET_SIZE, COLORS } from '../data/constants.js';

export class Projectile extends Entity {
    constructor(x, y, vx, vy, owner = 'player', damage = 1) {
        super(x, y, BULLET_SIZE, BULLET_SIZE);
        this.vx = vx;
        this.vy = vy;
        this.owner = owner;
        this.damage = damage;
        this.lifetime = 2.0;
    }

    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.lifetime -= dt;
        if (this.lifetime <= 0) this.active = false;
    }

    draw(ctx, camera) {
        const sx = this.x - this.width / 2;
        const sy = camera.worldToScreenY(this.y) - this.height / 2;

        ctx.fillStyle = this.owner === 'player' ? COLORS.bullet : COLORS.enemyBullet;
        ctx.fillRect(Math.floor(sx), Math.floor(sy), this.width, this.height);

        // Glow effect
        ctx.globalAlpha = 0.3;
        ctx.fillRect(Math.floor(sx - 1), Math.floor(sy - 1), this.width + 2, this.height + 2);
        ctx.globalAlpha = 1;
    }
}
