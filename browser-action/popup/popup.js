const bgField = document.querySelector('#background-color');
const txtField = document.querySelector('#text-color');
const submitButton = document.querySelector('#submit');
const enabledCheckbox = document.querySelector('#enabled');

function setDefaults() {
    getAll().then(results => {
        bgField.value = results.backgroundcolor;
        txtField.value = results.textcolor;
        enabledCheckbox.checked = results.darkmode;
    });

}

async function saveAll() {
    set(bgField.value, txtField.value, enabledCheckbox.checked)
    // browser.tabs.reload(); // to reload the page automatically when settings are saved. Should probably not be enabled
}

document.addEventListener('DOMContentLoaded', setDefaults);
submitButton.addEventListener('click', saveAll);