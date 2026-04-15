import { Game } from './Game.js';
import { preloadSprites } from './core/AssetLoader.js';

preloadSprites();

const canvas = document.getElementById('game');
const game = new Game(canvas);
window.__game = game;
game.start();
