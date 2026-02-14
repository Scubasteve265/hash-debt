// Mining phase - core gameplay loop

import { Phase } from '../phase-manager.js';
import { COLORS, FONTS } from '../data/colors.js';
import { particles } from '../utils/particles.js';
import { camera } from '../utils/camera.js';
import { isAngleInRange, normalizeAngle, generateHash, randomRange } from '../utils/math.js';
import { PaydayPhase } from './payday-phase.js';
import { GameOverPhase } from './gameover-phase.js';

export class MiningPhase extends Phase {
    get name() {
        return 'Mining';
    }

    start() {
        super.start();

        const state = this.game.state;

        // Initialize mining state
        state.angle = Math.random() * Math.PI * 2;
        state.direction = 1;
        state.targetAngle = Math.random() * Math.PI * 2;
        state.hitsThisBlock = 0;
        state.wasInTarget = isAngleInRange(state.angle, state.targetAngle, state.difficulty.targetSize);
        state.lastHash = '';
        state.lastHashValid = false;

        this.showCashOut = state.blocksToday > 0;
    }

    update(dt) {
        const state = this.game.state;
        const prevAngle = state.angle;

        // Move spinner
        state.angle += state.difficulty.speed * state.direction;
        state.angle = normalizeAngle(state.angle);

        // Check if passed through target without tapping
        this.checkPassedTarget(prevAngle, state.angle);
    }

    checkPassedTarget(prevAngle, newAngle) {
        const state = this.game.state;
        const inTarget = isAngleInRange(newAngle, state.targetAngle, state.difficulty.targetSize);

        // Entered target
        if (!state.wasInTarget && inTarget) {
            state.wasInTarget = true;
        }

        // Left target without tapping
        if (state.wasInTarget && !inTarget) {
            this.onMiss('Passed the target!');
        }
    }

    render(ctx) {
        const { width, height, cx, cy, ringRadius } = this.game;
        const state = this.game.state;

        // Header
        this.renderHeader(ctx);

        // Ring glow
        ctx.beginPath();
        ctx.arc(cx, cy, ringRadius + 25, 0, Math.PI * 2);
        const glow = ctx.createRadialGradient(cx, cy, ringRadius - 10, cx, cy, ringRadius + 50);
        glow.addColorStop(0, 'transparent');
        glow.addColorStop(0.5, COLORS.primaryGlow);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fill();

        // Ring track
        ctx.beginPath();
        ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = COLORS.border;
        ctx.lineWidth = 18;
        ctx.stroke();

        // Target zone
        const targetEnd = state.targetAngle + Math.PI * 2 * state.difficulty.targetSize;
        ctx.beginPath();
        ctx.arc(cx, cy, ringRadius, state.targetAngle, targetEnd);
        ctx.strokeStyle = COLORS.primary;
        ctx.lineWidth = 22;
        ctx.stroke();

        // Direction indicator
        ctx.font = `400 14px ${FONTS.body}`;
        ctx.fillStyle = COLORS.textMuted;
        ctx.textAlign = 'center';
        ctx.fillText(state.direction > 0 ? '→' : '←', cx, cy);

        // Spinner trail
        this.renderSpinnerTrail(ctx);

        // Main spinner dot
        const sx = cx + Math.cos(state.angle) * ringRadius;
        const sy = cy + Math.sin(state.angle) * ringRadius;
        ctx.beginPath();
        ctx.arc(sx, sy, 14, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();

        // Progress
        this.renderProgress(ctx);

        // Cash out button
        if (this.showCashOut) {
            this.renderCashOutButton(ctx);
        }
    }

    renderHeader(ctx) {
        const { width, height, cx } = this.game;
        const state = this.game.state;

        ctx.font = `700 18px ${FONTS.title}`;
        ctx.textAlign = 'left';
        ctx.fillStyle = COLORS.success;
        ctx.fillText('$' + Math.floor(state.cashDisplay), 20, 40);

        ctx.textAlign = 'center';
        ctx.fillStyle = COLORS.text;
        ctx.fillText('DAY ' + state.day, cx, 40);

        ctx.textAlign = 'right';
        ctx.fillStyle = COLORS.primary;
        ctx.fillText(state.difficulty.multiplier.toFixed(1) + 'x', width - 20, 40);
    }

    renderSpinnerTrail(ctx) {
        const { cx, cy, ringRadius } = this.game;
        const state = this.game.state;

        for (let i = 1; i <= 8; i++) {
            const ta = state.angle - state.direction * i * 0.06;
            const tx = cx + Math.cos(ta) * ringRadius;
            const ty = cy + Math.sin(ta) * ringRadius;
            ctx.beginPath();
            ctx.arc(tx, ty, 12 - i, 0, Math.PI * 2);
            ctx.fillStyle = COLORS.text;
            ctx.globalAlpha = (8 - i) / 8 * 0.4;
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    renderProgress(ctx) {
        const { width, height, cx, cy, ringRadius } = this.game;
        const state = this.game.state;

        const progY = cy + ringRadius + 50;

        // Hits text
        ctx.font = `600 16px ${FONTS.body}`;
        ctx.fillStyle = COLORS.textSecondary;
        ctx.textAlign = 'center';
        ctx.fillText(`HITS: ${state.hitsThisBlock} / ${state.difficulty.hitsNeeded}`, cx, progY);

        // Progress bar
        const barW = width * 0.65;
        const barH = 14;
        const barX = cx - barW / 2;
        const barY = progY + 15;

        ctx.fillStyle = COLORS.bgCard;
        ctx.fillRect(barX, barY, barW, barH);

        const progress = state.hitsThisBlock / state.difficulty.hitsNeeded;
        ctx.fillStyle = COLORS.primary;
        ctx.fillRect(barX, barY, barW * progress, barH);

        // Last hash
        if (state.lastHash) {
            ctx.font = `600 14px ${FONTS.body}`;
            ctx.fillStyle = state.lastHashValid ? COLORS.success : COLORS.textMuted;
            ctx.fillText(state.lastHash + (state.lastHashValid ? ' ✓' : ''), cx, barY + 40);
        }

        // Blocks and earnings
        ctx.font = `400 14px ${FONTS.body}`;
        ctx.fillStyle = COLORS.textMuted;
        ctx.fillText(`Blocks: ${state.blocksToday}  |  Earned: $${state.sessionEarnings}`, cx, barY + 65);
    }

    renderCashOutButton(ctx) {
        const { cx, height } = this.game;

        const btn = this.getCashOutButton();
        ctx.fillStyle = COLORS.success;
        ctx.beginPath();
        ctx.roundRect(btn.x - btn.w/2, btn.y - btn.h/2, btn.w, btn.h, 10);
        ctx.fill();

        ctx.font = `700 14px ${FONTS.body}`;
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('CASH OUT', btn.x, btn.y);
        ctx.textBaseline = 'alphabetic';
    }

    getCashOutButton() {
        return {
            x: this.game.cx,
            y: this.game.height * 0.88,
            w: 160,
            h: 48
        };
    }

    handleInput(x, y) {
        // Check cash out button
        if (this.showCashOut) {
            const btn = this.getCashOutButton();
            if (x >= btn.x - btn.w/2 && x <= btn.x + btn.w/2 &&
                y >= btn.y - btn.h/2 && y <= btn.y + btn.h/2) {
                this.cashOut();
                return true;
            }
        }

        // Otherwise, attempt to hit target
        this.attemptHit();
        return true;
    }

    attemptHit() {
        const state = this.game.state;
        const inTarget = isAngleInRange(state.angle, state.targetAngle, state.difficulty.targetSize);

        if (inTarget) {
            this.onHit();
        } else {
            this.onMiss('Missed the target!');
        }
    }

    onHit() {
        const state = this.game.state;
        const { cx, cy, ringRadius } = this.game;

        // Reverse direction
        state.direction *= -1;
        state.hitsThisBlock++;

        const hx = cx + Math.cos(state.angle) * ringRadius;
        const hy = cy + Math.sin(state.angle) * ringRadius;

        // Generate hash
        state.lastHash = generateHash();
        state.lastHashValid = Math.random() < state.difficulty.hashChance;

        if (state.lastHashValid) {
            particles.burst(hx, hy, COLORS.success, 15, 120);
            this.game.flash(COLORS.successGlow);

            // Check if block cracked
            if (state.hitsThisBlock >= state.difficulty.hitsNeeded) {
                this.crackBlock();
            }
        } else {
            particles.burst(hx, hy, COLORS.primary, 8, 80);
        }

        // Move target to new position
        state.targetAngle = Math.random() * Math.PI * 2;
        state.wasInTarget = false;
    }

    crackBlock() {
        const state = this.game.state;
        const { cx, cy } = this.game;

        state.blocksToday++;
        state.hitsThisBlock = 0;

        // Calculate earnings
        const baseEarn = 10 + randomRange(0, 5);
        const earned = Math.floor(baseEarn * state.difficulty.multiplier);
        state.sessionEarnings += earned;
        state.cash += earned;

        particles.burst(cx, cy, COLORS.primary, 25, 180);
        particles.sparkUp(cx, cy - 50, COLORS.success, 15);
        camera.shake(12, 0.3);
        this.game.showMessage(`+$${earned}`, COLORS.success);

        // Enable cash out
        this.showCashOut = true;

        // Move target
        state.targetAngle = Math.random() * Math.PI * 2;
    }

    onMiss(reason) {
        const state = this.game.state;
        const { cx, cy } = this.game;

        // Lose all session earnings
        state.sessionEarnings = 0;

        particles.burst(cx, cy, COLORS.danger, 30, 200);
        camera.shake(30, 0.5);
        this.game.flash(COLORS.dangerGlow);
        this.game.showMessage(reason, COLORS.danger);

        // End game
        this.game.phaseManager.replace(new GameOverPhase(this.game, reason));
        this.end();
    }

    cashOut() {
        // Go to payday
        this.game.phaseManager.replace(new PaydayPhase(this.game));
        this.end();
    }
}
