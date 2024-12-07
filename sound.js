import { soundEnabled, soundToggle, rottenSound, ripeSound, unripeSound, flies } from './dom.js';

export function toggleSound() {
    soundEnabled = !soundEnabled;
    soundToggle.textContent = soundEnabled ? '🔊' : '🔇';

    if (!soundEnabled) {
        stopAllSounds();
    }
}

export function stopAllSounds() {
    rottenSound.pause();
    ripeSound.pause();
    unripeSound.pause();

    rottenSound.currentTime = 0;
    ripeSound.currentTime = 0;
    unripeSound.currentTime = 0;

    flies.forEach((fly, index) => {
        const flySound = document.getElementById(`flySound${index + 1}`);
        if (flySound) {
            flySound.pause();
            flySound.currentTime = 0;
        }
    });
}

export function playSound(isRipe, ripeness) {
    if (!soundEnabled) return;

    stopAllSounds();

    if (ripeness > 1) {
        rottenSound.volume = 0.2;
        rottenSound.loop = true;
        rottenSound.play();
    } else {
        if (isRipe) {
            ripeSound.volume = 0.3;
            ripeSound.play();
        } else {
            unripeSound.volume = 0.3;
            unripeSound.play();
        }
    }

    flies.forEach((fly, index) => {
        const flySound = document.getElementById(`flySound${index + 1}`);
        if (flySound && fly.style.opacity === '1') {
            flySound.volume = 0.3;
            flySound.play();
        }
    });
}
