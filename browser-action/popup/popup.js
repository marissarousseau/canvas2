// TODO remove a domain from the list

const bgField = document.querySelector('#background-color');
const txtField = document.querySelector('#text-color');
const saveButton = document.querySelector('#submit');
const enabledCheckbox = document.querySelector('#enabled');
const enabledDomainList = document.querySelector('#enabled-domains');
const addDomainInput = document.querySelector('#domain-input');
const addDomainSubmit = document.querySelector('#domain-submit');
const domainTemplate = document.querySelector('#domain-template').content;
const removeSelectedButton = document.querySelector('#remove-selected');

const confCont = {};

function setProp(name, value, element = document.documentElement) {
    element.style.setProperty(name, undefined);
    element.style.setProperty(name, value);
}

function setValues(configuration = confCont.config) {
    bgField.value = configuration.backgroundcolor;
    txtField.value = configuration.textcolor;
    enabledCheckbox.checked = configuration.darkmode;

    // Save the title element
    const title = enabledDomainList.querySelector('#enabled-domains-title');

    // Remove all children
    while (enabledDomainList.firstChild) {
        const child = enabledDomainList.firstChild;
        enabledDomainList.removeChild(child);
    }

    enabledDomainList.appendChild(title);

    // Add an entry for each domain
    for (const allowedUrl of configuration.matches) {
        const template = domainTemplate.cloneNode(true);
        const domainName = template.querySelector('#domain-name');
        const checkBox = template.querySelector('#domain-checkbox');

        domainName.textContent = allowedUrl;
        if (!defaultMatches.includes(allowedUrl)) {
            checkBox.domainname = allowedUrl;
        } else {
            checkBox.remove();
        }
        enabledDomainList.appendChild(template);
    }

    setProp('--canvas-text-color', configuration.textcolor);
    setProp('--canvas-background-color', configuration.backgroundcolor);
}

function loadConfiguration() {
    getConfiguration().then(result => {
        confCont.config = result;
        setValues();
    });
}

function addDomain() {
    // TODO add input validation
    if (!confCont.config.matches.includes(addDomainInput.value)) {
        const match = addDomainInput.value;
        const permission = {};
        permission.origins = [match];
        polyFillBrowser.permissions.request(permission).then(accepted => {
            if (accepted) {
                confCont.config.matches.push(addDomainInput.value);
            }
            console.log(confCont.config.matches);
            saveAll().then(() => {
                loadConfiguration();
            });
        });
    }
}

async function saveAll() {
    const configuration = confCont.config;
    configuration.backgroundcolor = bgField.value;
    configuration.textcolor = txtField.value;
    configuration.darkmode = enabledCheckbox.checked;
    saveConfiguration(configuration);
    setValues();
    // browser.tabs.reload(); // to reload the page automatically when settings are saved. Should probably not be enabled
}

async function removeSelected() {
    const configuration = confCont.config;
    for (const child of enabledDomainList.children) {
        const checkBox = child.querySelector('#domain-checkbox');
        if (checkBox && checkBox.checked) {
            configuration.matches.splice(configuration.matches.indexOf(checkBox.domainname), 1);
            const permission = {};
            permission.origins = [checkBox.domainname];
            await polyFillBrowser.permissions.remove(permission);
        }
    }
    await saveAll(false);
    loadConfiguration();
}

addDomainSubmit.addEventListener('click', addDomain);
saveButton.addEventListener('click', saveAll);
removeSelectedButton.addEventListener('click', removeSelected);
loadConfiguration();
