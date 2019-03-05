(async() => {

  function toggleHtml() {
    try {
      document.querySelector(".atto_html_button").click();
    } catch(error) {
      chrome.runtime.sendMessage({ error: "Couldn't open HTML editor. Ensure editor is set to atto or remind me to make it work for other editors" });
      throw error;
    }
  }

  let html;
  let headerText;
  let tag;

  chrome.runtime.sendMessage({ status: "Waiting for page load" });
  try {
    await mfOnDomContentLoaded();
    // Wait some time for the editor to become interactive, no event can be caught
    await mfOnTime(2000);
  } catch(error) {
    return chrome.runtime.sendMessage({ error: "Waiting for page load failed, may have timed out" });
  }

  chrome.runtime.sendMessage({ status: "Checking HTML" });
  try {
    const firstEle = document.querySelector("#id_summary_editoreditable").firstElementChild;
    const firstChild = document.querySelector("#id_summary_editoreditable").firstChild;

    // First element is an HTML element with a tag
    if(firstEle.textContent === firstChild.textContent) {
      // Grab text of element and tagname for searching later
      headerText = firstEle.textContent;
      tag = firstEle.tagName;
    } else {
      headerText = firstChild.textContent;
    }

    if(!firstEle || !firstEle.textContent) {
      // Use section name in value attribute of name change input as header text
      headerText = document.querySelector("#id_name_value").nodeValue; 
    } else {
      
    }
    html = `<div class="header1"><i class="fa fa-list" aria-hidden="true"></i>&nbsp;${headerText}</div>`;
  } catch(error) {
    console.error(error);
    return chrome.runtime.sendMessage({ error: "Failed to grab first child" });
  }

  toggleHtml();

  chrome.runtime.sendMessage({ status: "Adding header1 class" });

  try {
    const textarea = document.querySelector("textarea#id_summary_editor");
    if(tag) {
      // Grab index of the closing tag character (+ 3 for </>)
      const replaceTo = textarea.textContent.indexOf(`</${tag.toLowerCase()}>`) + tag.length + 3;
      textarea.textContent = html + textarea.textContent.slice(replaceTo);
    } else {
      textarea.textContent = html + textarea.textContent.slice(headerText.length);
    }
  } catch(error) {
    console.error(error);
    return chrome.runtime.sendMessage({ error: "Failed to edit text area in editor" });
  }

  toggleHtml();

})();