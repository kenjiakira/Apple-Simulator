import { toggleSound } from './sound.js';
import { toggleMode } from './ui.js';
import { initializeFlies } from './flies.js';
import { updateAppleAppearance } from './apple.js';
import { soundToggle, modeToggle, appleContainer } from './dom.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeFlies();
    updateAppleAppearance();
});

soundToggle.addEventListener('click', toggleSound);
modeToggle.addEventListener('click', toggleMode);
