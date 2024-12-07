import { toggleDarkMode } from './mode.js';
import { toggleSound, initializeFlies, updateFlyPositions } from './apple.js';
import { randomWeather, startWeatherEffect } from './weather.js';

document.addEventListener('DOMContentLoaded', () => {
    
    initializeFlies();
    updateAppleAppearance();
});

appleContainer.addEventListener('mousemove', updateFlyPositions);
soundToggle.addEventListener('click', toggleSound);
modeToggle.addEventListener('click', toggleDarkMode);

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
    modeToggle.textContent = "🌞"; 
} else {
    document.body.classList.add('light-mode');
    modeToggle.textContent = "🌙"; 
}

randomWeather();
