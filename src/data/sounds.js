// Synthesized chiptune SFX using Web Audio API
let audioCtx = null;

function getCtx() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

function ensureResumed() {
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
}

function playTone(freq, duration, type = 'square', volume = 0.15, detune = 0) {
    const ctx = ensureResumed();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    if (detune) osc.detune.value = detune;
    gain.gain.value = volume;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
}

function playNoise(duration, volume = 0.1) {
    const ctx = ensureResumed();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.value = volume;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2000;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start(ctx.currentTime);
}

export const SFX = {
    bounce() {
        playTone(220, 0.08, 'square', 0.1);
        playTone(330, 0.06, 'square', 0.08);
    },

    jumpPad() {
        playTone(440, 0.1, 'square', 0.12);
        setTimeout(() => playTone(660, 0.1, 'square', 0.1), 30);
        setTimeout(() => playTone(880, 0.08, 'square', 0.08), 60);
    },

    shoot() {
        playTone(800, 0.05, 'sawtooth', 0.06);
        playNoise(0.03, 0.04);
    },

    enemyHit() {
        playTone(200, 0.08, 'square', 0.1);
        playNoise(0.05, 0.06);
    },

    enemyKill() {
        playTone(150, 0.15, 'sawtooth', 0.12);
        playNoise(0.1, 0.1);
        setTimeout(() => playTone(100, 0.1, 'sawtooth', 0.08), 50);
    },

    playerHit() {
        playTone(150, 0.2, 'square', 0.15);
        setTimeout(() => playTone(100, 0.15, 'square', 0.1), 80);
    },

    orbPickup() {
        playTone(523, 0.06, 'sine', 0.1);
        setTimeout(() => playTone(659, 0.06, 'sine', 0.08), 40);
        setTimeout(() => playTone(784, 0.08, 'sine', 0.06), 80);
    },

    boostCharge() {
        playTone(100, 0.05, 'sawtooth', 0.04);
    },

    boostRelease() {
        playTone(300, 0.12, 'sawtooth', 0.12);
        playNoise(0.08, 0.08);
        setTimeout(() => playTone(400, 0.08, 'sawtooth', 0.08), 30);
    },

    levelComplete() {
        const notes = [523, 659, 784, 1047];
        notes.forEach((f, i) => {
            setTimeout(() => playTone(f, 0.2, 'square', 0.1), i * 120);
        });
    },

    gameOver() {
        const notes = [440, 370, 311, 261];
        notes.forEach((f, i) => {
            setTimeout(() => playTone(f, 0.3, 'square', 0.1), i * 200);
        });
    },

    breakPlatform() {
        playTone(120, 0.1, 'sawtooth', 0.08);
        playNoise(0.08, 0.06);
    },
};
