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
        hour: '2-digit',
        minute: '2-digit',

        month: 'long',
        day: 'numeric',
        year: 'numeric',

        hour12: false
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
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

/**
 * Gets the weather from NWS. Adds the weather to the site. Shows next 16 hours.
 */
async function fetchWeather() {
    const weatherP = document.getElementById("WeatherP");


    try {
        const position = await getLocation();
        const lat = position.coords.latitude.toFixed(4);
        const lon = position.coords.longitude.toFixed(4);

        // Get the weather.
        const pointsResponse = await fetch(`https://api.weather.gov/points/${lat},${lon}`);
        if (!pointsResponse.ok) throw new Error("Could not find NWS grid for this location.");
        
        const pointsData = await pointsResponse.json(); // Turn the points data to JSON.

        const forecastUrl = pointsData.properties.forecastHourly; // Hourly forecast url using the pointsData.

        const forecastResponse = await fetch(forecastUrl); // Get the weather based off the points.
        const forecastData = await forecastResponse.json(); // Turn the forecast to JSON.

        // v Uncomment for debugging. v
        // console.log("Full Forecast:", forecastData);

        const periods = forecastData.properties.periods; // Get the periods of time.
        
        weatherP.innerHTML = "<strong>Next 16 Hours:</strong><br>";
        for (let i = 0; i < 16; i++) { // Current hour to 15 hours from now.
            const hour = periods[i];
            const time = new Date(hour.startTime).toLocaleTimeString([], { hour: 'numeric' });
            
            // Append each hour to the text
            weatherP.innerHTML += `${time}: ${hour.temperature}°${hour.temperatureUnit} - ${hour.shortForecast}<br>`;
        }

    } catch (error) {
        console.error("NWS Error:", error);
        weatherP.textContent = "NWS Weather currently unavailable.";
    }
}
