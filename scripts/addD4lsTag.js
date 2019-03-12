// Adds D4LS to course settings

(() => { 
  chrome.runtime.sendMessage({ status: "Adding D4LS tag" });
  try {
    const tagHeader = document.querySelector("#id_tagshdr");
    window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
    tagHeader.classList.remove("collapsed");
    const tagList = tagHeader.querySelector(".form-autocomplete-downarrow");
    tagList.click();
    setTimeout(() => {
      const d4ls = tagHeader.querySelector(".form-autocomplete-suggestions li[data-value='D4LS']");
      d4ls.click();
      console.log(d4ls);
    }, 500);
  } catch(error) {
    console.error(error);
    chrome.runtime.sendMessage({ error: "Failed to add D4LS tag" });
  }
})();