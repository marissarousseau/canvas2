function setMetaThemeColor()
{
  document.querySelector("[name='theme-color']").remove()
  var head = document.getElementsByTagName('HEAD')[0];
  var meta = document.createElement('meta');
  meta.setAttribute('name', 'theme-color');
  meta.content = 'black';
  head.appendChild(meta);
}

function setCSSVariables()
{
  var root = document.documentElement;
  root.style.setProperty('--cdm-primary-background-color', 'black');
  root.style.setProperty('--cdm-secondary-background-color', '#404040');
  root.style.setProperty('--cdm-primary-text-color', 'white');
  root.style.setProperty('--cdm-secondary-text-color', '#AAA');
  root.style.setProperty('--cdm-transition-speed', '.2s');
  root.style.setProperty('--cdm-alert-color', 'red');
  root.style.setProperty('--cdm-scrollbar-color', '#CCC');
  root.style.setProperty('--cdm-primary-button-color', '#404040');
  root.style.setProperty('--cdm-secondary-button-color', '#606060');
}


setMetaThemeColor();
setCSSVariables();
