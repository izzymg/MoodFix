// Opens course editing

(() => { 
  const dropDown = document.querySelector("#page-header .dropdown .dropdown-menu");
  try {
    chrome.runtime.sendMessage({ status: "Opening course settings page" });
    dropDown.classList.add("show");
    window.location.href = dropDown.firstElementChild.firstElementChild.href;
    return;
  } catch(error) {
    console.error(error);
    chrome.runtime.sendMessage({ error: "Failed to open course settings page from dropdown" });
  }
})();