import { COLORS } from '../data/constants.js';

export class BoosterOverlay {
    draw(ctx, canvasWidth, canvasHeight, boosterSystem) {
        const chargePct = boosterSystem.getChargePercent();
        const side = boosterSystem.getChargingSide();
        if (!side || chargePct <= 0) return;

        const halfW = canvasWidth / 2;
        const quarterW = halfW / 2;

        // Zone highlight
        const zoneX = side === 'left' ? 0 : quarterW;
        ctx.fillStyle = COLORS.boostCharge;
        ctx.globalAlpha = 0.05 + chargePct * 0.1;
        ctx.fillRect(zoneX, 0, quarterW, canvasHeight);

        // Charge ring in zone center
        const cx = zoneX + quarterW / 2;
        const cy = canvasHeight / 2;
        const maxRadius = 40;
        const radius = maxRadius * chargePct;

        ctx.globalAlpha = 0.3 + chargePct * 0.4;
        ctx.strokeStyle = COLORS.boostCharge;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2 * chargePct);
        ctx.stroke();

        // Direction arrow
        ctx.globalAlpha = chargePct * 0.6;
        ctx.fillStyle = '#ffffff';
        const arrowDir = side === 'left' ? 1 : -1; // left press -> right arrow
        const arrowX = cx + arrowDir * 20;
        ctx.beginPath();
        ctx.moveTo(arrowX + arrowDir * 12, cy);
        ctx.lineTo(arrowX - arrowDir * 4, cy - 8);
        ctx.lineTo(arrowX - arrowDir * 4, cy + 8);
        ctx.closePath();
        ctx.fill();

        ctx.globalAlpha = 1;
    }
}
