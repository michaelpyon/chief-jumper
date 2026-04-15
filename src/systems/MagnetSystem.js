import { MAGNET_RADIUS, MAGNET_ACCEL, PICKUP_RADIUS } from '../data/constants.js';
import { SFX } from '../data/sounds.js';

export class MagnetSystem {
    update(dt, player, orbs) {
        for (let i = orbs.length - 1; i >= 0; i--) {
            const orb = orbs[i];
            if (!orb.active) continue;

            const dx = player.x - orb.x;
            const dy = player.y - orb.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < PICKUP_RADIUS) {
                // Collect
                player.heal(orb.healAmount);
                orb.destroy();
                SFX.orbPickup();
                continue;
            }

            if (dist < MAGNET_RADIUS) {
                // Attract with quadratic curve (stronger when closer)
                const nx = dx / dist;
                const ny = dy / dist;
                const t = 1 - (dist / MAGNET_RADIUS);
                const accel = MAGNET_ACCEL * t * t;

                orb.vx += nx * accel * dt;
                orb.vy += ny * accel * dt;
            }
        }
    }
}
