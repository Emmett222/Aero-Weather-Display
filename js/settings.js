/**
 * Settings script for Aero Weather Display. 
 * Sets up the modal, then makes changes based on user input.
 * 
 * @author Emmett Grebe
 * @version 4-29-2026
 */

import { fetchWeather } from './api.js';
import { backgroundCycle } from './ui.js';

// Default settings.
export var twelveHour;
export var showSeconds;
export var showYear;

export var useF;

export var doCycle;
export var lightTime;
export var darkTime;

/**
 * Helper function to set up the eventListeners for the settings modal.
 */
export function modalSetup() {
    const modal = document.getElementById("settingsModal");
    const saveBtn = document.getElementById("saveBtn");
    const importSettings = document.getElementById("importSettings");
    const exportBtn = document.getElementById("exportBtn");
    const body = document.getElementById("body");

    body.addEventListener("keypress", () => modal.showModal());
    saveBtn.addEventListener('click', () => {
        saveSettings();
        modal.close();
    });
    importSettings.addEventListener('change', () => {
        importSettings();
    });
    exportBtn.addEventListener('click', () => {
        exportSettings();
    });
}

/**
 * Save settings in modal.
 */
export function saveSettings() {
    twelveHour = document.getElementById("12hourCheckbox").checked;
    showSeconds = document.getElementById("showSecondsCheckbox").checked;
    showYear = document.getElementById("showYearCheckbox").checked;

    useF = document.getElementById("tempType").checked;

    doCycle = document.getElementById("dayNight").checked;
    lightTime = document.getElementById("light").value;
    darkTime = document.getElementById("night").value;

    fetchWeather(twelveHour, useF);
    backgroundCycle(doCycle, lightTime, darkTime)
}

/**
 * Import settings helper.
 */
export function importSettings() {
    const fileInput = document.getElementById('importSettings');

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        // This runs once the file is fully read
        reader.onload = (e) => {
            try {
                // Convert the string back into a JS Object
                const settings = JSON.parse(e.target.result);

                // Apply your settings to the app
                console.log("Settings Loaded:", settings);
                applySettings(settings);
            } catch (err) {
                console.error("Error parsing JSON:", err);
                alert("Invalid settings file.");
            }
        };

        reader.readAsText(file);
    });
}

/**
 * Export settings helper.
 */
export function exportSettings() {
    const settingsData = {
        "twelveHour": twelveHour,
        "showSeconds": showSeconds,
        "showYear": showYear,
        "useF": useF,
        "doCycle": doCycle,
        "lightTime": lightTime,
        "darkTime": darkTime
    }

    const dataString = JSON.stringify(settingsData, null, 2);
    const blob = new Blob([dataString], { type: "application/json" })

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "AeroWeatherSettings";

    link.click();

    URL.revokeObjectURL(link.href);
}