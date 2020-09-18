const contentScriptContainer = {};

function handleMessage(request, sender, sendResponse) {
    if (request.action && request.action === 'update-configuration') {
        if (request.configuration) {
            const config = request.configuration;
            checkDarkModeEnabled(config);
        }
    }
}

async function checkDarkModeEnabled(configuration) {
    if (configuration.darkmode && !contentScriptContainer.contentScript) {
        /*
         This is here (and not in popup.js) because the content scripts only live as long as the environment
         that called them, and the popup's environment ends each time it is closed
         */

        contentScriptContainer.contentScript = await polyFillBrowser.contentScripts.register({
            matches: configuration.matches,
            css: [{file: '/content-scripts/canvas/main.css'}],
            runAt: 'document_start',
            allFrames: true
        });
    } else if (!configuration.darkmode && contentScriptContainer.contentScript) {
        await contentScriptContainer.contentScript.unregister();
        contentScriptContainer.contentScript = undefined;
    }
}

polyFillBrowser.runtime.onMessage.addListener(handleMessage);
getConfiguration().then((config) => {
    checkDarkModeEnabled(config);
});
