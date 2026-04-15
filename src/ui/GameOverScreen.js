import { COLORS } from '../data/constants.js';

export class GameOverScreen {
    constructor() {
        this.pulseTimer = 0;
    }

    update(dt) {
        this.pulseTimer += dt;
    }

    draw(ctx, canvasWidth, canvasHeight, score, level) {
        // Dark overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Game Over text
        ctx.fillStyle = '#ff3333';
        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvasWidth / 2, canvasHeight / 2 - 50);

        // Score
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px monospace';
        ctx.fillText(`Score: ${score}`, canvasWidth / 2, canvasHeight / 2 - 10);

        // Level reached
        ctx.fillStyle = '#888888';
        ctx.font = '12px monospace';
        ctx.fillText(`Level ${level}`, canvasWidth / 2, canvasHeight / 2 + 15);

        // Restart prompt
        const alpha = 0.4 + Math.sin(this.pulseTimer * 3) * 0.4;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px monospace';
        ctx.fillText('TAP TO RESTART', canvasWidth / 2, canvasHeight / 2 + 70);
        ctx.globalAlpha = 1;

        ctx.textAlign = 'left';
    }
}
