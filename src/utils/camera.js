// Camera system with screen shake (based on SPD pattern)

export class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.shakeMagnitude = 0;
        this.shakeTime = 0;
        this.shakeDuration = 0;
    }

    shake(magnitude, duration) {
        this.shakeMagnitude = magnitude;
        this.shakeTime = duration;
        this.shakeDuration = duration;
    }

    update(dt) {
        if (this.shakeTime > 0) {
            this.shakeTime -= dt;
            const damping = this.shakeTime / this.shakeDuration;
            this.x = (Math.random() - 0.5) * this.shakeMagnitude * damping * 2;
            this.y = (Math.random() - 0.5) * this.shakeMagnitude * damping * 2;
        } else {
            this.x = 0;
            this.y = 0;
        }
    }

    apply(ctx) {
        ctx.translate(this.x, this.y);
    }

    isShaking() {
        return this.shakeTime > 0;
    }
}

// Global instance
export const camera = new Camera();
