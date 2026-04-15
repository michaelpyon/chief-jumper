import { Entity } from './Entity.js';
import {
    PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_MAX_HEALTH,
    GRAVITY, MAX_FALL_SPEED, HORIZONTAL_FRICTION,
    PLAYER_INVULN_TIME, SHIELD_RECHARGE_DELAY, SHIELD_RECHARGE_RATE,
    COLORS, GAME_WIDTH,
} from '../data/constants.js';
import { getSprite } from '../core/AssetLoader.js';

export class Player extends Entity {
    constructor(x, y) {
        super(x, y, PLAYER_WIDTH, PLAYER_HEIGHT);
        this.health = PLAYER_MAX_HEALTH;
        this.maxHealth = PLAYER_MAX_HEALTH;
        this.score = 0;
        this.facing = 'right';
        this.invulnTimer = 0;
        this.shieldRechargeTimer = 0;
        this.highestY = y;
    }

    update(dt) {
        // Gravity
        this.vy += GRAVITY * dt;
        if (this.vy > MAX_FALL_SPEED) this.vy = MAX_FALL_SPEED;

        // Integrate velocity
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        // Horizontal friction (frame-rate independent)
        this.vx *= Math.pow(HORIZONTAL_FRICTION, dt * 60);

        // Small velocity threshold - stop jittering
        if (Math.abs(this.vx) < 1) this.vx = 0;

        // Screen wrapping (horizontal)
        if (this.x < -this.width / 2) this.x = GAME_WIDTH + this.width / 2;
        if (this.x > GAME_WIDTH + this.width / 2) this.x = -this.width / 2;

        // Track highest point
        if (this.y < this.highestY) {
            this.score += Math.floor(this.highestY - this.y);
            this.highestY = this.y;
        }

        // Invulnerability timer
        if (this.invulnTimer > 0) {
            this.invulnTimer -= dt;
        }

        // Shield recharge
        if (this.shieldRechargeTimer > 0) {
            this.shieldRechargeTimer -= dt;
        } else if (this.health < this.maxHealth) {
            this.health = Math.min(this.maxHealth, this.health + SHIELD_RECHARGE_RATE * dt);
        }

        // Update facing based on velocity
        if (this.vx > 30) this.facing = 'right';
        else if (this.vx < -30) this.facing = 'left';
    }

    takeDamage(amount) {
        if (this.invulnTimer > 0) return;
        this.health -= amount;
        this.invulnTimer = PLAYER_INVULN_TIME;
        this.shieldRechargeTimer = SHIELD_RECHARGE_DELAY;
        if (this.health <= 0) {
            this.health = 0;
        }
    }

    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }

    get isDead() {
        return this.health <= 0;
    }

    draw(ctx, camera) {
        const sy = camera.worldToScreenY(this.y) - this.height / 2;

        // Flicker when invulnerable
        if (this.invulnTimer > 0 && Math.floor(this.invulnTimer * 10) % 2 === 0) {
            return;
        }

        const flipped = this.facing === 'left';
        const sprite = getSprite('spartan', flipped);

        // Squash/stretch based on vertical velocity
        const vyNorm = Math.min(Math.abs(this.vy) / 600, 1);
        const scaleX = 1 + (this.vy > 0 ? vyNorm * 0.1 : -vyNorm * 0.08);
        const scaleY = 1 + (this.vy > 0 ? -vyNorm * 0.1 : vyNorm * 0.08);

        if (sprite) {
            const sw = sprite.width * scaleX;
            const sh = sprite.height * scaleY;
            const sx = Math.floor(this.x - sw / 2);
            const syf = Math.floor(sy + sprite.height * (1 - scaleY));
            ctx.drawImage(sprite, sx, syf, Math.floor(sw), Math.floor(sh));
        } else {
            const sx = this.x - this.width / 2;
            ctx.fillStyle = COLORS.player;
            ctx.fillRect(Math.floor(sx), Math.floor(sy), this.width, this.height);
        }

        // Shield glow when recharging
        if (this.shieldRechargeTimer <= 0 && this.health < this.maxHealth) {
            const sx = this.x - this.width / 2;
            ctx.strokeStyle = COLORS.shield;
            ctx.globalAlpha = 0.3 + Math.sin(Date.now() / 200) * 0.2;
            ctx.lineWidth = 2;
            ctx.strokeRect(Math.floor(sx - 2), Math.floor(sy - 2), this.width + 4, this.height + 4);
            ctx.globalAlpha = 1;
        }
    }
}
