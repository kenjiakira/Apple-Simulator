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

function toggleWeatherMenu() {
    const weatherControls = document.querySelector('.weather-controls');
    const weatherSettings = document.querySelector('.weather-settings');
    const weatherMenuBtn = document.getElementById('weather-menu-toggle');
    
    const isVisible = weatherControls.classList.contains('visible');
    
    weatherControls.classList.toggle('visible');
    weatherSettings.classList.toggle('visible');
    
    weatherMenuBtn.innerHTML = isVisible ? '🌡️' : '❌';
    weatherMenuBtn.setAttribute('aria-label', 
        isVisible ? 'Mở menu thời tiết' : 'Đóng menu thời tiết'
    );
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
const weatherConfig = {
    rain: {
        count: 100,
        speed: 1,
        intensity: 1,
        autoChange: true
    },
    snow: {
        count: 50,
        speed: 1,
        intensity: 1,
        autoChange: true
    }
};

let currentWeather = 'none';
let weatherInterval;

function createWeatherElement(type) {
    const element = document.createElement('div');
    element.className = type;
    
    element.style.left = `${Math.random() * 100}%`;
    
    const baseSpeed = type === 'rain' ? 0.75 : 4;
    const duration = (baseSpeed / weatherConfig[type].speed) * 
        (Math.random() * 0.5 + 0.75);
    
    element.style.animationDuration = `${duration}s`;
    
    const intensity = weatherConfig[type].intensity;
    const size = type === 'rain' ? 
        2 * intensity :  
        8 * intensity;   
    
    element.style.width = `${size}px`;
    if (type === 'rain') {
        element.style.height = `${100 * intensity}px`;
    } else {
        element.style.height = `${size}px`;
    }
    
    return element;
}

function startWeatherEffect(type, isManual = false) {
    const container = document.querySelector('.weather-container');
    if (currentWeather === type && !isManual) return;
    
    container.innerHTML = '';
    currentWeather = type;
    
    updateWeatherButtons(type);
    
    if (type === 'none') {
        document.querySelector('.apple').classList.remove('snowy');
        return;
    }

    const count = weatherConfig[type].count;
    for (let i = 0; i < count; i++) {
        const element = createWeatherElement(type);
        container.appendChild(element);
        
        element.addEventListener('animationend', () => {
            element.remove();
        });
    }

    document.querySelector('.apple').classList.toggle('snowy', type === 'snow');

    const interval = setInterval(() => {
        if (currentWeather !== type) {
            clearInterval(interval);
            return;
        }
        const element = createWeatherElement(type);
        container.appendChild(element);
        
        element.addEventListener('animationend', () => {
            element.remove();
        });
    }, type === 'rain' ? 50 : 200);
}

function updateWeatherButtons(activeWeather) {
    document.querySelectorAll('.weather-button').forEach(button => {
        button.classList.toggle('active', button.dataset.weather === activeWeather);
    });
}

function randomWeather() {
    if (!weatherConfig[currentWeather]?.autoChange) return;
    
    const weathers = ['none', 'rain', 'snow'];
    const newWeather = weathers[Math.floor(Math.random() * weathers.length)];
    startWeatherEffect(newWeather);
}

function updateWeatherSettings(type, setting, value) {
    weatherConfig[type][setting] = parseFloat(value);
    if (currentWeather === type) {
        startWeatherEffect(type, true);
    }
}

document.addEventListener('DOMContentLoaded', () => {
   
    if (!document.querySelector('.weather-container')) {
        const weatherContainer = document.createElement('div');
        weatherContainer.className = 'weather-container';
        document.querySelector('.apple-simulator').appendChild(weatherContainer);
    }
    
    const controlPanel = document.querySelector('.control-panel');
    
    const weatherControls = document.createElement('div');
    weatherControls.className = 'weather-controls';
    weatherControls.innerHTML = `
        <button class="weather-button active" data-weather="none">
            <span class="icon">🌞</span> Nắng
        </button>
        <button class="weather-button" data-weather="rain">
            <span class="icon">🌧</span> Mưa
        </button>
        <button class="weather-button" data-weather="snow">
            <span class="icon">🌨</span> Tuyết
        </button>
    `;
    
    const weatherSettings = document.createElement('div');
    weatherSettings.className = 'weather-settings';
    weatherSettings.innerHTML = `
        <div class="weather-setting-group">
            <label>Tốc độ rơi</label>
            <input type="range" min="0.5" max="2" step="0.1" value="1" class="weather-speed">
            <div class="weather-setting-value">1x</div>
        </div>
        <div class="weather-setting-group">
            <label>Cường độ</label>
            <input type="range" min="0.5" max="2" step="0.1" value="1" class="weather-intensity">
            <div class="weather-setting-value">1x</div>
        </div>
        <div class="weather-setting-group">
            <label>
                <input type="checkbox" class="weather-auto" checked>
                Tự động thay đổi sau 1 phút
            </label>
        </div>
    `;
    
    controlPanel.parentNode.insertBefore(weatherControls, controlPanel);
    controlPanel.parentNode.insertBefore(weatherSettings, controlPanel);
    
    weatherControls.addEventListener('click', (e) => {
        const button = e.target.closest('.weather-button');
        if (!button) return;
        
        const weather = button.dataset.weather;
        startWeatherEffect(weather, true);
        weatherSettings.classList.toggle('visible', weather !== 'none');
    });
    
    const speedInput = weatherSettings.querySelector('.weather-speed');
    const intensityInput = weatherSettings.querySelector('.weather-intensity');
    const autoInput = weatherSettings.querySelector('.weather-auto');
    
    speedInput.addEventListener('input', (e) => {
        const value = e.target.value;
        e.target.nextElementSibling.textContent = `${value}x`;
        if (currentWeather !== 'none') {
            updateWeatherSettings(currentWeather, 'speed', value);
        }
    });
    
    intensityInput.addEventListener('input', (e) => {
        const value = e.target.value;
        e.target.nextElementSibling.textContent = `${value}x`;
        if (currentWeather !== 'none') {
            updateWeatherSettings(currentWeather, 'intensity', value);
        }
    });
    
    autoInput.addEventListener('change', (e) => {
        if (currentWeather !== 'none') {
            weatherConfig[currentWeather].autoChange = e.target.checked;
        }
    });

    randomWeather();
    weatherInterval = setInterval(randomWeather, 60000);
});

window.addEventListener('beforeunload', () => {
    clearInterval(weatherInterval);
});
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