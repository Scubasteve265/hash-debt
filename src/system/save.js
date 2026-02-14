// Save system with localStorage

const SAVE_KEY = 'vig_save';
const SETTINGS_KEY = 'vig_settings';
const STATS_KEY = 'vig_stats';

// Default save data structure
const DEFAULT_SAVE = {
    version: 1,
    highScore: 0,
    totalGames: 0,
    totalBlocksMined: 0,
    totalEarnings: 0,
    bestMultiplier: 1,
    maxSharksJuggled: 0,
    lastPlayed: null
};

// Default settings
const DEFAULT_SETTINGS = {
    soundEnabled: true,
    musicEnabled: true,
    gameSpeed: 1,
    showTutorial: true
};

export class SaveSystem {
    constructor() {
        this.data = this.load();
        this.settings = this.loadSettings();
    }

    // Save data
    load() {
        try {
            const saved = localStorage.getItem(SAVE_KEY);
            if (saved) {
                return { ...DEFAULT_SAVE, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.warn('Failed to load save data:', e);
        }
        return { ...DEFAULT_SAVE };
    }

    save() {
        try {
            this.data.lastPlayed = Date.now();
            localStorage.setItem(SAVE_KEY, JSON.stringify(this.data));
            return true;
        } catch (e) {
            console.warn('Failed to save data:', e);
            return false;
        }
    }

    // Settings
    loadSettings() {
        try {
            const saved = localStorage.getItem(SETTINGS_KEY);
            if (saved) {
                return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.warn('Failed to load settings:', e);
        }
        return { ...DEFAULT_SETTINGS };
    }

    saveSettings() {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
            return true;
        } catch (e) {
            console.warn('Failed to save settings:', e);
            return false;
        }
    }

    setSetting(key, value) {
        this.settings[key] = value;
        this.saveSettings();
    }

    getSetting(key) {
        return this.settings[key];
    }

    // Stats tracking
    updateStats(gameResult) {
        this.data.totalGames++;
        this.data.totalBlocksMined += gameResult.blocksMined || 0;
        this.data.totalEarnings += gameResult.earnings || 0;

        if (gameResult.day > this.data.highScore) {
            this.data.highScore = gameResult.day;
        }

        if (gameResult.multiplier > this.data.bestMultiplier) {
            this.data.bestMultiplier = gameResult.multiplier;
        }

        if (gameResult.sharksCount > this.data.maxSharksJuggled) {
            this.data.maxSharksJuggled = gameResult.sharksCount;
        }

        this.save();
    }

    getHighScore() {
        return this.data.highScore;
    }

    getStats() {
        return { ...this.data };
    }

    // Reset
    resetProgress() {
        this.data = { ...DEFAULT_SAVE };
        this.save();
    }

    resetSettings() {
        this.settings = { ...DEFAULT_SETTINGS };
        this.saveSettings();
    }
}

// Global instance
export const saveSystem = new SaveSystem();
