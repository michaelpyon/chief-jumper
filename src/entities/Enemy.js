import { Entity } from './Entity.js';
import { ENEMY_CONFIGS, COLORS, GAME_WIDTH } from '../data/constants.js';
import { Projectile } from './Projectile.js';
import { getSprite } from '../core/AssetLoader.js';

export class Enemy extends Entity {
    constructor(x, y, type = 'grunt') {
        const config = ENEMY_CONFIGS[type];
        super(x, y, config.width, config.height);
        this.type = type;
        this.health = config.health;
        this.damage = config.damage;
        this.speed = config.speed;
        this.pattern = config.pattern;
        this.dropRate = config.dropRate;
        this.shootInterval = config.shootInterval || 2.0;
        this.shootTimer = this.shootInterval;

        // Patrol bounds
        this.originX = x;
        this.patrolRange = 60;
        this.direction = 1;

        // Animation
        this.frameTimer = 0;
        this.frameIndex = 0;
    }

    update(dt, playerX, playerY, projectiles) {
        this.frameTimer += dt;
        if (this.frameTimer > 0.3) {
            this.frameIndex = (this.frameIndex + 1) % 2;
            this.frameTimer = 0;
        }

        switch (this.pattern) {
            case 'horizontal':
                this.x += this.speed * this.direction * dt;
                if (this.x < this.originX - this.patrolRange || this.x > this.originX + this.patrolRange) {
                    this.direction *= -1;
                }
                break;

            case 'shooting':
                this.shootTimer -= dt;
                if (this.shootTimer <= 0 && projectiles) {
                    const angle = Math.atan2(playerY - this.y, playerX - this.x);
                    const bullet = new Projectile(
                        this.x, this.y,
                        Math.cos(angle) * 200,
                        Math.sin(angle) * 200,
                        'enemy', this.damage
                    );
                    projectiles.push(bullet);
                    this.shootTimer = this.shootInterval;
                }
                break;

            case 'chasing':
                if (playerX !== undefined && playerY !== undefined) {
                    const dx = playerX - this.x;
                    const dy = playerY - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist > 0 && dist < 300) {
                        this.x += (dx / dist) * this.speed * dt;
                        this.y += (dy / dist) * this.speed * dt;
                    }
                }
                break;

            // 'stationary' - do nothing
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.active = false;
            return true; // died
        }
        return false;
    }

    shouldDropOrb() {
        return Math.random() < this.dropRate;
    }

    draw(ctx, camera) {
        const sx = this.x - this.width / 2;
        const sy = camera.worldToScreenY(this.y) - this.height / 2;

        const sprite = getSprite(this.type, false);
        if (sprite) {
            const drawX = Math.floor(this.x - sprite.width / 2);
            const drawY = Math.floor(sy);
            ctx.drawImage(sprite, drawX, drawY, sprite.width, sprite.height);
        } else {
            // Fallback colored rect
            const color = COLORS[this.type] || COLORS.grunt;
            ctx.fillStyle = color;
            ctx.fillRect(Math.floor(sx), Math.floor(sy), this.width, this.height);
        }

        // Health indicator for multi-hit enemies
        if (ENEMY_CONFIGS[this.type].health > 1) {
            const maxHealth = ENEMY_CONFIGS[this.type].health;
            const barWidth = this.width;
            const filled = (this.health / maxHealth) * barWidth;
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(Math.floor(sx), Math.floor(sy - 5), barWidth, 3);
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(Math.floor(sx), Math.floor(sy - 5), Math.floor(filled), 3);
        }
    }
}
