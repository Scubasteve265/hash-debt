// Game Over phase

import { Phase } from '../phase-manager.js';
import { COLORS, FONTS } from '../data/colors.js';
import { MenuPhase } from './menu-phase.js';

export class GameOverPhase extends Phase {
    constructor(game, reason = 'Game Over') {
        super(game);
        this.reason = reason;
        this.showButton = false;
    }

    get name() {
        return 'GameOver';
    }

    start() {
        super.start();

        const state = this.game.state;

        // Save stats
        this.game.save.updateStats({
            day: state.day,
            blocksMined: state.blocksToday,
            earnings: state.sessionEarnings,
            multiplier: state.difficulty.multiplier,
            sharksCount: state.sharks.length
        });

        // Show button after delay
        setTimeout(() => {
            this.showButton = true;
        }, 1200);
    }

    update(dt) {
        // Nothing to update
    }

    render(ctx) {
        const { width, height, cx } = this.game;
        const state = this.game.state;
        const highScore = this.game.save.getHighScore();

        // Title
        ctx.font = `900 48px ${FONTS.title}`;
        ctx.fillStyle = COLORS.danger;
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', cx, height * 0.25);

        // Reason
        ctx.font = `400 16px ${FONTS.body}`;
        ctx.fillStyle = COLORS.textSecondary;
        ctx.fillText(this.reason, cx, height * 0.34);

        // Stats
        ctx.font = `700 20px ${FONTS.body}`;
        ctx.fillStyle = COLORS.text;
        ctx.fillText(`Day ${state.day}`, cx, height * 0.46);

        ctx.font = `400 16px ${FONTS.body}`;
        ctx.fillStyle = COLORS.textSecondary;
        ctx.fillText(`Blocks mined: ${state.blocksToday}`, cx, height * 0.53);
        ctx.fillText(`Sharks: ${state.sharks.length}`, cx, height * 0.59);

        // High score
        ctx.font = `600 18px ${FONTS.body}`;
        ctx.fillStyle = COLORS.purple;
        ctx.fillText(`Best: Day ${highScore}`, cx, height * 0.68);

        // Try again button
        if (this.showButton) {
            const btn = this.getButton();

            ctx.fillStyle = COLORS.primary;
            ctx.beginPath();
            ctx.roundRect(btn.x - btn.w/2, btn.y - btn.h/2, btn.w, btn.h, 10);
            ctx.fill();

            ctx.font = `700 14px ${FONTS.body}`;
            ctx.fillStyle = '#000';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('TRY AGAIN', btn.x, btn.y);
            ctx.textBaseline = 'alphabetic';
        }
    }

    getButton() {
        return {
            x: this.game.cx,
            y: this.game.height * 0.80,
            w: 180,
            h: 56
        };
    }

    handleInput(x, y) {
        if (!this.showButton) return false;

        const btn = this.getButton();
        if (x >= btn.x - btn.w/2 && x <= btn.x + btn.w/2 &&
            y >= btn.y - btn.h/2 && y <= btn.y + btn.h/2) {
            this.game.startNewGame();
            this.end();
            return true;
        }

        return false;
    }
}
