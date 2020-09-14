const bgField = document.querySelector('#background-color');
const txtField = document.querySelector('#text-color');
const submit = document.querySelector('#submit');

function setDefaults() {
    const bgValue = browser.storage.sync.get(['backgroundcolor', 'textcolor']);
    bgValue.then(result => {
        bgField.value = result.backgroundcolor || '#000000';
        txtField.value = result.textcolor || '#FFFFFF';
    });


}

function saveAll() {
    browser.storage.sync.set({backgroundcolor: bgField.value});
    browser.storage.sync.set({textcolor: txtField.value});
    browser.tabs.reload();
}

document.addEventListener('DOMContentLoaded', setDefaults);
submit.addEventListener('click', saveAll);