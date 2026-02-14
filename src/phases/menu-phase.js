// Menu/Title screen phase

import { Phase } from '../phase-manager.js';
import { COLORS, FONTS } from '../data/colors.js';
import { MiningPhase } from './mining-phase.js';

export class MenuPhase extends Phase {
    get name() {
        return 'Menu';
    }

    start() {
        super.start();
        this.pulseTimer = 0;
    }

    update(dt) {
        this.pulseTimer += dt;
    }

    render(ctx) {
        const { width, height, cx } = this.game;
        const highScore = this.game.save.getHighScore();

        // Title
        ctx.font = `900 72px ${FONTS.title}`;
        ctx.fillStyle = COLORS.primary;
        ctx.textAlign = 'center';
        ctx.fillText('VIG', cx, height * 0.28);

        // Tagline
        ctx.font = `400 16px ${FONTS.body}`;
        ctx.fillStyle = COLORS.textSecondary;
        ctx.fillText('Mine crypto. Pay sharks. Survive.', cx, height * 0.38);

        // Warning
        ctx.font = `600 14px ${FONTS.body}`;
        ctx.fillStyle = COLORS.danger;
        ctx.fillText('Miss or pass the target = GAME OVER', cx, height * 0.46);

        // High score
        if (highScore > 0) {
            ctx.font = `600 18px ${FONTS.body}`;
            ctx.fillStyle = COLORS.purple;
            ctx.fillText(`Best: Day ${highScore}`, cx, height * 0.55);
        }

        // Tap to start (pulsing)
        const pulse = 0.5 + Math.sin(this.pulseTimer * 3) * 0.3;
        ctx.globalAlpha = pulse;
        ctx.font = `700 22px ${FONTS.body}`;
        ctx.fillStyle = COLORS.primary;
        ctx.fillText('TAP TO START', cx, height * 0.72);
        ctx.globalAlpha = 1;

        // Version
        ctx.font = `400 12px ${FONTS.body}`;
        ctx.fillStyle = COLORS.textMuted;
        ctx.fillText('v0.1.0', cx, height * 0.95);
    }

    handleInput(x, y) {
        // Any tap starts the game
        this.game.startNewGame();
        this.end();
        return true;
    }
}
