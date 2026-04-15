export class Entity {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.width = width;
        this.height = height;
        this.active = true;
    }

    get left() { return this.x - this.width / 2; }
    get right() { return this.x + this.width / 2; }
    get top() { return this.y - this.height / 2; }
    get bottom() { return this.y + this.height / 2; }

    getBounds() {
        return {
            left: this.left,
            right: this.right,
            top: this.top,
            bottom: this.bottom,
        };
    }

    overlaps(other) {
        return (
            this.left < other.right &&
            this.right > other.left &&
            this.top < other.bottom &&
            this.bottom > other.top
        );
    }

    destroy() {
        this.active = false;
    }

    update(dt) {}

    draw(ctx, camera) {}
}
