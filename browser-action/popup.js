const bgField = document.querySelector('#background-color');
const txtField = document.querySelector('#text-color');
const submitButton = document.querySelector('#submit');
const enabledCheckbox = document.querySelector('#enabled');

function setDefaults() {
    const stringQuery = storage.get(keys);
    stringQuery.then(results => {
        bgField.value = results.backgroundcolor || defaultBackgroundColor;
        txtField.value = results.textcolor || defaultTextColor;
        if (results.darkmode !== undefined) {
            enabledCheckbox.checked = results.darkmode;
        } else {
            enabledCheckbox.checked = defaultDarkMode;
        }
    });

}

async function saveAll() {
    storage.set({backgroundcolor: bgField.value});
    storage.set({textcolor: txtField.value});
    storage.set({darkmode: enabledCheckbox.checked});

/*
    if (enabledCheckbox.checked) {
        browser.contentScripts.register({
            matches: ['https://!*.instructure.com/!*'],
            css: [{file: '/content-scripts/canvas/main.css'}],
            runAt: 'document_start'
        }).then(value => {
            contentScript = value;
            console.log(value);
        });
    } else if (contentScript) {
        contentScript.unregister().then(() => console.log('Unregistered the content script'));
    }
*/

    // browser.tabs.reload(); // to reload the page automatically when settings are saved. Should probably not be enabled
}

document.addEventListener('DOMContentLoaded', setDefaults);
submitButton.addEventListener('click', saveAll);