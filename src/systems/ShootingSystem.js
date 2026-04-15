import { Projectile } from '../entities/Projectile.js';
import { FIRE_RATE, BULLET_SPEED, BULLET_DAMAGE } from '../data/constants.js';
import { SFX } from '../data/sounds.js';

export class ShootingSystem {
    constructor(inputManager) {
        this.input = inputManager;
        this.cooldown = 0;
    }

    update(dt, player, projectiles) {
        this.cooldown -= dt;

        const joy = this.input.joystick;
        if (!joy.active || joy.magnitude < 0.1) return;

        if (this.cooldown <= 0) {
            const vx = Math.cos(joy.angle) * BULLET_SPEED;
            const vy = Math.sin(joy.angle) * BULLET_SPEED;

            const bullet = new Projectile(
                player.x, player.y,
                vx, vy,
                'player', BULLET_DAMAGE
            );
            projectiles.push(bullet);

            this.cooldown = FIRE_RATE;
            SFX.shoot();

            // Update player facing
            if (vx > 0) player.facing = 'right';
            else if (vx < 0) player.facing = 'left';
        }
    }
}
