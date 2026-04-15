import { MAX_PARTICLES } from '../data/constants.js';
import { randomRange } from '../utils/math.js';

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.life = 0;
        this.maxLife = 0;
        this.color = '#ffffff';
        this.size = 2;
        this.active = false;
    }
}

export class ParticleSystem {
    constructor() {
        this.pool = [];
        for (let i = 0; i < MAX_PARTICLES; i++) {
            this.pool.push(new Particle());
        }
    }

    emit(config) {
        const { x, y, count = 5, color = '#ffffff', speed = 100, lifetime = 0.5, spread = Math.PI * 2, angle = 0, size = 2, gravity = 0 } = config;

        for (let i = 0; i < count; i++) {
            const p = this._getInactive();
            if (!p) break;

            const dir = angle + randomRange(-spread / 2, spread / 2);
            const spd = speed * randomRange(0.5, 1.5);

            p.x = x + randomRange(-3, 3);
            p.y = y + randomRange(-3, 3);
            p.vx = Math.cos(dir) * spd;
            p.vy = Math.sin(dir) * spd;
            p.life = lifetime * randomRange(0.7, 1.3);
            p.maxLife = p.life;
            p.color = color;
            p.size = size;
            p.gravity = gravity;
            p.active = true;
        }
    }

    update(dt) {
        for (const p of this.pool) {
            if (!p.active) continue;

            p.life -= dt;
            if (p.life <= 0) {
                p.active = false;
                continue;
            }

            p.vy += (p.gravity || 0) * dt;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
        }
    }

    draw(ctx, camera) {
        for (const p of this.pool) {
            if (!p.active) continue;

            const sy = camera.worldToScreenY(p.y);
            const alpha = p.life / p.maxLife;

            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            ctx.fillRect(
                Math.floor(p.x - p.size / 2),
                Math.floor(sy - p.size / 2),
                p.size, p.size
            );
        }
        ctx.globalAlpha = 1;
    }

    _getInactive() {
        for (const p of this.pool) {
            if (!p.active) return p;
        }
        return null;
    }
}
