function init() {
  const message = document.querySelector("#message");
  chrome.runtime.onMessage.addListener(function(received) {
    if(received.error) {
      message.classList.add("error");
      message.classList.remove("status");
      message.textContent = "Error: " + received.error;
    }
    if(received.status) {
      message.classList.remove("error");
      message.classList.add("status");
      message.textContent = received.status + "...";
    }
  });
  document.querySelector("#fixHeaderStart").addEventListener("click", function() {
    // Send fixHeaders event on click
    chrome.runtime.sendMessage("startHeaderFix");
  });
  document.querySelector("#devtest").addEventListener("click", function() {
    // Send fixHeaders event on click
    chrome.runtime.sendMessage("devtest");
  });
}

if(document.readyState == "complete") {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}