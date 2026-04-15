import { BOUNCE_VELOCITY } from '../data/constants.js';
import { SFX } from '../data/sounds.js';

export class CollisionSystem {
    constructor() {
        this.platformTolerance = 15;
    }

    update(player, platforms, enemies, projectiles, orbs, onEnemyKilled) {
        // Player vs Platforms
        this._playerVsPlatforms(player, platforms);

        // Player projectiles vs Enemies
        this._projectilesVsEnemies(projectiles, enemies, onEnemyKilled);

        // Player vs Enemies (contact damage)
        this._playerVsEnemies(player, enemies);

        // Enemy projectiles vs Player
        this._projectilesVsPlayer(projectiles, player);
    }

    _playerVsPlatforms(player, platforms) {
        // Only check when falling
        if (player.vy <= 0) return;

        const playerBottom = player.bottom;
        let bestPlat = null;
        let bestTop = Infinity;

        for (const plat of platforms) {
            if (!plat.active || plat.broken) continue;

            const platTop = plat.top;

            // Check horizontal overlap
            if (player.right < plat.left || player.left > plat.right) continue;

            // Check vertical: player bottom near platform top, moving down
            if (playerBottom >= platTop && playerBottom <= platTop + this.platformTolerance + player.vy * (1/60)) {
                // Pick the highest (smallest y) matching platform
                if (platTop < bestTop) {
                    bestTop = platTop;
                    bestPlat = plat;
                }
            }
        }

        if (bestPlat) {
            player.y = bestTop - player.height / 2;

            // Small nudge toward platform center to prevent long-term drift
            const drift = bestPlat.x - player.x;
            player.x += drift * 0.3;

            bestPlat.onPlayerLand(player);
        }
    }

    _projectilesVsEnemies(projectiles, enemies, onEnemyKilled) {
        for (const bullet of projectiles) {
            if (!bullet.active || bullet.owner !== 'player') continue;

            for (const enemy of enemies) {
                if (!enemy.active) continue;

                if (bullet.overlaps(enemy)) {
                    bullet.destroy();
                    const killed = enemy.takeDamage(bullet.damage);
                    if (killed && onEnemyKilled) {
                        onEnemyKilled(enemy);
                    } else if (!killed) {
                        SFX.enemyHit();
                    }
                    break;
                }
            }
        }
    }

    _playerVsEnemies(player, enemies) {
        for (const enemy of enemies) {
            if (!enemy.active) continue;

            if (player.overlaps(enemy)) {
                player.takeDamage(enemy.damage);
                SFX.playerHit();
                // Knock player away
                const dx = player.x - enemy.x;
                player.vx += dx > 0 ? 150 : -150;
                player.vy = Math.min(player.vy, -200);
                break;
            }
        }
    }

    _projectilesVsPlayer(projectiles, player) {
        for (const bullet of projectiles) {
            if (!bullet.active || bullet.owner !== 'enemy') continue;

            if (bullet.overlaps(player)) {
                player.takeDamage(bullet.damage);
                bullet.destroy();
                SFX.playerHit();
            }
        }
    }
}
