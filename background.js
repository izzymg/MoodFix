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
  let tabId;
  // Grab current tab ID in case user unfocuses window
  chrome.tabs.query({ "active": true, "currentWindow": true }, function(tabs) {
    tabId = tabs[0].id;
  });
  // Await number of courses in category from script
  chrome.runtime.onMessage.addListener(async(message) => {
    if(message.courses && message.url) {
      // Loop through number of courses
      for(let courseNumber = 0; courseNumber < message.courses; courseNumber++) {
        // Inject script to open course(n) in category
        chrome.tabs.executeScript(tabId, { file: "scripts/openCategoryCourse.js" });
        await ms(250);
        // Send n to the script
        chrome.tabs.sendMessage(tabId, { courseNumber, courses: message.courses });
        // Await course load
        await ms(3500);
        // Run D4LS fix
        chrome.tabs.executeScript(tabId, { file: "scripts/addD4lsTag.js" });
        await ms(3000);
        chrome.tabs.executeScript(tabId, { file: "scripts/saveSettings.js" });
        await ms(3000);
        // Go back to category
        chrome.runtime.sendMessage({ status: "Going back to category" });
        chrome.tabs.executeScript(tabId, { code: `(() => { window.location.href = "${message.url}";})();` })
        await ms(1000);
      }
      chrome.runtime.sendMessage("done");
    }
  });
  // Inject script to send number of courses in category
  chrome.tabs.executeScript(tabId, { file: "scripts/getCategoryInfo.js" });
}

async function runD4lsTag(tabId) {
  chrome.tabs.executeScript(tabId, { file: "scripts/openSettings.js" });
  await ms(3000);
  chrome.tabs.executeScript(tabId, { file: "scripts/addD4lsTag.js" });
  await ms(1500);
  chrome.tabs.executeScript(tabId, { file: "scripts/saveSettings.js" });
  await ms(1000);
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
      chrome.tabs.query({ "active": true, "currentWindow": true }, function(tabs) {
        // Grab current tab ID and run
        runD4lsTag(tabs[0].id).then(() => {
          chrome.runtime.sendMessage("done");
        });
      });
      break;
    case "startMassD4ls":
      await runMassD4ls();
      break;
  }
});