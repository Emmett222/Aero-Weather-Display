/**
 * Settings script for Aero Weather Display. 
 * Sets up the modal, then makes changes based on user input.
 * 
 * @author Emmett Grebe
 * @version 3-29-2026
 */

// Default settings.
export var twelveHour = true;
export var showSeconds = true;
export var showYear = true;

export var useF = true;

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