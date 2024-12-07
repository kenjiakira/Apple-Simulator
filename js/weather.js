
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

export function startWeatherEffect(type, isManual = false) {
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

export function randomWeather() {
    if (!weatherConfig[currentWeather]?.autoChange) return;
    
    const weathers = ['none', 'rain', 'snow'];
    const newWeather = weathers[Math.floor(Math.random() * weathers.length)];
    startWeatherEffect(newWeather);
}

function updateWeatherButtons(activeWeather) {
    document.querySelectorAll('.weather-button').forEach(button => {
        button.classList.toggle('active', button.dataset.weather === activeWeather);
    });
}

window.addEventListener('beforeunload', () => {
    clearInterval(weatherInterval);
});
