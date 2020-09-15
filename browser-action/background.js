const contentScriptContainer = {};

function startBackgroundCheckingProcess() {
    setInterval(checkDarkModeEnabled, 1000);
}

function checkDarkModeEnabled(){
    getAll().then(results => {
        if (results.darkmode && !contentScriptContainer.contentScript) {
            browser.contentScripts.register({
                matches: ['https://*.instructure.com/*'],
                css: [{file: '/content-scripts/canvas/main.css'}],
                runAt: 'document_start'
            }).then(value => {
                contentScriptContainer.contentScript = value;
            });
        } else if (!results.darkmode &&  contentScriptContainer.contentScript) {
            contentScriptContainer.contentScript.unregister().then(() => {
                contentScriptContainer.contentScript = undefined;
            });
        }
    })
}

checkDarkModeEnabled();
startBackgroundCheckingProcess();