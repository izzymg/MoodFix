(() => {
  chrome.runtime.sendMessage({ status: "Going back" });
  window.history.back();
})();