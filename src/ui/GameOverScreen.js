import { titleForLevel } from '../data/constants.js';

export class GameOverScreen {
    constructor() {
        this.pulseTimer = 0;
    }

    update(dt) {
        this.pulseTimer += dt;
    }

    // personalBest: { score, title } or null
    // isNewBest: bool - true when this run beat the stored record
    draw(ctx, canvasWidth, canvasHeight, score, level, personalBest, isNewBest) {
        // Dark overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        const cx = canvasWidth / 2;
        const mid = canvasHeight / 2;

        // "LAID OFF" header
        ctx.fillStyle = '#ff3333';
        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('LAID OFF', cx, mid - 60);

        // Job title reached
        const title = titleForLevel(level);
        ctx.fillStyle = '#ffcc44';
        ctx.font = 'bold 14px monospace';
        ctx.fillText(title.toUpperCase(), cx, mid - 32);

        // Score
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px monospace';
        ctx.fillText(`Score: ${score.toLocaleString()}`, cx, mid + 4);

        // Level reached
        ctx.fillStyle = '#888888';
        ctx.font = '12px monospace';
        ctx.fillText(`Level ${level}`, cx, mid + 24);

        // NEW BEST flourish (pulsing gold banner)
        if (isNewBest) {
            const pulse = 0.7 + Math.sin(this.pulseTimer * 6) * 0.3;
            ctx.globalAlpha = pulse;
            ctx.fillStyle = '#ffcc00';
            ctx.font = 'bold 13px monospace';
            ctx.fillText('NEW BEST!', cx, mid + 46);
            ctx.globalAlpha = 1;
        } else if (personalBest) {
            // Show previous best for context
            ctx.fillStyle = '#555566';
            ctx.font = '11px monospace';
            ctx.fillText(`Best: ${personalBest.score.toLocaleString()} as ${personalBest.title}`, cx, mid + 46);
        }

        // Restart prompt
        const alpha = 0.4 + Math.sin(this.pulseTimer * 3) * 0.4;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px monospace';
        const isTouchDevice = typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0;
        ctx.fillText(isTouchDevice ? 'TAP TO RESTART' : 'CLICK / ENTER TO RESTART', cx, mid + 74);
        ctx.globalAlpha = 1;

        ctx.fillStyle = '#6db3ff';
        ctx.font = '9px monospace';
        ctx.fillText('chief-jumper.vercel.app', cx, Math.min(mid + 102, canvasHeight - 12));

        ctx.textAlign = 'left';
    }
}
