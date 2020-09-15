const storage = browser.storage.local;
const defaultBackgroundColor = '#000000';
const defaultTextColor = '#ffffff';
const defaultDarkMode = true;
const keys = ['backgroundcolor', 'textcolor', 'darkmode'];

async function getAll() {
    const values = await storage.get(keys);
    const realValues = {};
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

function setAll(bgColor = defaultBackgroundColor, txtColor = defaultTextColor, dm = defaultDarkMode) {
    storage.set({backgroundcolor: bgColor});
    storage.set({textcolor: txtColor});
    storage.set({darkmode: dm});
}