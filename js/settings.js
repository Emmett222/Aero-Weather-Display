/**
 * Settings script for Aero Weather Display. 
 * Sets up the modal, then makes changes based on user input.
 * 
 * @author Emmett Grebe
 * @version 4-29-2026
 */

import { fetchWeather } from './api.js';

// Default settings.
export var twelveHour = true;
export var showSeconds = true;
export var showYear = true;

export var useF = true;

export var doCycle = false;
export var lightTime = 7;
export var darkTime = 20;

/**
 * Helper function to set up the eventListeners for the settings modal.
 */
export function modalSetup() {
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

}

/**
 * Export settings helper.
 */
export function exportSettings() {

}