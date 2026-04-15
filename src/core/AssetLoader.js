import { SPRITE_DATA } from '../data/sprites.js';

// Renders pixel art arrays into offscreen canvases for fast drawing
const cache = {};

function renderSprite(pixelData, scale = 2) {
    const rows = pixelData.length;
    const cols = pixelData[0].length;
    const canvas = document.createElement('canvas');
    canvas.width = cols * scale;
    canvas.height = rows * scale;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const color = pixelData[r][c];
            if (color) {
                ctx.fillStyle = color;
                ctx.fillRect(c * scale, r * scale, scale, scale);
            }
        }
    }
    return canvas;
}

function mirrorCanvas(src) {
    const canvas = document.createElement('canvas');
    canvas.width = src.width;
    canvas.height = src.height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(src, 0, 0);
    return canvas;
}

export function getSprite(name, flipped = false) {
    const key = flipped ? name + '_flip' : name;
    if (cache[key]) return cache[key];

    const data = SPRITE_DATA[name];
    if (!data) return null;

    const sprite = renderSprite(data, 2);
    cache[name] = sprite;

    const flip = mirrorCanvas(sprite);
    cache[name + '_flip'] = flip;

    return flipped ? flip : sprite;
}

// Pre-render all sprites at startup
export function preloadSprites() {
    for (const name of Object.keys(SPRITE_DATA)) {
        getSprite(name, false);
        getSprite(name, true);
    }
}
