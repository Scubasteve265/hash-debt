# HASH DEBT

> A crypto mining survival game where you juggle loan sharks until it all collapses.

## The Premise

You're broke. Deep in debt. Then the mafia shows up with a "gift" — a crypto mining rig. But nothing's free. The rig costs electricity, and they charge interest. Weekly.

Your only way out? Mine crypto. But the rig is getting older, less efficient. Costs keep rising. To keep up, you start taking loans from sharks. Each loan multiplies your earnings... but now you owe payments. Miss three payments to any one shark, and they come for you.

**It will collapse. The only question is when.**

---

## Core Gameplay

### The Mining (Arcade Mechanic)
- A light spins around a circular track
- Tap to stop it in the target zone
- Hit = earn crypto
- Miss = strike (3 total strikes = game over)
- After each hit: **CASH OUT** or **KEEP GOING**
- Keep going = multiplier builds, but one miss = lose entire session

### The Economy (Survival Layer)
| Income | Costs |
|--------|-------|
| Successful solves | Electricity (per attempt) |
| Loan multipliers | Rig degradation (increasing) |
| Streak bonuses | Loan payments (per shark) |

### The Loan Sharks (The Hook)
- Falling behind? Take a loan from a shark
- Each loan = **earnings multiplier** (1.5x, 2x, etc.)
- But now you owe **weekly payments** to that shark
- Miss 3 payments to ONE shark = **game over**
- Can't make a payment? Take another loan from a NEW shark
- Now you're juggling multiple sharks...
- The spiral begins

---

## The Loop

```
1. MINE → Timing game, earn crypto
2. COSTS HIT → Electricity, rig decay, interest
3. FALLING BEHIND? → Take a loan (multiplier + new payment obligation)
4. END OF ROUND → Pay your sharks (choose who if short)
5. MISS 3 TO ONE SHARK → Game over
6. REPEAT → More sharks, more payments, more pressure
7. SURVIVE → As long as possible
```

---

## Progression

### Unlock Different Cryptos
Each crypto plays differently:

| Crypto | Mechanic |
|--------|----------|
| **BTC** | Standard. The baseline. |
| **ETH** | Two rings, hit both. |
| **DOGE** | Chaotic wobble, forgiving but wild. |
| **SOL** | Insanely fast, randomly "crashes" (freezes). |
| **XMR** | Target invisible until last moment. |
| **SHIB** | Pure chaos. Target splits. |

### Real-Time Pricing
- Coin values pulled from live API (CoinGecko)
- Earnings scale to real daily prices
- Adds dynamic, real-world connection

---

## The Feel

**Round 1:** One shark, easy payments, chill.

**Round 10:** Four sharks, payments overlapping, sweating.

**Round 20:** Six sharks, robbing Peter to pay Paul, chaos.

**Round 21:** Missed third payment to Vinnie. He's here. *Game over.*

---

## High Score

Your score is survival:
- How many rounds did you last?
- Peak balance before collapse?
- Most sharks juggled at once?

---

## Tech Stack

- **Platform:** Web (HTML5/JavaScript) — instant play, easy sharing
- **Crypto Prices:** CoinGecko API (free)
- **Save Data:** LocalStorage
- **No install. No app store. Just play.**

---

## Inspiration

- **Cyclone** (arcade) — the timing mechanic
- **Papers Please** — the survival economy pressure
- **Balatro** — the "push your luck" cash out tension
- **Flappy Bird** — one-tap, instant death, "one more try"

---

## Status

🚧 **In Development**

---

## License

MIT
