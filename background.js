// MoodFix background script
const ms = ms => new Promise(resolve => setTimeout(resolve, ms));

const onMihi = () => new Promise(resolve => 
  chrome.runtime.onMessage.addListener(received => {
    if(received.mihi) resolve(received);
  }
)); 

async function runHeaderFix() {
  chrome.tabs.executeScript({ file: "scripts/openEdit.js" });
  await ms(3000);
  chrome.tabs.executeScript({ file: "scripts/toggleHtml.js" });
  await ms(500);
  chrome.tabs.executeScript({ file: "scripts/headerFix.js" });
  await ms(2000);
  chrome.tabs.executeScript({ file: "scripts/toggleHtml.js" });
  chrome.tabs.executeScript({ file: "scripts/saveEdit.js" });
  await ms(500);
  chrome.runtime.sendMessage("done");
}

async function runMihiFix() {
  chrome.tabs.executeScript({ file: "scripts/openBlendedTemplate.js" });
  await ms(3000);
  chrome.tabs.executeScript({ file: "scripts/stealMihi.js" });
  const mihi = await onMihi();
  chrome.runtime.sendMessage("Got mihi");
  chrome.tabs.executeScript({ file: "scripts/goBack.js" });
  await ms(3000);
  chrome.tabs.executeScript({ file: "scripts/openEdit.js" });
  await ms(3000);
  chrome.tabs.executeScript({ file: "scripts/toggleHtml.js" });
  await ms(500);
  chrome.tabs.executeScript({ file: "scripts/mihiFix.js" });
  await ms(500);
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { mihi });
  });
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
    case "startMihiFix":
      await runMihiFix();
      break;
  }
});