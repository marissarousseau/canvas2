const storage = polyFillBrowser.storage.local;
const defaultBackgroundColor = '#000000';
const defaultTextColor = '#ffffff';
const defaultDarkMode = true;
const defaultMatches = ['https://*.instructure.com/*', 'https://bruh.com/']

/**
 * A class that contains all the configuration options for this extension
 */
class CanvasDarkModeConfiguration {
    backgroundcolor;
    textcolor;
    darkmode;
    matches;
}

/**
 * Will return a promise that resolves to a {@link CanvasDarkModeConfiguration},
 * containing either the saved values or the default value for each respective field, but never an undefined value
 * @returns {Promise<CanvasDarkModeConfiguration>}
 */
async function getConfiguration() {
    const values = await storage.get(['settings']);
    let configuration;
    if (values.settings) {
        configuration = JSON.parse(values.settings);
    } else {
        configuration = {};
    }

    /*
    Set the default values if they are missing
     */
    if (!configuration.backgroundcolor) {
        configuration.backgroundcolor = defaultBackgroundColor;
    }
    if (!configuration.textcolor) {
        configuration.textcolor = defaultTextColor;
    }
    // Cannot use "!configuration.darkmode" here, because it is a boolean!
    if (configuration.darkmode === undefined) {
        configuration.darkmode = defaultDarkMode;
    }

    if (configuration.matches === undefined || configuration.matches.length === 0){
        configuration.matches = defaultMatches.slice();
    }

    return new Promise((resolve) => {
        resolve(configuration);
    });
}

/**
 * Set the stored values. If they are left out, no changes are made
 * @param config a {@link CanvasDarkModeConfiguration} containing the settings to be saved
 */

function saveConfiguration(config) {
    // Alternatively to throwing errors: insert default values
    if (!config.backgroundcolor) {
        throw new Error('No background color defined in CanvasDarkModeConfiguration argument!');
    }
    if (!config.textcolor) {
        throw new Error('No text color defined in CanvasDarkModeConfiguration argument!');
    }
    // Cannot use "!configuration.darkmode" here, because it is a boolean!
    if (config.darkmode === undefined) {
        throw new Error('No dark mode enabled defined in CanvasDarkModeConfiguration argument!');
    }
    polyFillBrowser.runtime.sendMessage(
        {action: "update-configuration", configuration: config}
    );
    storage.set({settings: JSON.stringify(config)});
}