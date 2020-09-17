const bgField = document.querySelector('#background-color');
const txtField = document.querySelector('#text-color');
const submitButton = document.querySelector('#submit');
const enabledCheckbox = document.querySelector('#enabled');

function setDefaults() {
    getConfiguration().then(result => {
        bgField.value = result.backgroundcolor;
        txtField.value = result.textcolor;
        enabledCheckbox.checked = result.darkmode;
    });

}

async function saveAll() {
    const configuration = {};
    configuration.backgroundcolor = bgField.value;
    configuration.textcolor = txtField.value;
    configuration.darkmode = enabledCheckbox.checked;
    saveConfiguration(configuration);
    // browser.tabs.reload(); // to reload the page automatically when settings are saved. Should probably not be enabled
}

document.addEventListener('DOMContentLoaded', setDefaults);
submitButton.addEventListener('click', saveAll);