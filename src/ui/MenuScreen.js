import { COLORS } from '../data/constants.js';

export class MenuScreen {
    constructor() {
        this.pulseTimer = 0;
    }

    update(dt) {
        this.pulseTimer += dt;
    }

    // personalBest: { score, title } or null
    draw(ctx, canvasWidth, canvasHeight, personalBest) {
        // Background
        ctx.fillStyle = COLORS.bg;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Stars
        const starSeed = 42;
        for (let i = 0; i < 60; i++) {
            const sx = ((starSeed * (i + 1) * 7) % canvasWidth);
            const sy = ((starSeed * (i + 1) * 13) % canvasHeight);
            const brightness = 0.3 + (Math.sin(this.pulseTimer * 2 + i) * 0.3);
            ctx.globalAlpha = brightness;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(Math.floor(sx), Math.floor(sy), 2, 2);
        }
        ctx.globalAlpha = 1;

        const cx = canvasWidth / 2;
        const mid = canvasHeight / 2;

        // Title
        ctx.fillStyle = COLORS.player;
        ctx.font = 'bold 28px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('CHIEF', cx, mid - 40);
        ctx.fillStyle = COLORS.playerVisor;
        ctx.fillText('JUMPER', cx, mid - 8);

        // Subtitle
        ctx.fillStyle = '#888888';
        ctx.font = '10px monospace';
        ctx.fillText('Climb the Corporate Ladder', cx, mid + 16);

        // Personal best (shown between subtitle and tap prompt)
        if (personalBest) {
            ctx.fillStyle = '#ffcc44';
            ctx.font = '11px monospace';
            ctx.fillText(
                `Your best: ${personalBest.score.toLocaleString()} as ${personalBest.title}`,
                cx,
                mid + 38
            );
        }

        // Tap prompt
        const alpha = 0.4 + Math.sin(this.pulseTimer * 3) * 0.4;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px monospace';
        ctx.fillText('TAP TO START', cx, mid + 80);
        ctx.globalAlpha = 1;

        // Controls hint
        ctx.fillStyle = '#555555';
        ctx.font = '9px monospace';
        ctx.fillText('LEFT: Boosters  |  RIGHT: Aim & Shoot', cx, canvasHeight - 40);

        ctx.textAlign = 'left';
    }
}
