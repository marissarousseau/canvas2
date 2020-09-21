// TODO remove a domain from the list

const bgField = document.querySelector('#background-color');
const txtField = document.querySelector('#text-color');
const submitButton = document.querySelector('#submit');
const enabledCheckbox = document.querySelector('#enabled');
const enabledDomainList = document.querySelector('#enabled-domains');
const addDomainInput = document.querySelector('#domain-input');
const addDomainSubmit = document.querySelector('#domain-submit');
const domainTemplate = document.querySelector('#domain-template').content;
const removeSelectedButton = document.querySelector('#remove-selected');

const confCont = {};

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
        confCont.config.matches.push(addDomainInput.value);
        setValues();
    }
}

async function saveAll(requestNewPerms = true) {
    const configuration = confCont.config;
    configuration.backgroundcolor = bgField.value;
    configuration.textcolor = txtField.value;
    configuration.darkmode = enabledCheckbox.checked;

    /* A promise that checks if we have permission to add content scripts
    to all requested domains, and asks for permissions if we don't have it yet.
    Ugly and no async-await because the permissions model doesn't allow us to call
    permissions.request() from an async/await context, but does allow us to do it from
    a resolving promise (????).
    Should maybe try to make a single list of all domains that are to be requested,
    so only a single "allow" button has to be pressed
     */
    const requestPermissions = new Promise((resolve => {
        if (requestNewPerms) {
            const matches = configuration.matches;
            const allowedMatches = [];
            const notAllowedMatches = [];
            let count = 0;
            for (const match of matches) {
                const permission = {};
                permission.origins = [match];
                polyFillBrowser.permissions.request(permission).then(accepted => {
                    if (accepted) {
                        allowedMatches.push(match);
                    } else {
                        notAllowedMatches.push(match);
                    }
                }).then(() => {
                    count++;
                    if (count === matches.length) {
                        const lists = {};
                        lists.allowedMatches = allowedMatches;
                        lists.notAllowedMatches = notAllowedMatches;
                        resolve(lists);
                    }
                });
            }
        } else {
            const lists = {};
            lists.allowedMatches = configuration.matches;
            resolve(lists);
        }
    }));


    // TODO print error for non-allowed domains
    requestPermissions.then((result) => {
        configuration.matches = result.allowedMatches;
        saveConfiguration(configuration);
        loadConfiguration();
    });
    // browser.tabs.reload(); // to reload the page automatically when settings are saved. Should probably not be enabled
}

async function removeSelected() {
    const configuration = confCont.config;
    for (const child of enabledDomainList.children) {
        const checkBox = child.querySelector('#domain-checkbox');
        if (checkBox) {
            const set = checkBox.checked;
            if (set) {
                configuration.matches.splice(configuration.matches.indexOf(checkBox.domainname), 1);
                const permission = {};
                permission.origins = [checkBox.domainname];
                await polyFillBrowser.permissions.remove(permission);
            }
        }
    }
    await saveAll(false);
}

addDomainSubmit.addEventListener('click', addDomain);
submitButton.addEventListener('click', saveAll);
removeSelectedButton.addEventListener('click', removeSelected);
loadConfiguration();
