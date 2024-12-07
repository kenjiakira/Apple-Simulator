// Global variables
let ripeness = 0.5; 
let soundEnabled = true;

// DOM Elements
const apple = document.querySelector('.apple');
const appleStem = document.querySelector('.apple-stem');
const appleLeaf = document.querySelector('.apple-leaf');
const ripenessText = document.getElementById('ripeness-text');
const ripenessProgress = document.getElementById('ripeness-progress');
const infoDisplay = document.getElementById('info-display');
const soundToggle = document.getElementById('sound-toggle');
const ripeSound = document.getElementById('ripeSound');
const unripeSound = document.getElementById('unripeSound');
const rottenSound = document.getElementById('rottenSound');
const appleContainer = document.querySelector('.apple-container');
const modeToggle = document.getElementById('mode-toggle');

const flies = [
    document.getElementById('fly1'),    
    document.getElementById('fly2'),
    document.getElementById('fly3'),
    document.getElementById('fly4')
];

function toggleSound() {
    soundEnabled = !soundEnabled;
    soundToggle.textContent = soundEnabled ? '🔊' : '🔇';
    
    if (!soundEnabled) {
        stopAllSounds();
    }
}

function stopAllSounds() {
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


function playSound(isRipe) {
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

function initializeFlies() {
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

function updateFlyPositions(event) {
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

function toggleFlies(show) {
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
 
function changeRipeness(direction) {
    const oldRipeness = ripeness;

    switch(direction) {
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
        playSound(ripeness >= 0.7 && ripeness <= 1);
    }
}

function updateAppleAppearance() {
    let red, green, color, infoDetails;

    if (ripeness > 1) {
        red = 139;
        green = 69;
        color = `rgb(${red}, ${green}, 19)`;
        ripenessText.textContent = 'Độ Chín: Hỏng';
        infoDetails = 'Táo đã hỏng, có mùi khó chịu. Không nên sử dụng.';
        toggleFlies(true);
    } else {
        toggleFlies(false);
        red = Math.floor(255 * (0.5 + ripeness / 2));
        green = Math.floor(255 * (1 - ripeness));
        color = `rgb(${red}, ${green}, 0)`;

        if (ripeness < 0.3) {
            ripenessText.textContent = 'Độ Chín: Xanh';
            infoDetails = 'Táo còn xanh, cứng và chưa chín. Không ngọt và có vị chua.';
        } else if (ripeness < 0.7) {
            ripenessText.textContent = 'Độ Chín: Trung Bình';
            infoDetails = 'Táo đang trong giai đoạn chín dần. Bắt đầu có vị ngọt và mềm.';
        } else {
            ripenessText.textContent = 'Độ Chín: Chín Mọng';
            infoDetails = 'Táo chín hoàn toàn, rất ngọt và mềm. Thích hợp để ăn ngay.';
        }
    }

    apple.style.backgroundColor = color;
    appleStem.style.transform = `translateX(-50%) rotate(${-45 + Math.min(ripeness, 1) * 30}deg)`;
    appleLeaf.style.transform = `translate(-50%, 0) rotate(${30 - Math.min(ripeness, 1) * 20}deg)`;
    ripenessProgress.style.width = `${Math.min(ripeness, 1) * 100}%`;
    document.getElementById('info-details').textContent = infoDetails;
}

function toggleMode() {
    const body = document.body;
    
    if (body.classList.contains("light-mode")) {
        body.classList.remove("light-mode");
        body.classList.add("dark-mode");
        modeToggle.textContent = "🌞";
    } else {
        body.classList.remove("dark-mode");
        body.classList.add("light-mode");
        modeToggle.textContent = "🌙";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeFlies();
    updateAppleAppearance();
});

appleContainer.addEventListener('mousemove', updateFlyPositions);
soundToggle.addEventListener('click', toggleSound);
modeToggle.addEventListener('click', toggleMode);

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
    modeToggle.textContent = "🌞";
} else {
    document.body.classList.add('light-mode');
    modeToggle.textContent = "🌙";
}