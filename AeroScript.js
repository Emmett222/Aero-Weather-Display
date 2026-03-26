/**
 * Script for Aero Weather Display.
 * 
 * @author Emmett Grebe
 * @version 3-25-2026
 */

/**
 * On load updates time and updates weather, then updates time every second and updates weather every 15 minutes.
 */
document.addEventListener('DOMContentLoaded', () => {
    backgroundCycle();
    updateTime();
    fetchWeather();
    modalSetup();

    setInterval(updateTime, 1000);      // Every second update time.
    setInterval(fetchWeather, 900000);  // Every 15 minutes update the weather.
    setInterval(backgroundCycle, 60000) // Every minute update cycle.
});

/**
 * Gets the time, and updates the clock at the top of the site.
 * 
 * @returns Nothing.
 */
function updateTime() {
    const timeH1 = document.getElementById("timeTitle")
    if (!timeH1) return;

    const currentTime = new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',            // Full digit, but not adding 0 to the front.
        minute: '2-digit',          // Full digit, adds 0 to the front.

        month: 'long',              // Full month string. e.g. March, May.
        day: 'numeric',             // Full digit, but not adding 0 to the front.
        year: 'numeric',            // Full digit, but not adding 0 to the front.

        hour12: true                // 12 hour clock. Shows AM and PM at the end.
    });
    timeH1.textContent = currentTime;
}

/**
 * Gets the location of the user.
 * 
 * @returns Latitude and longitude of user's browser.
 */
function getLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
            timeout: 5000,             // 5 seconds
            maximumAge: 3600000        // Hour
        });
    });
}

/**
 * Gets the weather from NWS. Adds the weather to the site. Shows next 16 hours.
 */
async function fetchWeather() {
    try {
        const position = await getLocation();
        const lat = position.coords.latitude.toFixed(4);
        const lon = position.coords.longitude.toFixed(4);

        const headers = { 'User-Agent': 'AeroWeatherDisplay/1.0 (Web Browser)' };

        // Get Grid Points
        const pointsResponse = await fetch(`https://api.weather.gov/points/${lat},${lon}`, { headers });
        if (!pointsResponse.ok) throw new Error("Could not find NWS grid.");
        const pointsData = await pointsResponse.json();

        // Fetch both Hourly and Weekly data
        const [hourlyRes, weeklyRes] = await Promise.all([
            fetch(pointsData.properties.forecastHourly, { headers }),
            fetch(pointsData.properties.forecast, { headers })
        ]);

        const hourlyData = await hourlyRes.json();
        const weeklyData = await weeklyRes.json();

        // --- HOURLY FORECAST ---
        const hourlyPeriods = hourlyData.properties.periods;
        for (let i = 0; i < 16; i++) {
            const weatherP = document.getElementById("WeatherP" + i);
            if (!weatherP) continue;

            const hour = hourlyPeriods[i];
            const time = new Date(hour.startTime).toLocaleTimeString([], { hour: 'numeric' });
            const emoji = getWeatherEmoji(hour.shortForecast);

            weatherP.innerHTML = `
                <h1 id="emoji">${emoji}</h1>
                <h1><em>${time}</h1>
                <h2>${hour.temperature}°${hour.temperatureUnit}</h2>
                <h4>Precipitation: ${hour.probabilityOfPrecipitation.value}%</h4>
            `;
        }

        // --- WEEKLY HIGH/LOW ---
        const weeklyPeriods = weeklyData.properties.periods;
        let dayIndex = 0;

        for (let i = 0; i < weeklyPeriods.length && dayIndex < 7; i++) {
            const period = weeklyPeriods[i];

            // If we start at night, skip the first entry so Day 0 starts with a High
            if (i === 0 && !period.isDaytime) continue;

            if (period.isDaytime) {
                const high = period.temperature;
                const nightPeriod = weeklyPeriods[i + 1];
                const low = nightPeriod ? nightPeriod.temperature : "N/A";

                const emoji = getWeatherEmoji(period.shortForecast);

                const dayDiv = document.getElementById("day" + dayIndex);
                if (dayDiv) {
                    if (period.name == "This Afternoon") {
                        dayDiv.innerHTML = `
                        <h1 id="emoji">${emoji}</h1>
                        <h1><strong>Today</strong></h1>
                        <h2>Day: ${high}°</h2>
                        <h2>Night: ${low}°</h2>
                        <h4>Precipitation: ${period.probabilityOfPrecipitation.value}%</h4>
                        `;
                    } else {
                        dayDiv.innerHTML = `
                        <h1 id="emoji">${emoji}</h1>
                        <h1><strong>${period.name}</strong></h1>
                        <h2>Day: ${high}°</h2>
                        <h2>Night: ${low}°</h2>
                        <h4>Precipitation: ${period.probabilityOfPrecipitation.value}%</h4>
                    `;
                    }
                }
                dayIndex++;
                i++; // Skip the night period since we just used it
            }
        }

    } catch (error) {
        console.error("NWS Error:", error);
        document.getElementById("WeatherP0").textContent = "Weather currently unavailable.";
    }
}

/**
 * Helper function to keep the main loop clean
 */
function getWeatherEmoji(forecast) {
    if (forecast.includes("Sunny")) return "☀️";
    if (forecast.includes("Mostly Clear")) return "🌤️";
    if (forecast.includes("Partly Cloudy") || forecast.includes("Partly Sunny")) return "⛅";
    if (forecast.includes("Mostly Cloudy")) return "🌥️";
    if (forecast.includes("Cloudy")) return "☁️";
    if (forecast.includes("Rain") || forecast.includes("Drizzle")) return "🌧️";
    if (forecast.includes("Thunderstorms")) return "⛈️";
    if (forecast.includes("Snow")) return "🌨️";
    return "🌡️"; // Default
}

/**
 * Changes the background based on the time.
 */
function backgroundCycle() {
    // Styles:
    const dayBackground = "linear-gradient(45deg, #66c7ed, #5ecc8c, #66e4ed)"
    const dayBorder = "border-color: aquamarine";
    const nightBackground = "linear-gradient(45deg, #224350, #2f6646, #285a5e)";
    const nightBorder = "rgb(73, 146, 122)";
    const backgroundSize = "400% 400%";

    // Elements:
    const body = document.getElementById("body");
    const timeContainer = document.getElementById("timeContainer");
    const topCards = document.getElementById("weatherContainerTop").children;
    const bottomCards = document.getElementById("weatherContainerBottom").children;

    const now = new Date();

    if ((now.getHours() >= 20) || (now.getHours() < 7)) { // Between 8PM -> 6AM

        body.style.background = nightBackground;
        body.style.backgroundSize = backgroundSize;      // Needs this because the color change shrinks the size.

        timeContainer.style.borderColor = nightBorder;

        for (let card of topCards) {
            card.style.borderColor = nightBorder;
        }
        for (let card of bottomCards) {
            card.style.borderColor = nightBorder;
        }
    } else {                                             // Between 7AM -> 8PM
        body.style.background = dayBackground;
        body.style.backgroundSize = backgroundSize;      // Needs this because the color change shrinks the size.

        timeContainer.style.borderColor = dayBorder;

        for (let card of topCards) {
            card.style.borderColor = dayBorder;
        }
        for (let card of bottomCards) {
            card.style.borderColor = dayBorder;
        }
    }
}

/**
 * Helper function to set up the eventListeners for the settings modal.
 */
function modalSetup() {
    const modal = document.getElementById("settingsModal");
    const saveBtn = document.getElementById("saveBtn");
    const importBtn  = document.getElementById("importBtn");
    const exportBtn  = document.getElementById("exportBtn");
    const body = document.getElementById("body");

    body.addEventListener("keypress", () => modal.showModal());
    saveBtn.addEventListener('click', () => {
        saveSettings();
        modal.close();
    });
    importBtn.addEventListener('click', () => {
        importSettings();
    });
    exportBtn.addEventListener('click', () => {
        exportSettings();
    });
}

/**
 * Save settings in modal.
 */
function saveSettings() {
    
}

/**
 * Import settings helper.
 */
function importSettings() {

}

/**
 * Export settings helper.
 */
function exportSettings() {

}