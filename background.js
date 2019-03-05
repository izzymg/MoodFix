// MoodFix background script

function injectEditHtml() {
  chrome.tabs.executeScript({
    file: "injected.js"
  });
  chrome.tabs.executeScript({
    file: "headerFix/editHtml.js"
  });
}

// Allow popup action when domain matches op moodle
chrome.declarativeContent.onPageChanged.removeRules(null, function () {
  chrome.declarativeContent.onPageChanged.addRules([{
    conditions: [new chrome.declarativeContent.PageStateMatcher({
      pageUrl: {
        hostEquals: "moodle.op.ac.nz"
      },
    })],
    actions: [new chrome.declarativeContent.ShowPageAction()]
  }]);
});

// Catch events and inject relevant scripts
chrome.runtime.onMessage.addListener((message) => {
  switch(message) {
    case "startHeaderFix":
      chrome.tabs.executeScript({
        file: "headerFix/openEdit.js"
      });
      break;
    case "editHtml":
      setTimeout(injectEditHtml, 3000);
  }
});