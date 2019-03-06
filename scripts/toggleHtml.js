// Toggles HTML editor 

(() => {
  try {
    chrome.runtime.sendMessage({ status: "Toggling HTML editor" });
    document.querySelector(".atto_html_button").click();
    return;
  } catch(error) {
    return chrome.runtime.sendMessage({ error: "Couldn't toggle HTML editor. Ensure editor is set to atto or remind me to make it work for other editors" });
  }
})();