import { modeToggle } from './dom.js';

export function toggleMode() {
    const body = document.body;

    if (body.classList.contains("light-mode")) {
        body.classList.replace("light-mode", "dark-mode");
        modeToggle.textContent = "🌞";
    } else {
        body.classList.replace("dark-mode", "light-mode");
        modeToggle.textContent = "🌙";
    }
}
    