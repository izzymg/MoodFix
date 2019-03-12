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
    if(received === "done" || received == "cancel") {
      message.classList.remove("error", "status");
      message.textContent = "Moodle helper";
    }
  });
  document.querySelector("#fixHeaderStart").addEventListener("click", function() {
    // Send fixHeaders event on click
    chrome.runtime.sendMessage("startHeaderFix");
  });
  document.querySelector("#d4lsTagStart").addEventListener("click", function() {
    // Send fixHeaders event on click
    chrome.runtime.sendMessage("startD4lsTag");
  });

  document.querySelector("#massD4lsStart").addEventListener("click", function() {
    // Send fixHeaders event on click
    chrome.runtime.sendMessage("startMassD4ls");
  });
}

if(document.readyState == "complete") {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}