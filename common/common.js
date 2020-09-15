const storage = browser.storage.local;
const defaultBackgroundColor = '#000000';
const defaultTextColor = '#ffffff';
const defaultDarkMode = true;
const keys = ['backgroundcolor', 'textcolor', 'darkmode'];

/**
 * A class that contains all the configuration options for this extension
 */
class CanvasDarkModeConfiguration {
    backgroundcolor;
    textcolor;
    darkmode;
}

/**
 * Will return a promise that resolves to a CanvasDarkModeConfiguration,
 * containing either the saved values or the default value for each respective field
 * @returns {Promise<CanvasDarkModeConfiguration>}
 */
async function getAll() {
    const values = await storage.get(keys);
    const realValues = new CanvasDarkModeConfiguration();
    realValues.backgroundcolor = values.backgroundcolor || defaultBackgroundColor;
    realValues.textcolor = values.textcolor || defaultTextColor;
    if (values.darkmode !== undefined) {
        realValues.darkmode = values.darkmode;
    } else {
        realValues.darkmode = defaultDarkMode;
    }
    return new Promise((resolve) => {
        resolve(realValues);
    });
}

/**
 * Set the stored values. If they are left out, no changes are made
 * @param bgColor A hex string describing the primary background color
 * @param txtColor A hex string describing the primary text color
 * @param dm A boolean describing whether or not the dark mode should be enabled
 */

function set(bgColor, txtColor, dm) {
    if (bgColor) {
        storage.set({backgroundcolor: bgColor});
    }
    if (txtColor) {
        storage.set({textcolor: txtColor});
    }
    if (dm) {
        storage.set({darkmode: dm});
    }
}