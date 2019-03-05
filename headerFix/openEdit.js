(async() => { 
  const editDropdown = document.querySelector(".section_action_menu .dropdown .dropdown-menu");
  chrome.runtime.sendMessage({ status: "Starting header fix" });
  try {
    chrome.runtime.sendMessage({ status: "Opening section edit page" });
    editDropdown.classList.add("show");
    chrome.runtime.sendMessage("editHtml");
    window.location.href = editDropdown.querySelector("a.edit").href;
  } catch(error) {
    console.error(error);
    chrome.runtime.sendMessage({ error: "Failed to open edit section page from dropdown" });
  }
})() 
