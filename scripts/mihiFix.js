(async() => {
  let mihi;
  chrome.runtime.onMessage.addListener(message => {
    if(message.mihi) {
      chrome.runtime.sendMessage({ status: "Fixing mihi" });
      mihi = message.mihi;
    }
  });
  
})();
