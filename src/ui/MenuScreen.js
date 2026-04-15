import { COLORS } from '../data/constants.js';

export class MenuScreen {
    constructor() {
        this.pulseTimer = 0;
    }

    update(dt) {
        this.pulseTimer += dt;
    }

    draw(ctx, canvasWidth, canvasHeight) {
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

        // Title
        ctx.fillStyle = COLORS.player;
        ctx.font = 'bold 28px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('CHIEF', canvasWidth / 2, canvasHeight / 2 - 40);
        ctx.fillStyle = COLORS.playerVisor;
        ctx.fillText('JUMPER', canvasWidth / 2, canvasHeight / 2 - 8);

        // Subtitle
        ctx.fillStyle = '#888888';
        ctx.font = '10px monospace';
        ctx.fillText('A Spartan Roguelike', canvasWidth / 2, canvasHeight / 2 + 16);

        // Tap prompt
        const alpha = 0.4 + Math.sin(this.pulseTimer * 3) * 0.4;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px monospace';
        ctx.fillText('TAP TO START', canvasWidth / 2, canvasHeight / 2 + 80);
        ctx.globalAlpha = 1;

        // Controls hint
        ctx.fillStyle = '#555555';
        ctx.font = '9px monospace';
        ctx.fillText('LEFT: Boosters  |  RIGHT: Aim & Shoot', canvasWidth / 2, canvasHeight - 40);

        ctx.textAlign = 'left';
    }
}
