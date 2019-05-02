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
  document.querySelector("#addHeaderStart").addEventListener("click", function() {
    // Send addHeaders event on click
    chrome.runtime.sendMessage("startAddHeader");
  });
  document.querySelector("#addHeaderChildStart").addEventListener("click", function() {
    // Send addHeaders event on click
    chrome.runtime.sendMessage("startHeaderChildFix");
  });
  document.querySelector("#d4lsTagStart").addEventListener("click", function() {
    // Send addHeaders event on click
    chrome.runtime.sendMessage("startD4lsTag");
  });

  document.querySelector("#massD4lsStart").addEventListener("click", function() {
    // Send addHeaders event on click
    chrome.runtime.sendMessage("startMassD4ls");
  });
  
  document.querySelector("#makeChildStart").addEventListener("click", function() {
    // Send addHeaders event on click
    chrome.runtime.sendMessage("startMakeChild");
  });
}

if(document.readyState == "complete") {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}