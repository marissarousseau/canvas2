const contentScriptContainer = {};

function startBackgroundCheckingProcess() {
    setInterval(checkDarkModeEnabled, 1000);
}

/**
 * Right now, neither 'browser' or 'browser.contentScripts' exists.
 * The appropriate name for 'browser' is 'chrome' for chromium-based browsers, and 'browser.contentScripts' does not
 * exist.
 * Solutions to the first problem could be: use a polyfill that makes 'browser' resolve to 'chrome' in chromium-based browsers (see https://github.com/mozilla/webextension-polyfill),
 * creating a separate background.js (and manifest.json?) for chromium-based browsers, a homebrew polyfill that only performs the tasks required for this project
 * is possible too
 *
 * Solutions to the second problem could be: use a polyfill that adds an equivalent of 'browser.contentScripts' for chromium-based
 * browsers (see https://github.com/fregante/content-scripts-register-polyfill), or creating a separate background.js (and manifest.json?) for chromium-based browsers
 */
function checkDarkModeEnabled(){
    getAll().then(result => {
        if (result.darkmode && !contentScriptContainer.contentScript) {
            polyFillBrowser.contentScripts.register({
                matches: ['https://*.instructure.com/*'],
                css: [{file: '/content-scripts/canvas/main.css'}],
                runAt: 'document_start',
                allFrames: true
            }).then(value => {
                contentScriptContainer.contentScript = value;
            });
        } else if (!result.darkmode && contentScriptContainer.contentScript) {
            contentScriptContainer.contentScript.unregister().then(() => {
                contentScriptContainer.contentScript = undefined;
            });
        }
    })
}

checkDarkModeEnabled();
startBackgroundCheckingProcess();