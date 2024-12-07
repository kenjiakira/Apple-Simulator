let ripeness = 0.5;
let soundEnabled = true;
const apple = document.getElementById('apple');
const appleStem = document.getElementById('apple-stem');
const appleLeaf = document.getElementById('apple-leaf');
const ripenessText = document.getElementById('ripeness-text');
const ripenessProgress = document.getElementById('ripeness-progress');
const infoDisplay = document.getElementById('info-display');
const soundToggle = document.getElementById('sound-toggle');
const ripeSound = document.getElementById('ripeSound');
const unripeSound = document.getElementById('unripeSound');
const rottenSound = document.getElementById('rottenSound');
const appleContainer = document.getElementById('apple-container');

const flies = [
    document.getElementById('fly1'),
    document.getElementById('fly2'),
    document.getElementById('fly3'),
    document.getElementById('fly4')
];

function toggleSound() {
    soundEnabled = !soundEnabled;
    soundToggle.textContent = soundEnabled ? '🔊' : '🔇';
}

function playSound(isRipe) {
    if (soundEnabled) {
        if (ripeness > 1) {
            rottenSound.volume = 0.2; 
            rottenSound.loop = true;  
            rottenSound.play();
        } else {
            rottenSound.loop = false;
            rottenSound.pause();
            rottenSound.currentTime = 0;
            
            if (isRipe) {
                ripeSound.volume = 0.3; 
                ripeSound.play();
            } else {
                unripeSound.volume = 0.3; 
                unripeSound.play();
            }
        }
    }
}


function toggleFlies(show) {
    flies.forEach(fly => {
        fly.style.opacity = show ? '1' : '0';
    });
}
appleContainer.addEventListener('mousemove', (event) => {
    const containerRect = appleContainer.getBoundingClientRect();
    const mouseX = event.clientX - containerRect.left;
    const mouseY = event.clientY - containerRect.top;

    flies.forEach((fly, index) => {
        const flyX = fly.offsetLeft;
        const flyY = fly.offsetTop;
        
        const distanceX = Math.abs(flyX - mouseX);
        const distanceY = Math.abs(flyY - mouseY);
        
        if (distanceX < 50 && distanceY < 50 && fly.style.opacity === '1') {
            fly.style.animation = 'flyAway 1s forwards';
            
            setTimeout(() => {
                fly.style.animation = 'fly 2s infinite linear';
                fly.style.animationDelay = `${index * 0.5}s`;
            }, 1000);
        }
    });
});

function changeRipeness(direction) {
    let oldRipeness = ripeness;

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

    let red, green, color, infoDetails;

    if (ripeness > 1) {
        red = 139; 
        green = 69;
        color = `rgb(${red}, ${green}, 19)`;  
        ripenessText.textContent = 'Độ Chín: Hỏng';
        infoDetails = 'Táo đã hỏng, có dấu hiệu mềm nhũn và mùi khó chịu. Không nên sử dụng.';    
        toggleFlies(true);
    } else {
        toggleFlies(false);
        red = Math.floor(255 * (0.5 + ripeness / 2));
        green = Math.floor(255 * (1 - ripeness));
        color = `rgb(${red}, ${green}, 0)`;  

        if (ripeness < 0.3) {
            ripenessText.textContent = 'Độ Chín: Xanh';
            infoDetails = 'Táo còn xanh, cứng và chưa chín. Không ngọt và có vị hơi chua.';
        } else if (ripeness < 0.7) {
            ripenessText.textContent = 'Độ Chín: Trung Bình';
            infoDetails = 'Táo đang trong giai đoạn chín dần. Bắt đầu có vị ngọt nhẹ và mềm hơn.';
        } else {
            ripenessText.textContent = 'Độ Chín: Chín Mọng';
            infoDetails = 'Táo chín hoàn toàn, rất ngọt và mềm. Thích hợp để ăn ngay.';
        }
    }

    apple.style.backgroundColor = color;
    appleStem.style.transform = `translateX(-50%) rotate(${-45 + Math.min(ripeness, 1) * 30}deg)`;  
    appleLeaf.style.transform = `translate(-50%, 0) rotate(${30 - Math.min(ripeness, 1) * 20}deg)`; 
    
    ripenessProgress.style.width = `${Math.min(ripeness, 1) * 100}%`;

    if (oldRipeness !== ripeness) {
        playSound(ripeness >= 0.7 && ripeness <= 1);  
    }
    document.getElementById('info-details').textContent = infoDetails;
}
