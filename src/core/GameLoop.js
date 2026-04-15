export class GameLoop {
    constructor() {
        this.FIXED_DT = 1 / 60;
        this.accumulator = 0;
        this.lastTime = 0;
        this.running = false;
        this.updateFn = null;
        this.renderFn = null;
        this._tick = this._tick.bind(this);
    }

    start(updateFn, renderFn) {
        this.updateFn = updateFn;
        this.renderFn = renderFn;
        this.running = true;
        this.lastTime = performance.now() / 1000;
        requestAnimationFrame(this._tick);
    }

    stop() {
        this.running = false;
    }

    _tick(timestamp) {
        if (!this.running) return;

        const now = timestamp / 1000;
        let delta = now - this.lastTime;
        this.lastTime = now;

        // Clamp to prevent spiral of death after tab sleep
        if (delta > 0.25) delta = 0.25;

        this.accumulator += delta;

        while (this.accumulator >= this.FIXED_DT) {
            this.updateFn(this.FIXED_DT);
            this.accumulator -= this.FIXED_DT;
        }

        const alpha = this.accumulator / this.FIXED_DT;
        this.renderFn(alpha);

        requestAnimationFrame(this._tick);
    }
}
