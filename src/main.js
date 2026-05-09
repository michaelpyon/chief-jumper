import { Game } from './Game.js';
import { preloadSprites } from './core/AssetLoader.js';

// Pause the loop when the tab isn't visible to save battery and prevent input drift
document.addEventListener('visibilitychange', () => {
    if (window.__game && window.__game.loop) {
        if (document.hidden) {
            window.__game.loop.stop();
        } else if (!window.__game.loop.running) {
            window.__game.loop.start(
                (dt) => window.__game._update(dt),
                (alpha) => window.__game._render(alpha)
            );
        }
    }
});

try {
    preloadSprites();
    const canvas = document.getElementById('game');
    const game = new Game(canvas);
    window.__game = game;
    game.start();
} catch (err) {
    console.error('Chief Jumper failed to start:', err);
    document.body.innerHTML = '<p style="color:#fff;font-family:sans-serif;padding:2rem;text-align:center;">Game failed to load. Please reload the page.</p>';
}
