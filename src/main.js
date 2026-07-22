import { Game } from './Game.js';
import { preloadSprites } from './core/AssetLoader.js';

function stopForInterruption() {
    const game = window.__game;
    if (!game || !game.loop) return;
    game.pause();
    game.loop.stop();
}

function restartLoop() {
    const game = window.__game;
    if (!game || !game.loop || game.loop.running) return;
    game.loop.start(
        (dt) => game._update(dt),
        (alpha) => game._render(alpha)
    );
}

// Freeze active runs on tab or window interruption. Returning shows a deliberate resume state.
document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopForInterruption();
    else restartLoop();
});
window.addEventListener('blur', stopForInterruption);
window.addEventListener('focus', restartLoop);

try {
    preloadSprites();
    const canvas = document.getElementById('game');
    const game = new Game(canvas);
    window.__game = game;
    game.start();
} catch (err) {
    console.error('Chief Jumper failed to start:', err);
    document.body.innerHTML = '<p style="color:#fff;font-family:monospace;padding:2rem;text-align:center;">The office is closed. Refresh to try again.</p>';
}
