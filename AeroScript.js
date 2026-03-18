document.addEventListener('DOMContentLoaded', () => {
    updateTime();
    setInterval(updateTime, 1000);
});

function updateTime() {
    const timeH1 = document.getElementById("Time")
    if (!timeH1) return;

    const currentTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',

        month: 'long',
        day: 'numeric',
        year: 'numeric',
        
        hour12: false
    });
    timeH1.textContent = currentTime;
}