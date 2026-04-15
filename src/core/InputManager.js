import { JOYSTICK_RADIUS, JOYSTICK_DEAD_ZONE, GAME_WIDTH } from '../data/constants.js';

export class InputManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.activeTouches = new Map();
        this.listeners = new Map();

        // Joystick state
        this.joystick = { active: false, angle: 0, magnitude: 0, originX: 0, originY: 0 };

        // Booster state
        this.booster = { side: null, charging: false, startTime: 0 };

        // Enabled flag - set to false to ignore input during transitions
        this.enabled = true;

        // Mouse fallback state (for desktop testing)
        this.mouseDown = false;
        this.mouseZone = null;

        this._bindEvents();
    }

    _bindEvents() {
        const c = this.canvas;

        // Touch events
        c.addEventListener('touchstart', (e) => { e.preventDefault(); this._onTouchStart(e); }, { passive: false });
        c.addEventListener('touchmove', (e) => { e.preventDefault(); this._onTouchMove(e); }, { passive: false });
        c.addEventListener('touchend', (e) => { e.preventDefault(); this._onTouchEnd(e); }, { passive: false });
        c.addEventListener('touchcancel', (e) => { e.preventDefault(); this._onTouchEnd(e); }, { passive: false });

        // Mouse fallback for desktop
        c.addEventListener('mousedown', (e) => this._onMouseDown(e));
        c.addEventListener('mousemove', (e) => this._onMouseMove(e));
        c.addEventListener('mouseup', (e) => this._onMouseUp(e));
    }

    _getCanvasPos(clientX, clientY) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY,
        };
    }

    _classifyZone(x) {
        const halfWidth = this.canvas.width / 2;
        if (x < halfWidth) {
            // Left half: split into top (left booster) and bottom (right booster)
            // Actually, split left/right within the left half
            const quarterWidth = halfWidth / 2;
            if (x < quarterWidth) return 'LEFT_BOOSTER';
            return 'RIGHT_BOOSTER';
        }
        return 'JOYSTICK';
    }

    // --- Touch handlers ---

    _onTouchStart(e) {
        for (const touch of e.changedTouches) {
            const pos = this._getCanvasPos(touch.clientX, touch.clientY);
            const zone = this._classifyZone(pos.x);

            this.activeTouches.set(touch.identifier, {
                zone,
                startX: pos.x,
                startY: pos.y,
                currentX: pos.x,
                currentY: pos.y,
                startTime: performance.now(),
            });

            if (zone === 'LEFT_BOOSTER' || zone === 'RIGHT_BOOSTER') {
                const side = zone === 'LEFT_BOOSTER' ? 'left' : 'right';
                this.booster = { side, charging: true, startTime: performance.now() };
                this._emit('booster-start', { side });
            } else if (zone === 'JOYSTICK') {
                this.joystick.active = true;
                this.joystick.originX = pos.x;
                this.joystick.originY = pos.y;
                this.joystick.angle = 0;
                this.joystick.magnitude = 0;
            }
        }
    }

    _onTouchMove(e) {
        for (const touch of e.changedTouches) {
            const entry = this.activeTouches.get(touch.identifier);
            if (!entry) continue;

            const pos = this._getCanvasPos(touch.clientX, touch.clientY);
            entry.currentX = pos.x;
            entry.currentY = pos.y;

            if (entry.zone === 'JOYSTICK') {
                const dx = pos.x - this.joystick.originX;
                const dy = pos.y - this.joystick.originY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist > JOYSTICK_DEAD_ZONE) {
                    this.joystick.angle = Math.atan2(dy, dx);
                    this.joystick.magnitude = Math.min(dist / JOYSTICK_RADIUS, 1);
                } else {
                    this.joystick.magnitude = 0;
                }
            }
        }
    }

    _onTouchEnd(e) {
        for (const touch of e.changedTouches) {
            const entry = this.activeTouches.get(touch.identifier);
            if (!entry) continue;

            if (entry.zone === 'LEFT_BOOSTER' || entry.zone === 'RIGHT_BOOSTER') {
                const side = entry.zone === 'LEFT_BOOSTER' ? 'left' : 'right';
                const chargeTime = (performance.now() - entry.startTime) / 1000;
                this._emit('booster-release', { side, chargeTime });
                this.booster = { side: null, charging: false, startTime: 0 };
            } else if (entry.zone === 'JOYSTICK') {
                this.joystick.active = false;
                this.joystick.magnitude = 0;
            }

            this.activeTouches.delete(touch.identifier);
        }
    }

    // --- Mouse fallback ---

    _onMouseDown(e) {
        const pos = this._getCanvasPos(e.clientX, e.clientY);
        const zone = this._classifyZone(pos.x);
        this.mouseDown = true;
        this.mouseZone = zone;

        if (zone === 'LEFT_BOOSTER' || zone === 'RIGHT_BOOSTER') {
            const side = zone === 'LEFT_BOOSTER' ? 'left' : 'right';
            this.booster = { side, charging: true, startTime: performance.now() };
            this._emit('booster-start', { side });
        } else if (zone === 'JOYSTICK') {
            this.joystick.active = true;
            this.joystick.originX = pos.x;
            this.joystick.originY = pos.y;
        }
    }

    _onMouseMove(e) {
        if (!this.mouseDown) return;
        const pos = this._getCanvasPos(e.clientX, e.clientY);

        if (this.mouseZone === 'JOYSTICK') {
            const dx = pos.x - this.joystick.originX;
            const dy = pos.y - this.joystick.originY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > JOYSTICK_DEAD_ZONE) {
                this.joystick.angle = Math.atan2(dy, dx);
                this.joystick.magnitude = Math.min(dist / JOYSTICK_RADIUS, 1);
            } else {
                this.joystick.magnitude = 0;
            }
        }
    }

    _onMouseUp(e) {
        if (this.mouseZone === 'LEFT_BOOSTER' || this.mouseZone === 'RIGHT_BOOSTER') {
            const side = this.mouseZone === 'LEFT_BOOSTER' ? 'left' : 'right';
            const chargeTime = (performance.now() - this.booster.startTime) / 1000;
            this._emit('booster-release', { side, chargeTime });
            this.booster = { side: null, charging: false, startTime: 0 };
        } else if (this.mouseZone === 'JOYSTICK') {
            this.joystick.active = false;
            this.joystick.magnitude = 0;
        }

        this.mouseDown = false;
        this.mouseZone = null;
    }

    // --- Reset (call on level start to clear stale input) ---

    reset() {
        this.activeTouches.clear();
        this.joystick = { active: false, angle: 0, magnitude: 0, originX: 0, originY: 0 };
        this.booster = { side: null, charging: false, startTime: 0 };
        this.mouseDown = false;
        this.mouseZone = null;
        this.enabled = false;
        // Re-enable after a short delay so the menu-start click doesn't register as gameplay input
        setTimeout(() => { this.enabled = true; }, 300);
    }

    // --- Event system ---

    on(event, callback) {
        if (!this.listeners.has(event)) this.listeners.set(event, []);
        this.listeners.get(event).push(callback);
    }

    _emit(event, data) {
        if (!this.enabled) return;
        const cbs = this.listeners.get(event);
        if (cbs) cbs.forEach(cb => cb(data));
    }

    getBoosterChargeTime() {
        if (!this.booster.charging || !this.enabled) return 0;
        return (performance.now() - this.booster.startTime) / 1000;
    }
}
