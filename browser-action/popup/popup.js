// TODO remove a domain from the list

const bgField = document.querySelector('#background-color');
const txtField = document.querySelector('#text-color');
const submitButton = document.querySelector('#submit');
const enabledCheckbox = document.querySelector('#enabled');
const enabledDomainList = document.querySelector('#enabled-domains');
const addDomainInput = document.querySelector('#domain-input');
const addDomainSubmit = document.querySelector('#domain-submit');

const confCont = {};

function setValues(configuration = confCont.config) {
    bgField.value = configuration.backgroundcolor;
    txtField.value = configuration.textcolor;
    enabledCheckbox.checked = configuration.darkmode;

    // Remove all children
    while (enabledDomainList.firstChild) {
        enabledDomainList.removeChild(enabledDomainList.firstChild);
    }

    // Add an entry for each domain
    for (const allowedUrl of configuration.matches) {
        const li = document.createElement('li');
        li.textContent = allowedUrl;
        enabledDomainList.appendChild(li);
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

async function saveAll() {
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
        const matches = configuration.matches;
        const allowedMatches = [];
        const notAllowedMatches = [];
        let count = 0;
        for (const match of matches) {
            console.log("Mane");
            const permission = {};
            permission.origins = [match];
            polyFillBrowser.permissions.request(permission).then(accepted => {
                console.log(count, accepted);
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
    }));


    // TODO print error for non-allowed domains
    requestPermissions.then((result) => {
        console.log('Resolved');
        configuration.matches = result.allowedMatches;
        saveConfiguration(configuration);
        loadConfiguration();
    });
    // browser.tabs.reload(); // to reload the page automatically when settings are saved. Should probably not be enabled
}

addDomainSubmit.addEventListener('click', addDomain);
submitButton.addEventListener('click', saveAll);
loadConfiguration();
