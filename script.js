document.addEventListener('DOMContentLoaded', () => {
    const apple = document.querySelector('.apple-body');
    const instruction = document.querySelector('.instruction');
    let bites = 0;
    const maxBites = 100;

    function createBite(x, y, size) {
        const bite = document.createElement('div');
        bite.style.position = 'absolute';
        bite.style.width = `${size}px`;
        bite.style.height = `${size}px`;
        bite.style.borderRadius = '50%';
        bite.style.backgroundColor = '#f0f0f0';
        bite.style.top = `${y}%`;
        bite.style.left = `${x}%`;
        bite.style.transform = 'translate(-50%, -50%)';
        return bite;
    }

    function takeABite(event) {
        if (bites >= maxBites) return;

        const rect = apple.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;

        const biteSize = 40;
        const bite = createBite(x, y, biteSize);
        apple.appendChild(bite);

        bites++;

        if (bites === maxBites) {
            instruction.textContent = 'Bạn đã ăn hết quả táo!';
            apple.removeEventListener('click', takeABite);
        }
    }

    apple.addEventListener('click', takeABite);
});