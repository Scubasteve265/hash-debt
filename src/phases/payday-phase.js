// Payday phase - pay sharks and manage loans

import { Phase } from '../phase-manager.js';
import { COLORS, FONTS } from '../data/colors.js';
import { getNextAvailableShark } from '../data/sharks.js';
import { calculateSharkDemand } from '../data/difficulty.js';
import { particles } from '../utils/particles.js';
import { camera } from '../utils/camera.js';
import { MiningPhase } from './mining-phase.js';
import { GameOverPhase } from './gameover-phase.js';

export class PaydayPhase extends Phase {
    get name() {
        return 'Payday';
    }

    start() {
        super.start();

        const state = this.game.state;

        // Update shark demands based on day
        state.sharks.forEach(s => {
            s.demand = calculateSharkDemand(s.baseDemand, state.day);
            s.paid = false;
        });

        // Get next available shark for loans
        this.nextShark = getNextAvailableShark(state.sharks);
    }

    update(dt) {
        // Animate cash display
    }

    render(ctx) {
        const { width, height, cx } = this.game;
        const state = this.game.state;

        // Header
        ctx.font = `700 28px ${FONTS.title}`;
        ctx.fillStyle = COLORS.warning;
        ctx.textAlign = 'center';
        ctx.fillText('PAYDAY', cx, height * 0.06);

        // Cash
        ctx.font = `900 42px ${FONTS.title}`;
        ctx.fillStyle = COLORS.success;
        ctx.fillText('$' + Math.floor(state.cashDisplay), cx, height * 0.13);

        // Render shark cards
        this.renderSharkCards(ctx);

        // Render buttons
        this.renderButtons(ctx);
    }

    renderSharkCards(ctx) {
        const { width, height, cx } = this.game;
        const state = this.game.state;

        const cardW = width * 0.85;
        const cardH = 75;
        const startY = height * 0.18;

        state.sharks.forEach((shark, i) => {
            const y = startY + i * (cardH + 10);

            // Card background
            ctx.fillStyle = shark.strikes >= 2 ? '#1a1215' : COLORS.bgCard;
            ctx.fillRect(cx - cardW/2, y, cardW, cardH);

            // Border
            ctx.strokeStyle = shark.strikes >= 2 ? COLORS.danger :
                             shark.strikes >= 1 ? COLORS.warning : COLORS.border;
            ctx.lineWidth = 2;
            ctx.strokeRect(cx - cardW/2, y, cardW, cardH);

            // Name
            ctx.font = `700 15px ${FONTS.body}`;
            ctx.fillStyle = COLORS.text;
            ctx.textAlign = 'left';
            ctx.fillText(shark.name, cx - cardW/2 + 15, y + 28);

            // Strikes and multiplier
            ctx.font = `400 12px ${FONTS.body}`;
            ctx.fillStyle = COLORS.textMuted;
            let strikes = '';
            for (let j = 0; j < 3; j++) strikes += j < shark.strikes ? '✗ ' : '○ ';
            ctx.fillText(`${strikes} | ${shark.multiplier}x`, cx - cardW/2 + 15, y + 50);

            // Demand
            ctx.font = `700 18px ${FONTS.title}`;
            ctx.fillStyle = COLORS.success;
            ctx.textAlign = 'center';
            ctx.fillText('$' + shark.demand, cx, y + 42);

            // Pay/Skip buttons or Paid label
            if (!shark.paid) {
                const canPay = state.cash >= shark.demand;
                const btnY = y + cardH / 2;

                // Pay button
                ctx.fillStyle = canPay ? COLORS.success : COLORS.textMuted;
                ctx.fillRect(cx + cardW/2 - 130, btnY - 16, 55, 32);
                ctx.font = `700 11px ${FONTS.body}`;
                ctx.fillStyle = '#000';
                ctx.textAlign = 'center';
                ctx.fillText('PAY', cx + cardW/2 - 102, btnY + 5);

                // Skip button
                ctx.fillStyle = COLORS.danger;
                ctx.fillRect(cx + cardW/2 - 65, btnY - 16, 50, 32);
                ctx.fillStyle = '#000';
                ctx.fillText('SKIP', cx + cardW/2 - 40, btnY + 5);
            } else {
                ctx.font = `600 12px ${FONTS.body}`;
                ctx.fillStyle = COLORS.textMuted;
                ctx.textAlign = 'right';
                ctx.fillText('PAID', cx + cardW/2 - 15, y + cardH/2 + 5);
            }
        });
    }

    renderButtons(ctx) {
        const { width, height, cx } = this.game;

        // Loan info
        if (this.nextShark) {
            ctx.font = `400 12px ${FONTS.body}`;
            ctx.fillStyle = COLORS.textMuted;
            ctx.textAlign = 'center';
            ctx.fillText(
                `Next loan: +$${this.nextShark.loanAmount}, ${this.nextShark.multiplier}x mult, +${Math.round((this.nextShark.speedBoost-1)*100)}% speed`,
                cx, height * 0.70
            );

            // Loan button
            const loanBtn = this.getLoanButton();
            ctx.fillStyle = COLORS.warning;
            ctx.beginPath();
            ctx.roundRect(loanBtn.x - loanBtn.w/2, loanBtn.y - loanBtn.h/2, loanBtn.w, loanBtn.h, 10);
            ctx.fill();

            ctx.font = `700 13px ${FONTS.body}`;
            ctx.fillStyle = '#000';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`LOAN: +$${this.nextShark.loanAmount}`, loanBtn.x, loanBtn.y);
            ctx.textBaseline = 'alphabetic';
        }

        // Next day button
        const nextBtn = this.getNextDayButton();
        ctx.fillStyle = COLORS.primary;
        ctx.beginPath();
        ctx.roundRect(nextBtn.x - nextBtn.w/2, nextBtn.y - nextBtn.h/2, nextBtn.w, nextBtn.h, 10);
        ctx.fill();

        ctx.font = `700 14px ${FONTS.body}`;
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('NEXT DAY', nextBtn.x, nextBtn.y);
        ctx.textBaseline = 'alphabetic';
    }

    getLoanButton() {
        return {
            x: this.game.cx,
            y: this.game.height * 0.76,
            w: 200,
            h: 48
        };
    }

    getNextDayButton() {
        return {
            x: this.game.cx,
            y: this.game.height * 0.88,
            w: 180,
            h: 52
        };
    }

    getSharkButtonAreas() {
        const { width, height, cx } = this.game;
        const cardW = width * 0.85;
        const cardH = 75;
        const startY = height * 0.18;

        return this.game.state.sharks.map((shark, i) => {
            const y = startY + i * (cardH + 10);
            const btnY = y + cardH / 2;
            return {
                shark,
                index: i,
                payBtn: {
                    x1: cx + cardW/2 - 130,
                    y1: btnY - 16,
                    x2: cx + cardW/2 - 75,
                    y2: btnY + 16
                },
                skipBtn: {
                    x1: cx + cardW/2 - 65,
                    y1: btnY - 16,
                    x2: cx + cardW/2 - 15,
                    y2: btnY + 16
                }
            };
        });
    }

    handleInput(x, y) {
        const state = this.game.state;

        // Check shark buttons
        const areas = this.getSharkButtonAreas();
        for (const area of areas) {
            if (area.shark.paid) continue;

            // Pay button
            if (x >= area.payBtn.x1 && x <= area.payBtn.x2 &&
                y >= area.payBtn.y1 && y <= area.payBtn.y2) {
                this.payShark(area.index);
                return true;
            }

            // Skip button
            if (x >= area.skipBtn.x1 && x <= area.skipBtn.x2 &&
                y >= area.skipBtn.y1 && y <= area.skipBtn.y2) {
                this.skipShark(area.index);
                return true;
            }
        }

        // Loan button
        if (this.nextShark) {
            const loanBtn = this.getLoanButton();
            if (x >= loanBtn.x - loanBtn.w/2 && x <= loanBtn.x + loanBtn.w/2 &&
                y >= loanBtn.y - loanBtn.h/2 && y <= loanBtn.y + loanBtn.h/2) {
                this.takeLoan();
                return true;
            }
        }

        // Next day button
        const nextBtn = this.getNextDayButton();
        if (x >= nextBtn.x - nextBtn.w/2 && x <= nextBtn.x + nextBtn.w/2 &&
            y >= nextBtn.y - nextBtn.h/2 && y <= nextBtn.y + nextBtn.h/2) {
            this.nextDay();
            return true;
        }

        return false;
    }

    payShark(index) {
        const state = this.game.state;
        const shark = state.sharks[index];

        if (state.cash >= shark.demand) {
            state.cash -= shark.demand;
            shark.paid = true;
            particles.sparkUp(this.game.cx, this.game.height * 0.4, COLORS.success, 10);
        }
    }

    skipShark(index) {
        const state = this.game.state;
        const shark = state.sharks[index];

        shark.strikes++;
        shark.paid = true;
        camera.shake(10, 0.2);

        if (shark.strikes >= 3) {
            this.game.phaseManager.replace(new GameOverPhase(this.game, `${shark.name} collected.`));
            this.end();
        }
    }

    takeLoan() {
        const state = this.game.state;

        if (this.nextShark) {
            const newShark = {
                ...this.nextShark,
                strikes: 0,
                paid: false,
                demand: this.nextShark.baseDemand
            };

            state.sharks.push(newShark);
            state.cash += newShark.loanAmount;

            particles.sparkUp(this.game.cx, this.game.height * 0.5, COLORS.warning, 15);
            this.game.showMessage(`${newShark.name} joins! ${newShark.multiplier}x`, COLORS.warning);

            // Update difficulty
            this.game.updateDifficulty();

            // Get next available shark
            this.nextShark = getNextAvailableShark(state.sharks);
        }
    }

    nextDay() {
        const state = this.game.state;

        state.day++;
        state.blocksToday = 0;
        state.sessionEarnings = 0;
        state.hitsThisBlock = 0;

        // Update difficulty for new day
        this.game.updateDifficulty();

        // Start mining
        this.game.phaseManager.replace(new MiningPhase(this.game));
        this.end();
    }
}
