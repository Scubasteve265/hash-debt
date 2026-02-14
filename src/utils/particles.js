// Particle system (based on Shattered Pixel Dungeon pattern)

class Particle {
    constructor(x, y, vx, vy, radius, color, life, decay, gravity = 400) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
        this.life = life;
        this.maxLife = life;
        this.decay = decay;
        this.gravity = gravity;
    }

    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.vy += this.gravity * dt;
        this.life -= this.decay * dt;
        return this.life > 0;
    }

    render(ctx) {
        const alpha = this.life / this.maxLife;
        const size = this.radius * alpha;

        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

export class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    burst(x, y, color, count, speed = 150) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i / count) + Math.random() * 0.4;
            const vel = speed * (0.5 + Math.random() * 0.5);
            this.particles.push(new Particle(
                x, y,
                Math.cos(angle) * vel,
                Math.sin(angle) * vel,
                4 + Math.random() * 4,
                color,
                1,
                2
            ));
        }
    }

    sparkUp(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(
                x + (Math.random() - 0.5) * 50,
                y,
                (Math.random() - 0.5) * 40,
                -100 - Math.random() * 100,
                3 + Math.random() * 4,
                color,
                1,
                1.5,
                300
            ));
        }
    }

    trail(x, y, color, size = 3) {
        this.particles.push(new Particle(
            x, y, 0, 0, size, color, 0.5, 2, 0
        ));
    }

    update(dt) {
        this.particles = this.particles.filter(p => p.update(dt));
    }

    render(ctx) {
        this.particles.forEach(p => p.render(ctx));
    }

    clear() {
        this.particles = [];
    }
}

// Global instance
export const particles = new ParticleSystem();
