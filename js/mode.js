
export function toggleDarkMode() {
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
