let ripeness = 0.5; 
let soundEnabled = true;

const apple = document.querySelector('.apple');
const appleStem = document.querySelector('.apple-stem');
const appleLeaf = document.querySelector('.apple-leaf');
const ripenessText = document.getElementById('ripeness-text');
const ripenessProgress = document.getElementById('ripeness-progress');
const soundToggle = document.getElementById('sound-toggle');
const ripeSound = document.getElementById('ripeSound');
const unripeSound = document.getElementById('unripeSound');
const rottenSound = document.getElementById('rottenSound');
const appleContainer = document.querySelector('.apple-container');

const flies = [
    document.getElementById('fly1'),    
    document.getElementById('fly2'),
    document.getElementById('fly3'),
    document.getElementById('fly4')
];

export function toggleSound() {
    soundEnabled = !soundEnabled;
    soundToggle.textContent = soundEnabled ? '🔊' : '🔇';
    
    if (!soundEnabled) {
        stopAllSounds();
    }
}

export function playSound(isRipe) {
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
}

function stopAllSounds() {
    rottenSound.pause();
    ripeSound.pause();
    unripeSound.pause();
    rottenSound.currentTime = 0;
    ripeSound.currentTime = 0;
    unripeSound.currentTime = 0;
}

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

export function updateFlyPositions(event) {
    const appleRect = apple.getBoundingClientRect();
    const mouseX = event.clientX - appleRect.left;
    const mouseY = event.clientY - appleRect.top;

    flies.forEach((fly, index) => {
        if (!fly.classList.contains('escaping') && fly.style.opacity === '1') {
            const flyRect = fly.getBoundingClientRect();
            const flyX = flyRect.left - appleRect.left;
            const flyY = flyRect.top - appleRect.top;

            const distance = Math.sqrt(
                Math.pow(mouseX - flyX, 2) + 
                Math.pow(mouseY - flyY, 2)
            );

            if (distance < 30) {
                escapeFly(fly, index, appleRect);
            }
        }
    });
}

function escapeFly(fly, index, appleRect) {
    fly.classList.add('escaping');
    fly.style.animation = 'flyAway 1s forwards';

    setTimeout(() => {
        fly.style.opacity = '0';
        fly.classList.remove('escaping');
        
        setTimeout(() => {
            resetFlyPosition(fly, appleRect, index);
        }, 1000);
    }, 1000);
}

function resetFlyPosition(fly, appleRect, index) {
    const appleRadius = appleRect.width / 2;
    const angle = (Math.random() * Math.PI * 2);
    const distance = appleRadius * 0.6 * Math.random();
    
    const x = appleRect.width / 2 + Math.cos(angle) * distance;
    const y = appleRect.height / 2 + Math.sin(angle) * distance;
    
    fly.style.left = `${x}px`;
    fly.style.top = `${y}px`;
    fly.style.animation = 'fly 3s infinite';
    fly.style.animationDelay = `${index * 0.5}s`;
    fly.style.opacity = '1';
}
