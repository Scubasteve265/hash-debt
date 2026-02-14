// Main game class - orchestrates everything

import { PhaseManager } from './phase-manager.js';
import { saveSystem } from './system/save.js';
import { particles } from './utils/particles.js';
import { camera } from './utils/camera.js';
import { lerp } from './utils/math.js';
import { COLORS } from './data/colors.js';
import { getDifficultyForDay, applySharkModifiers } from './data/difficulty.js';
import { MenuPhase } from './phases/menu-phase.js';
import { MiningPhase } from './phases/mining-phase.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // Dimensions (set by resize)
        this.width = 0;
        this.height = 0;
        this.cx = 0;
        this.cy = 0;
        this.ringRadius = 0;

        // Systems
        this.save = saveSystem;
        this.phaseManager = new PhaseManager(this);

        // Game state
        this.state = this.createInitialState();

        // Visual state
        this.message = null;
        this.messageTimer = 0;
        this.flashColor = null;
        this.flashTimer = 0;

        // Timing
        this.lastTime = 0;

        // Initialize
        this.resize();
        this.bindEvents();
        this.start();
    }

    createInitialState() {
        return {
            day: 1,
            cash: 0,
            cashDisplay: 0,

            // Ring state
            angle: 0,
            direction: 1,
            targetAngle: 0,

            // Mining progress
            hitsThisBlock: 0,
            blocksToday: 0,
            sessionEarnings: 0,
            wasInTarget: false,
            lastHash: '',
            lastHashValid: false,

            // Sharks
            sharks: [],

            // Difficulty (calculated)
            difficulty: getDifficultyForDay(1)
        };
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.cx = this.width / 2;
        this.cy = this.height * 0.4;
        this.ringRadius = Math.min(this.width * 0.4, this.height * 0.25);
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());

        // Touch
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const t = e.touches[0];
            const r = this.canvas.getBoundingClientRect();
            this.handleInput(t.clientX - r.left, t.clientY - r.top);
        }, { passive: false });

        // Mouse
        this.canvas.addEventListener('mousedown', (e) => {
            const r = this.canvas.getBoundingClientRect();
            this.handleInput(e.clientX - r.left, e.clientY - r.top);
        });
    }

    handleInput(x, y) {
        this.phaseManager.handleInput(x, y);
    }

    start() {
        // Start with menu
        this.phaseManager.push(new MenuPhase(this));

        // Start game loop
        requestAnimationFrame((t) => this.loop(t));
    }

    startNewGame() {
        // Reset state
        this.state = this.createInitialState();

        // Start mining phase
        this.phaseManager.replace(new MiningPhase(this));
    }

    updateDifficulty() {
        const baseDifficulty = getDifficultyForDay(this.state.day);
        this.state.difficulty = applySharkModifiers(baseDifficulty, this.state.sharks);
    }

    showMessage(text, color) {
        this.message = { text, color };
        this.messageTimer = 1.5;
    }

    flash(color) {
        this.flashColor = color;
        this.flashTimer = 0.12;
    }

    loop(time) {
        const dt = Math.min(0.1, (time - this.lastTime) / 1000);
        this.lastTime = time;

        this.update(dt);
        this.render();

        requestAnimationFrame((t) => this.loop(t));
    }

    update(dt) {
        // Update phase
        this.phaseManager.update(dt);

        // Update particles
        particles.update(dt);

        // Update camera
        camera.update(dt);

        // Tween cash display
        this.state.cashDisplay = lerp(this.state.cashDisplay, this.state.cash, dt * 12);

        // Message timer
        if (this.messageTimer > 0) {
            this.messageTimer -= dt;
        }

        // Flash timer
        if (this.flashTimer > 0) {
            this.flashTimer -= dt;
        }
    }

    render() {
        const ctx = this.ctx;

        ctx.save();

        // Apply camera shake
        camera.apply(ctx);

        // Clear background
        ctx.fillStyle = COLORS.bg;
        ctx.fillRect(-50, -50, this.width + 100, this.height + 100);

        // Flash overlay
        if (this.flashTimer > 0 && this.flashColor) {
            ctx.fillStyle = this.flashColor;
            ctx.fillRect(0, 0, this.width, this.height);
        }

        // Render current phase
        this.phaseManager.render(ctx);

        // Render particles
        particles.render(ctx);

        // Render message
        if (this.messageTimer > 0 && this.message) {
            ctx.globalAlpha = Math.min(1, this.messageTimer);
            ctx.font = '700 26px Orbitron';
            ctx.fillStyle = this.message.color;
            ctx.textAlign = 'center';
            ctx.fillText(this.message.text, this.cx, this.cy - this.ringRadius - 60);
            ctx.globalAlpha = 1;
        }

        ctx.restore();
    }
}
