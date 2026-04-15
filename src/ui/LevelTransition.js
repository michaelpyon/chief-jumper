import { COLORS, GAME_WIDTH } from '../data/constants.js';

export class LevelTransition {
    constructor() {
        this.phase = 'idle'; // 'shipArrival', 'boarding', 'takeoff', 'flight', 'done'
        this.timer = 0;
        this.shipY = 0;
        this.shipTargetY = 0;
        this.level = 1;
        this.stars = [];

        // Generate random stars for flight scene
        for (let i = 0; i < 80; i++) {
            this.stars.push({
                x: Math.random() * GAME_WIDTH,
                y: Math.random() * 800,
                speed: 50 + Math.random() * 200,
                size: 1 + Math.random() * 2,
            });
        }
    }

    start(level, playerY, canvasHeight) {
        this.phase = 'shipArrival';
        this.timer = 0;
        this.level = level;
        this.shipTargetY = canvasHeight / 2;
        this.shipY = -60;
        this.playerScreenY = canvasHeight * 0.6;
    }

    update(dt) {
        this.timer += dt;

        switch (this.phase) {
            case 'shipArrival':
                this.shipY += (this.shipTargetY - this.shipY) * 2 * dt;
                if (this.timer > 1.5) {
                    this.phase = 'boarding';
                    this.timer = 0;
                }
                break;

            case 'boarding':
                if (this.timer > 0.8) {
                    this.phase = 'takeoff';
                    this.timer = 0;
                }
                break;

            case 'takeoff':
                this.shipY -= 300 * dt;
                if (this.timer > 1.5) {
                    this.phase = 'flight';
                    this.timer = 0;
                }
                break;

            case 'flight':
                if (this.timer > 2.0) {
                    this.phase = 'done';
                }
                break;
        }
    }

    isDone() {
        return this.phase === 'done';
    }

    draw(ctx, canvasWidth, canvasHeight) {
        if (this.phase === 'flight') {
            // Star field
            ctx.fillStyle = '#000011';
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            for (const star of this.stars) {
                star.y += star.speed * (1 / 60);
                if (star.y > canvasHeight) {
                    star.y = 0;
                    star.x = Math.random() * canvasWidth;
                }
                ctx.fillStyle = '#ffffff';
                ctx.globalAlpha = 0.3 + Math.random() * 0.7;
                ctx.fillRect(Math.floor(star.x), Math.floor(star.y), star.size, star.size);
            }
            ctx.globalAlpha = 1;

            // Small ship
            this._drawShip(ctx, canvasWidth / 2, canvasHeight / 2, 0.6);

            // Level text
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 18px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`LEVEL ${this.level + 1}`, canvasWidth / 2, canvasHeight / 2 + 80);
            ctx.font = '10px monospace';
            ctx.fillStyle = '#888888';
            ctx.fillText('Approaching next planet...', canvasWidth / 2, canvasHeight / 2 + 100);
            ctx.textAlign = 'left';
        } else {
            // Ship in gameplay view
            this._drawShip(ctx, canvasWidth / 2, this.shipY, 1);

            // Level complete banner
            if (this.phase === 'boarding' || this.phase === 'takeoff') {
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 18px monospace';
                ctx.textAlign = 'center';
                ctx.fillText('LEVEL COMPLETE', canvasWidth / 2, 80);
                ctx.textAlign = 'left';
            }
        }
    }

    _drawShip(ctx, x, y, scale) {
        const s = scale;
        // Pelican-style ship body
        ctx.fillStyle = '#556677';
        ctx.fillRect(x - 30 * s, y - 12 * s, 60 * s, 24 * s);

        // Cockpit
        ctx.fillStyle = '#88aacc';
        ctx.fillRect(x + 15 * s, y - 8 * s, 15 * s, 16 * s);

        // Wings
        ctx.fillStyle = '#445566';
        ctx.fillRect(x - 40 * s, y - 6 * s, 15 * s, 12 * s);
        ctx.fillRect(x - 40 * s, y + 6 * s, 50 * s, 4 * s);
        ctx.fillRect(x - 40 * s, y - 10 * s, 50 * s, 4 * s);

        // Engine glow
        ctx.fillStyle = '#ff8800';
        ctx.globalAlpha = 0.6 + Math.sin(Date.now() / 50) * 0.3;
        ctx.fillRect(x - 34 * s, y - 4 * s, 8 * s, 8 * s);
        ctx.globalAlpha = 1;
    }
}
