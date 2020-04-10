function prepareDarkTheme()
{
  var webNav = chrome.webNavigation.onCommitted;

  webNav.addListener
  (
    function()
    {
      try
      {
        chrome.tabs.executeScript({runAt: "document_start", file: "js/canvas.js"});
        chrome.tabs.insertCSS({runAt: "document_start", file: "css/canvas.css"});
      }
      catch(e)
      {
        console.log("Dark Mode for Canvas: This URL isn't a Canvas URL, so it will be ignored.");
      }
    }
  )
}

prepareDarkTheme();
