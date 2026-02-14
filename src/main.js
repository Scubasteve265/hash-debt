// VIG - Main Entry Point
// Mine crypto. Pay sharks. Survive.

import { Game } from './game.js';

// Wait for DOM and fonts to load
async function init() {
    // Wait for fonts
    await document.fonts.ready;

    // Get canvas
    const canvas = document.getElementById('canvas');
    if (!canvas) {
        console.error('Canvas not found!');
        return;
    }

    // Create game instance
    const game = new Game(canvas);

    // Expose for debugging
    window.game = game;

    console.log('VIG initialized');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
