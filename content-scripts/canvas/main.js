function setProp(name, value, element = document.documentElement) {
    element.style.setProperty(name, value);
}

function injectVars(backgroundColor = defaultBackgroundColor, textColor = defaultTextColor) {
    setProp('--canvas-primary-background-color', backgroundColor);
    setProp('--ic-brand-primary-darkened-5', backgroundColor);
    setProp('--ic-brand-primary-darkened-10', backgroundColor);
    setProp('--ic-brand-primary-darkened-15', backgroundColor);
    setProp('--ic-brand-primary-lightened-5', backgroundColor);
    setProp('--ic-brand-primary-lightened-10', backgroundColor);
    setProp('--ic-brand-primary-lightened-15', backgroundColor);
    setProp('--ic-brand-button--primary-bgd-darkened-5', backgroundColor);
    setProp('--ic-brand-button--primary-bgd-darkened-15', backgroundColor);
    setProp('--ic-brand-button--secondary-bgd-darkened-5', backgroundColor);
    setProp('--ic-brand-button--secondary-bgd-darkened-15', backgroundColor);
    setProp('--ic-brand-font-color-dark-lightened-15', textColor);
    setProp('--ic-brand-font-color-dark-lightened-30', textColor);
    setProp('--ic-link-color-darkened-10', textColor);
    setProp('--ic-link-color-lightened-10', textColor);
    setProp('--ic-brand-primary', backgroundColor);
    setProp('--ic-brand-button--primary-text', textColor);
    setProp('--ic-brand-button--secondary-text', textColor);
    setProp('--ic-brand-global-nav-bgd', backgroundColor);
    setProp('--ic-brand-global-nav-ic-icon-svg-fill', textColor);
    setProp('--ic-link-color-darkened-10', textColor);
    setProp('--ic-brand-global-nav-ic-icon-svg-fill--active', backgroundColor);
    setProp('--ic-brand-global-nav-menu-item__text-color', textColor);
    setProp('--ic-brand-global-nav-menu-item__text-color--active', backgroundColor);
    setProp('--ic-brand-global-nav-avatar-border', textColor);
    setProp('--ic-brand-global-nav-menu-item__badge-bgd', backgroundColor);
    setProp('--ic-brand-global-nav-menu-item__badge-text', textColor);
    setProp('--ic-brand-global-nav-logo-bgd', backgroundColor);
    /*
    These three are special, might need a different color?
     */
    setProp('--ic-brand-font-color-dark', '#AAA');
    setProp('--ic-brand-button--primary-bgd', '#303030'); /*might be screwed up*/
    setProp('--ic-brand-button--secondary-bgd', '#303030'); /*might be screwed up*/
}

function loadFromStorage() {
    storage.get(keys).then(result => {
        const darkmode = result.darkmode === undefined ? defaultDarkMode : result.darkmode;
        console.log(darkmode);
        if (darkmode) {
            const bgColor = result.backgroundcolor || defaultBackgroundColor;
            const txtColor = result.textcolor || defaultTextColor;
            injectVars(bgColor, txtColor);
        }
    });
}
loadFromStorage();
