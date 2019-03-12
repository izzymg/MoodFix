// Adds D4LS to course settings

(() => { 
  chrome.runtime.sendMessage({ status: "Adding D4LS tag" });
  const tagHeader = document.querySelector("#id_tagshdr");
  window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
  try {
    tagHeader.classList.remove("collapsed");
    const tagInput = tagHeader.querySelector("input[type='text']");
    tagInput.value = "D4LS";
    // Moodle looks for the *keydown* event on this input field
    // To lock the tag in. Keyup wont work
    setTimeout(() => {
      tagInput.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    }, 300);
    return;
  } catch(error) {
    console.error(error);
    chrome.runtime.sendMessage({ error: "Failed to add D4LS tag" });
  }
})();