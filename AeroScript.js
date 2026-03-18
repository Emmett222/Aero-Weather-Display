/**
 * On load updates time and updates weather, then updates time every second and updates weather every 15 minutes.
 */
document.addEventListener('DOMContentLoaded', () => {
    updateTime();
    fetchWeather();

    setInterval(updateTime, 1000); // Every second update time.
    setInterval(fetchWeather, 900000); // Every 15 minutes update the weather.
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

        const headers = {
            'User-Agent': 'AeroWeatherDisplay/1.0 (Web Browser)'
        };

        // Get the weather.
        const pointsResponse = await fetch(`https://api.weather.gov/points/${lat},${lon}`, { headers });
        if (!pointsResponse.ok) throw new Error("Could not find NWS grid for this location.");

        const pointsData = await pointsResponse.json();                 // Turn the points data to JSON.

        const forecastUrl = pointsData.properties.forecastHourly;       // Hourly forecast url using the pointsData.

        const forecastResponse = await fetch(forecastUrl, { headers }); // Get the weather based off the points.
        const forecastData = await forecastResponse.json();             // Turn the forecast to JSON.

        // v Uncomment for api debugging. v
        // console.log("Full Forecast:", forecastData);

        const periods = forecastData.properties.periods;                // Get the periods of time.

        for (let i = 0; i < 16; i++) {                                  // Current hour to 15 hours from now.
            const weatherP = document.getElementById("WeatherP" + i);
            const hour = periods[i];
            const time = new Date(hour.startTime).toLocaleTimeString([], { hour: 'numeric' });


            if (hour.shortForecast == "Sunny") weatherP.innerHTML = `<h1 id="emoji">☀️</h1>`;
            if (hour.shortForecast == "Mostly Clear") weatherP.innerHTML = `<h1 id="emoji">🌤️</h1>`;
            if (hour.shortForecast == "Partly Cloudy") weatherP.innerHTML = `<h1 id="emoji">⛅</h1>`;
            if (hour.shortForecast == "Mostly Cloudy") weatherP.innerHTML = `<h1 id="emoji">🌥️</h1>`;
            if (hour.shortForecast == "Cloudy") weatherP.innerHTML = `<h1 id="emoji">☁️</h1>`;

            if (hour.shortForecast.includes("Rain")) weatherP.innerHTML = `<h1 id="emoji">🌧️</h1>`;
            if (hour.shortForecast.includes("Thunderstorms")) weatherP.innerHTML = `<h1 id="emoji">⛈️</h1>`;
            if (hour.shortForecast.includes("Snow")) weatherP.innerHTML = `<h1 id="emoji">🌨️</h1>`;

            weatherP.innerHTML += `<h1><em>${time}</h1>`;
            weatherP.innerHTML += `<h2>${hour.temperature}°${hour.temperatureUnit}</h2>`;
            //weatherP.innerHTML += `<h4>${hour.shortForecast}</h4>`;
            weatherP.innerHTML += `<h4>Precipitation: ${hour.probabilityOfPrecipitation.value}%</h4>`;
        }

    } catch (error) {
        console.error("NWS Error:", error);
        weatherP.textContent = "NWS Weather currently unavailable.";
    }
}
