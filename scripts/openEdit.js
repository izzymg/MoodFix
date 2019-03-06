// Opens edit section

(() => { 
  const editDropdown = document.querySelector(".section_action_menu .dropdown .dropdown-menu");
  try {
    chrome.runtime.sendMessage({ status: "Opening section edit page" });
    editDropdown.classList.add("show");
    window.location.href = editDropdown.querySelector("a.edit").href;
    return;
  } catch(error) {
    console.error(error);
    chrome.runtime.sendMessage({ error: "Failed to open edit section page from dropdown, have you turned editing on?" });
  }
})();