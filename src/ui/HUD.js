import { COLORS, titleForLevel } from '../data/constants.js';

export class HUD {
    draw(ctx, canvasWidth, canvasHeight, player, boosterSystem, level) {
        // Health bar (Halo shield style)
        const barX = 10;
        const barY = 10;
        const barW = 120;
        const barH = 12;
        const healthPct = player.health / player.maxHealth;

        // Background
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(barX, barY, barW, barH);

        // Health fill
        const healthColor = healthPct > 0.5 ? COLORS.shield : (healthPct > 0.25 ? '#ffaa00' : '#ff3333');
        ctx.fillStyle = healthColor;
        ctx.fillRect(barX + 1, barY + 1, (barW - 2) * healthPct, barH - 2);

        // Border
        ctx.strokeStyle = '#4466aa';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barW, barH);

        // Shield recharge shimmer
        if (player.shieldRechargeTimer <= 0 && player.health < player.maxHealth) {
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = 0.2 + Math.sin(Date.now() / 100) * 0.1;
            ctx.fillRect(barX + 1, barY + 1, (barW - 2) * healthPct, barH - 2);
            ctx.globalAlpha = 1;
        }

        // Score
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`${player.score}`, canvasWidth - 10, 22);

        // Level and current job title
        ctx.textAlign = 'left';
        ctx.font = '10px monospace';
        ctx.fillStyle = '#888888';
        const jobTitle = titleForLevel(level);
        ctx.fillText(`LVL ${level}  |  ${jobTitle}`, 10, barY + barH + 14);

        // Booster charge indicator
        const chargePct = boosterSystem.getChargePercent();
        const chargeSide = boosterSystem.getChargingSide();
        if (chargeSide && chargePct > 0) {
            const indicatorX = chargeSide === 'left' ? 30 : canvasWidth / 4 + 20;
            const indicatorY = canvasHeight - 60;
            const indicatorH = 80;

            // Charge bar background
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(indicatorX - 6, indicatorY - indicatorH, 12, indicatorH);

            // Charge fill (blue to orange)
            const r = Math.floor(255 * chargePct);
            const g = Math.floor(136 * chargePct + 100 * (1 - chargePct));
            const b = Math.floor(0 * chargePct + 255 * (1 - chargePct));
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fillRect(indicatorX - 5, indicatorY - indicatorH * chargePct, 10, indicatorH * chargePct);

            // Border
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.strokeRect(indicatorX - 6, indicatorY - indicatorH, 12, indicatorH);
        }

        ctx.textAlign = 'left';
    }
}
