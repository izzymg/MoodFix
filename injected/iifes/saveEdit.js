(() => {
  chrome.runtime.sendMessage({ status: "Saving" });
  try {
    document.querySelector("#id_submitbutton").click();
  } catch (error) {
    console.error(error);
    return chrome.runtime.sendMessage({
      error: "Failed to save changes"
    });
  }
})();