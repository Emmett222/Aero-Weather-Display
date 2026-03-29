/**
 * API script for Aero Weather Display. 
 * Does all work with APIs and location.
 * 
 * @author Emmett Grebe
 * @version 3-29-2026
 */

/**
 * Gets the location of the user.
 * 
 * @returns Latitude and longitude of user's browser.
 */
export function getLocation() {
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
export async function fetchWeather() {
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