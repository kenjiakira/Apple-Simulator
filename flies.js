import { apple, flies } from './dom.js';

export function initializeFlies() {
    const appleRect = apple.getBoundingClientRect();
    const appleCenter = {
        x: appleRect.width / 2,
        y: appleRect.height / 2
    };
    const appleRadius = appleRect.width / 2;

    flies.forEach((fly, index) => {
        const angle = (index / flies.length) * Math.PI * 2;
        const distance = appleRadius * 0.6;
        const x = appleCenter.x + Math.cos(angle) * distance;
        const y = appleCenter.y + Math.sin(angle) * distance;

        fly.style.left = `${x}px`;
        fly.style.top = `${y}px`;
        fly.style.animation = 'fly 3s infinite';
        fly.style.animationDelay = `${index * 0.5}s`;
    });
}

export function toggleFlies(show) {
    if (show) {
        initializeFlies();
        flies.forEach(fly => fly.style.opacity = '1');
    } else {
        flies.forEach(fly => {
            fly.style.opacity = '0';
            fly.classList.remove('escaping');
        });
    }
}
