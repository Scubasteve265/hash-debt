// Phase-based game loop manager (based on PokeRogue pattern)

export class Phase {
    constructor(game) {
        this.game = game;
        this.started = false;
        this.ended = false;
    }

    // Override in subclasses
    get name() {
        return 'Phase';
    }

    start() {
        this.started = true;
    }

    update(dt) {
        // Override in subclasses
    }

    render(ctx) {
        // Override in subclasses
    }

    handleInput(x, y) {
        // Override in subclasses
        return false;
    }

    end() {
        this.ended = true;
        this.game.phaseManager.next();
    }
}

export class PhaseManager {
    constructor(game) {
        this.game = game;
        this.queue = [];
        this.current = null;
    }

    push(...phases) {
        this.queue.push(...phases);
        if (!this.current) {
            this.next();
        }
    }

    unshift(...phases) {
        this.queue.unshift(...phases);
    }

    next() {
        if (this.queue.length > 0) {
            this.current = this.queue.shift();
            this.current.start();
        } else {
            this.current = null;
        }
    }

    clear() {
        this.queue = [];
        this.current = null;
    }

    replace(phase) {
        this.clear();
        this.push(phase);
    }

    update(dt) {
        if (this.current && !this.current.ended) {
            this.current.update(dt);
        }
    }

    render(ctx) {
        if (this.current && !this.current.ended) {
            this.current.render(ctx);
        }
    }

    handleInput(x, y) {
        if (this.current && !this.current.ended) {
            return this.current.handleInput(x, y);
        }
        return false;
    }

    getCurrentPhase() {
        return this.current;
    }

    hasPhase() {
        return this.current !== null || this.queue.length > 0;
    }
}
