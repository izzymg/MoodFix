// MoodFix background script
const ms = ms => new Promise(resolve => setTimeout(resolve, ms));

async function addHeader(makeChild = false) {
  chrome.tabs.executeScript({ file: "injected/iifes/openEdit.js" });
  await ms(3000);
  chrome.tabs.executeScript({ file: "injected/iifes/toggleHtml.js" });
  await ms(500);
  chrome.tabs.executeScript({ file: "injected/iifes/headerFix.js" });
  if(makeChild) {
    chrome.tabs.executeScript({ file: "injected/iifes/makeChild.js" });
    await ms(200);
  }
  await ms(2000);
  chrome.tabs.executeScript({ file: "injected/iifes/toggleHtml.js" });
  chrome.tabs.executeScript({ file: "injected/iifes/saveEdit.js" });
  await ms(200);
  chrome.runtime.sendMessage("done");
}

async function makeChild() {
  chrome.tabs.executeScript({ file: "injected/iifes/openEdit.js" });
  await ms(3000);
  chrome.tabs.executeScript({ file: "injected/iifes/makeChild.js" });
  await ms(500);
  chrome.tabs.executeScript({ file: "injected/iifes/saveEdit.js" });
  await ms(200);
  chrome.runtime.sendMessage("done");
}

async function runMassD4ls() {
  let tabId;
  // Grab current tab ID in case user unfocuses window
  chrome.tabs.query({ "active": true, "currentWindow": true }, function(tabs) {
    tabId = tabs[0].id;
  });
  // Wait for category info
  chrome.runtime.onMessage.addListener(async(message) => {
    if(message.courses && message.url) {
      // Loop through number of courses
      for(let courseNumber = 0; courseNumber < message.courses; courseNumber++) {
        // Inject script to open course(n) in category
        chrome.tabs.executeScript(tabId, { file: "injected/functions/openCategoryCourse.js" });
        await ms(100);
        // Execute script with parameters
        chrome.tabs.executeScript(tabId, { code: `MoodFixOpenCategoryCourse(${courseNumber}, ${message.courses});` });
        // Await course load
        await ms(3500);
        // Run D4LS fix
        chrome.tabs.executeScript(tabId, { file: "injected/iifes/addD4lsTag.js" });
        await ms(1500);
        chrome.tabs.executeScript(tabId, { file: "injected/iifes/saveSettings.js" });
        await ms(2500);
        // Go back to category
        chrome.runtime.sendMessage({ status: "Going back to category" });
        chrome.tabs.executeScript(tabId, { code: `(() => { window.location.href = "${message.url}";})();` })
        await ms(2000);
      }
      chrome.runtime.sendMessage("done");
    }
  });
  // Inject script to send us category information
  chrome.tabs.executeScript(tabId, { file: "injected/iifes/sendCategoryInfo.js" });
}

async function runD4lsTag(tabId) {
  chrome.tabs.executeScript(tabId, { file: "injected/iifes/openSettings.js" });
  await ms(3000);
  chrome.tabs.executeScript(tabId, { file: "injected/iifes/addD4lsTag.js" });
  await ms(1500);
  chrome.tabs.executeScript(tabId, { file: "injected/iifes/saveSettings.js" });
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
    case "startAddHeader":
      await addHeader(false);
      break;
    case "startMakeChild":
      await makeChild();
      break;
    case "startHeaderChildFix":
      await addHeader(true);
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