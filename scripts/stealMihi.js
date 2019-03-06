(() => {
  try {
    const mihi = document.querySelector(".op_mihi_block");
    const mihiScript = document.querySelector("#op_mihi_script");
    chrome.runtime.sendMessage({ status: "Stealing mihi script" });
    chrome.runtime.sendMessage({ mihi, mihiScript });
  } catch(error) {
    chrome.runtime.sendMessage({ error: "Failed to get mihi data" });
  }
})();