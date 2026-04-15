import { JOYSTICK_RADIUS } from '../data/constants.js';

export class JoystickOverlay {
    draw(ctx, inputManager) {
        const joy = inputManager.joystick;
        if (!joy.active) return;

        const ox = joy.originX;
        const oy = joy.originY;

        // Base circle
        ctx.strokeStyle = '#ffffff';
        ctx.globalAlpha = 0.2;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ox, oy, JOYSTICK_RADIUS, 0, Math.PI * 2);
        ctx.stroke();

        // Nub position
        const nubX = ox + Math.cos(joy.angle) * joy.magnitude * JOYSTICK_RADIUS;
        const nubY = oy + Math.sin(joy.angle) * joy.magnitude * JOYSTICK_RADIUS;

        // Aim line
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(nubX, nubY);
        ctx.stroke();

        // Nub
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(nubX, nubY, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;
    }
}
