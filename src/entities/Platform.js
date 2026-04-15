import { Entity } from './Entity.js';
import {
    PLATFORM_WIDTH, PLATFORM_HEIGHT, PLATFORM_MOVE_SPEED,
    BOUNCE_VELOCITY, JUMPPAD_VELOCITY, COLORS,
} from '../data/constants.js';
import { SFX } from '../data/sounds.js';

export class Platform extends Entity {
    constructor(x, y, type = 'normal') {
        super(x, y, PLATFORM_WIDTH, PLATFORM_HEIGHT);
        this.type = type;
        this.broken = false;
        this.breakTimer = 0;

        // Moving platform properties
        this.originX = x;
        this.moveRange = 80;
        this.moveSpeed = PLATFORM_MOVE_SPEED;
        this.moveTimer = Math.random() * Math.PI * 2; // Random phase
    }

    get bounceVelocity() {
        if (this.type === 'jumppad') return JUMPPAD_VELOCITY;
        return BOUNCE_VELOCITY;
    }

    update(dt) {
        if (this.type === 'moving') {
            this.moveTimer += this.moveSpeed * dt * 0.05;
            this.x = this.originX + Math.sin(this.moveTimer) * this.moveRange;
        }

        if (this.broken) {
            this.breakTimer += dt;
            this.y += 200 * dt; // Fall away
            if (this.breakTimer > 0.5) this.active = false;
        }
    }

    onPlayerLand(player) {
        if (this.type === 'breakable' && !this.broken) {
            this.broken = true;
            SFX.breakPlatform();
        }
        // Sticky platforms don't bounce
        if (this.type === 'sticky') {
            player.vy = 0;
            return;
        }
        player.vy = this.bounceVelocity;

        if (this.type === 'jumppad') {
            SFX.jumpPad();
        } else {
            SFX.bounce();
        }
    }

    draw(ctx, camera) {
        const sx = this.x - this.width / 2;
        const sy = camera.worldToScreenY(this.y) - this.height / 2;

        if (this.broken) {
            ctx.globalAlpha = 1 - this.breakTimer * 2;
        }

        const x = Math.floor(sx);
        const y = Math.floor(sy);
        const w = this.width;
        const h = this.height;

        switch (this.type) {
            case 'jumppad':
                // Forerunner energy pad
                ctx.fillStyle = '#0088aa';
                ctx.fillRect(x, y, w, h);
                ctx.fillStyle = COLORS.jumpPad;
                ctx.fillRect(x + 2, y + 1, w - 4, h - 2);
                // Animated glow core
                ctx.fillStyle = '#ffffff';
                ctx.globalAlpha = 0.5 + Math.sin(Date.now() / 150) * 0.3;
                ctx.fillRect(x + 4, y + 3, w - 8, h - 6);
                // Energy lines
                ctx.fillStyle = '#aaeeff';
                for (let i = 0; i < 3; i++) {
                    const lx = x + 8 + i * Math.floor((w - 16) / 2);
                    ctx.fillRect(lx, y + 1, 2, h - 2);
                }
                ctx.globalAlpha = 1;
                break;

            case 'breakable':
                // Cracked stone/wood
                ctx.fillStyle = '#8b6914';
                ctx.fillRect(x, y, w, h);
                ctx.fillStyle = '#a07818';
                ctx.fillRect(x, y, w, 2);
                // Cracks
                ctx.fillStyle = '#5a4510';
                ctx.fillRect(x + 15, y + 2, 2, h - 2);
                ctx.fillRect(x + 16, y + 4, 2, h - 4);
                ctx.fillRect(x + 40, y + 1, 2, h - 2);
                ctx.fillRect(x + 39, y + 3, 2, h - 3);
                ctx.fillRect(x + 28, y + 2, 1, h - 3);
                break;

            case 'moving':
                // Metal platform with glowing thrusters
                ctx.fillStyle = '#364e30';
                ctx.fillRect(x, y, w, h);
                ctx.fillStyle = COLORS.platformEdge;
                ctx.fillRect(x + 1, y, w - 2, h - 2);
                ctx.fillStyle = COLORS.platRivet || '#8aaf7e';
                ctx.fillRect(x, y, w, 2);
                // Thruster glow
                ctx.fillStyle = '#88bbff';
                ctx.fillRect(x + 2, y + 3, 4, h - 5);
                ctx.fillRect(x + w - 6, y + 3, 4, h - 5);
                break;

            default: // normal - Forerunner metal
                ctx.fillStyle = '#364e30';
                ctx.fillRect(x, y, w, h);
                ctx.fillStyle = COLORS.platform;
                ctx.fillRect(x + 1, y + 2, w - 2, h - 2);
                // Top highlight
                ctx.fillStyle = COLORS.platformEdge;
                ctx.fillRect(x, y, w, 3);
                // Rivet details
                ctx.fillStyle = '#8aaf7e';
                ctx.fillRect(x + 4, y + 4, 2, 2);
                ctx.fillRect(x + w - 6, y + 4, 2, 2);
                break;
        }

        if (this.broken) {
            ctx.globalAlpha = 1;
        }
    }
}
