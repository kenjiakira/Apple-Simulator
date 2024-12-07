import { ripeness, apple, appleStem, appleLeaf, ripenessText, ripenessProgress } from './dom.js';
import { toggleFlies } from './flies.js';
import { playSound } from './sound.js';

export function changeRipeness(direction) {
    const oldRipeness = ripeness;

    switch (direction) {
        case 'lighter':
            ripeness = Math.max(0, ripeness - 0.1);
            break;
        case 'darker':
            ripeness = Math.min(1.2, ripeness + 0.1);
            break;
        case 'reset':
            ripeness = 0.5;
            break;
    }

    updateAppleAppearance();

    if (oldRipeness !== ripeness) {
        playSound(ripeness >= 0.7 && ripeness <= 1, ripeness);
    }
}

export function updateAppleAppearance() {
    let red, green, color;

    if (ripeness > 1) {
        red = 139;
        green = 69;
        color = `rgb(${red}, ${green}, 19)`;
        ripenessText.textContent = 'Độ Chín: Hỏng';
        toggleFlies(true);
    } else {
        toggleFlies(false);
        red = Math.floor(255 * (0.5 + ripeness / 2));
        green = Math.floor(255 * (1 - ripeness));
        color = `rgb(${red}, ${green}, 0)`;

        if (ripeness < 0.3) {
            ripenessText.textContent = 'Độ Chín: Xanh';
        } else if (ripeness < 0.7) {
            ripenessText.textContent = 'Độ Chín: Trung Bình';
        } else {
            ripenessText.textContent = 'Độ Chín: Chín Mọng';
        }
    }

    apple.style.backgroundColor = color;
    appleStem.style.transform = `rotate(${-45 + Math.min(ripeness, 1) * 30}deg)`;
    appleLeaf.style.transform = `rotate(${30 - Math.min(ripeness, 1) * 20}deg)`;
    ripenessProgress.style.width = `${Math.min(ripeness, 1) * 100}%`;
}
