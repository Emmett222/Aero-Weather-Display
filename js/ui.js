/**
 * User interface script for Aero Weather Display.
 * Cycles the background based on time and updates the clock.
 * 
 * @author Emmett Grebe
 * @version 4-27-2026
 */

/**
 * Changes the background based on the time.
 */
export function backgroundCycle(doCycle, lightTime, darkTime) {
    if (!doCycle) {
        return;
    }
    
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
 * Gets the time, and updates the clock at the top of the site.
 * 
 * @returns Nothing.
 */
export function updateTime(twelveHour, showSeconds, showYear) {
    const timeH1 = document.getElementById("timeTitle")
    if (!timeH1) return;

    let options = {
        hour: 'numeric',
        minute: '2-digit',
        month: 'long',
        day: 'numeric',
        
        hour12: twelveHour
    };

    if (showSeconds) {
        options.second = '2-digit'
    }

    if (showYear) {
        options.year = 'numeric';
    }

    timeH1.textContent = new Date().toLocaleTimeString('en-US', options);
}