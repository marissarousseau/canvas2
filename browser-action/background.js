const contentScriptsArray = [];

function handleMessage(request, sender, sendResponse) {
    console.log(request);
    if (request.action && request.action === 'update-configuration') {
        if (request.configuration) {
            const config = request.configuration;
            checkDarkModeEnabled(config);
        }
    }
}

function contentScriptExists(match) {
    for (const contentScriptContainer of contentScriptsArray) {
        if (contentScriptContainer.match === match) {
            return true;
        }
    }
    return false;
}

async function checkDarkModeEnabled(configuration) {
    if (configuration.darkmode) {
        /*
         This is here (and not in popup.js) because the content scripts only live as long as the environment
         that called them, and the popup's environment ends each time it is closed
         */

        for (const match of configuration.matches) {
            if (!contentScriptExists(match)) {
                const contentScriptContainer = {};
                const contentScriptOptions = {};
                contentScriptOptions.matches = [match];
                contentScriptOptions.css = [{file: '/content-scripts/canvas/main.css'}];
                contentScriptOptions.js = [{file: '/content-scripts/canvas/main.js'}];
                contentScriptOptions.allFrames = true;
                contentScriptOptions.runAt = 'document_start';
                contentScriptContainer.match = match;
                contentScriptContainer.contentScript = await polyFillBrowser.contentScripts.register(contentScriptOptions);
                contentScriptsArray.push(contentScriptContainer);
            }
        }
    } else {
        for (const container of contentScriptsArray) {
            await container.contentScript.unregister();
            contentScriptsArray.splice(contentScriptsArray.indexOf(container), 1);
        }
    }
}

polyFillBrowser.runtime.onMessage.addListener(handleMessage);
getConfiguration().then((config) => {
    checkDarkModeEnabled(config);
});
