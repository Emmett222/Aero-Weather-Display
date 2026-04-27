/**
 * Main script for Aero Weather Display. Links the JS scripts together.
 * 
 * @author Emmett Grebe
 * @version 3-29-2026
 */

import { fetchWeather } from './api.js';
import { updateTime, backgroundCycle } from './ui.js';
import { modalSetup } from './settings.js';

import { twelveHour } from './settings.js';
import { showSeconds } from './settings.js';
import { showYear } from './settings.js';

/**
 * Runs on boot, once all the elements are finished loading.
 * Calls the individual setup functions, then repeats them on their individual intervals.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initial calls:
    backgroundCycle();
    updateTime(twelveHour, showSeconds, showYear);
    fetchWeather();
    modalSetup();

    // Intervals:
    setInterval(() => {
        updateTime(twelveHour, showSeconds, showYear);
    }, 1000);      // Every second update time.
    setInterval(fetchWeather, 900000);  // Every 15 minutes update the weather.
    setInterval(backgroundCycle, 60000) // Every minute update cycle.
});