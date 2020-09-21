/*
    Source of a lot of the code in this file: https://github.com/fregante/content-scripts-register-polyfill/blob/master/index.ts
    Source of regex pattern matching: https://github.com/fregante/webext-patterns/blob/master/index.ts
    TODO include the license of these bits of code
 */
const polyFillBrowser = {};
if (typeof browser == 'undefined' || Object.getPrototypeOf(browser) !== Object.prototype && chrome) {
    polyFillBrowser.storage = {};
    polyFillBrowser.storage.local = {};
    polyFillBrowser.storage.local.get = function (keys) {
        return new Promise((resolve) => {
            chrome.storage.local.get(keys, (values) => {
                resolve(values);
            });
        });
    };
    polyFillBrowser.storage.local.set = function (list) {
        chrome.storage.local.set(list);
    };

    const patternValidationRegex = /^(https?|wss?|file|ftp|\*):\/\/(\*|\*\.[^*/]+|[^*/]+)\/.*$|^file:\/\/\/.*$|^resource:\/\/(\*|\*\.[^*/]+|[^*/]+)\/.*$|^about:/;

    function getRawRegex(matchPattern) {
        if (!patternValidationRegex.test(matchPattern)) {
            throw new Error(matchPattern + ' is an invalid pattern, it must match ' + String(patternValidationRegex));
        }

        let [, protocol, host, pathname] = matchPattern.split(/(^[^:]+:[/][/])([^/]+)?/);

        protocol = protocol
            .replace('*', 'https?') // Protocol wildcard
            .replace(/[/]/g, '[/]'); // Escape slashes

        host = (host ?? '') // Undefined for file:///
            .replace(/[.]/g, '[.]') // Escape dots
            .replace(/^[*]/, '[^/]+') // Initial or only wildcard
            .replace(/[*]$/g, '[^.]+'); // Last wildcard

        pathname = pathname
            .replace(/[/]/g, '[/]') // Escape slashes
            .replace(/[.]/g, '[.]') // Escape dots
            .replace(/[*]/g, '.*'); // Any wildcard

        return '^' + protocol + host + '(' + pathname + ')?$';
    }

    function patternToRegex(...matchPatterns) {
        return new RegExp(matchPatterns.map(getRawRegex).join('|'));
    }

    async function toPromise(fn, ...args) {
        return new Promise((resolve, reject) => {
            fn(...args, result => {
                if (chrome.runtime.lastError !== undefined) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(result);
                }
            });
        });
    }

    async function isAllowedOrigin(url) {
        return toPromise(chrome.permissions.contains, {
            origins: [new URL(url).origin + '/*']
        });
    }

    async function wasPreviouslyLoaded(tabId, loadCheck) {
        const result = await toPromise(chrome.tabs.executeScript, tabId, {
            code: loadCheck,
            runAt: 'document_start'
        });
        return result?.[0];
    }

    polyFillBrowser.contentScripts = {
        // The callback is only used by webextension-polyfill
        async register(contentScriptOptions) {
            const {
                js = [],
                css = [],
                allFrames,
                matchAboutBlank,
                matches,
                runAt
            } = contentScriptOptions;
            const loadCheck = `document[${JSON.stringify(JSON.stringify({js, css}))}]`;
            const listener = async function (tabId, {status}) {
                if (status !== 'loading') {
                    return;
                }
                const {url} = await toPromise(chrome.tabs.get, tabId);
                let matched = false;
                for (let i = 0; i < matches.length; i++) {
                    if (patternToRegex(matches[i]).test(url)) {
                        matched = true;
                        break;
                    }
                }
                if (!url || !await isAllowedOrigin(url) || await wasPreviouslyLoaded(tabId, loadCheck) || !matched) return;
                for (const file of css) {
                    chrome.tabs.insertCSS(tabId, {
                        ...file,
                        matchAboutBlank,
                        allFrames,
                        runAt: runAt ?? 'document_start'
                    });
                }
                chrome.tabs.executeScript(tabId, {
                    code: `${loadCheck} = true`,
                    runAt: 'document_start',
                    allFrames
                });
            };
            chrome.tabs.onUpdated.addListener(listener);
            const registeredContentScript = {
                async unregister() {
                    return toPromise(chrome.tabs.onUpdated.removeListener.bind(chrome.tabs.onUpdated), listener);
                }
            };
            return Promise.resolve(registeredContentScript);
        }
    };

    polyFillBrowser.permissions = {};
    polyFillBrowser.permissions.request = function (permission) {
        return new Promise((resolve) => {
            chrome.permissions.request(permission, (granted) => {
                resolve(granted);
            });
        });
    };

    polyFillBrowser.runtime = chrome.runtime;
} else {
    polyFillBrowser.storage = browser.storage;
    polyFillBrowser.contentScripts = browser.contentScripts;
    polyFillBrowser.runtime = browser.runtime;
    polyFillBrowser.permissions = browser.permissions;
}
