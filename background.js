// MoodFix background script
const ms = ms => new Promise(resolve => setTimeout(resolve, ms));

async function runHeaderFix() {
  chrome.tabs.executeScript({ file: "scripts/openEdit.js" });
  await ms(3000);
  chrome.tabs.executeScript({ file: "scripts/toggleHtml.js" });
  await ms(500);
  chrome.tabs.executeScript({ file: "scripts/headerFix.js" });
  await ms(2000);
  chrome.tabs.executeScript({ file: "scripts/toggleHtml.js" });
  chrome.tabs.executeScript({ file: "scripts/saveEdit.js" });
  await ms(200);
  chrome.runtime.sendMessage("done");
}

async function runMassD4ls() {
  let windowId;
  // Grab current window ID in case user unfocuses window
  chrome.tabs.query({ "active": true, "currentWindow": true }, function(tabs) {
    windowId = tabs[0].windowId;
  });
  // Await number of courses in category from script
  chrome.runtime.onMessage.addListener(async(message) => {
    if(message.courses) {
      // Loop through number of courses
      for(let courseNumber = 0; courseNumber < message.courses /* placeholder */; courseNumber++) {
        // Inject script to open course(n) in category
        chrome.tabs.executeScript({ file: "scripts/openCategoryCourse.js" });
        await ms(3000);
        // Send n to the script
        chrome.tabs.query({ "active": true, "windowId": windowId }, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { courseNumber, courses: message.courses });
        });
        // Await course load
        await ms(3000);
        // Go back
        chrome.tabs.executeScript({ file: "scripts/goBack.js" });
        await ms(3000);
      }
      chrome.runtime.sendMessage("done");
    }
  });
  // Inject script to send number of courses in category
  chrome.tabs.executeScript({ file: "scripts/getCategoryCourses.js" });
}

async function runD4lsTag() {
  chrome.tabs.executeScript({ file: "scripts/openSettings.js" });
  await ms(3000);
  chrome.tabs.executeScript({ file: "scripts/addD4lsTag.js" });
  await ms(500);
  chrome.tabs.executeScript({ file: "scripts/saveSettings.js" });
}

// Allow popup action when domain matches op moodle
chrome.declarativeContent.onPageChanged.removeRules(null, () => {
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
chrome.runtime.onMessage.addListener(async(message) => {
  switch(message) {
    case "startHeaderFix":
      await runHeaderFix();
      break;
    case "startD4lsTag":
      await runD4lsTag();
      break;
    case "startMassD4ls":
      await runMassD4ls();
      break;
  }
});