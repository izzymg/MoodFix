// Edits the HTML of the section

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

  // Await page interactivity
  chrome.runtime.sendMessage({ status: "Waiting for page load" });
  try {
    await mfOnDomContentLoaded();
    await mfOnTime(2000);
  } catch(error) {
    return chrome.runtime.sendMessage({ error: "Waiting for page load failed, may have timed out" });
  }

  chrome.runtime.sendMessage({ status: "Checking HTML" });

  try {
    // First child for text without an HTML tag, first ele for first html tag in section
    const firstEle = document.querySelector("#id_summary_editoreditable").firstElementChild;
    const firstChild = document.querySelector("#id_summary_editoreditable").firstChild;

    // If the ele and child are the same, we'll use the ele
    if(firstEle.textContent === firstChild.textContent) {
      headerText = firstEle.textContent;
      tag = firstEle.tagName;
    } else {
      // Use the raw text at the top
      headerText = firstChild.textContent;
    }

    // Default if section has no content
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

    // If we found an HTML element at the top, slice up to its closing tag off and replace with header1
    if(tag) {
      const replaceTo = textarea.textContent.indexOf(`</${tag.toLowerCase()}>`) + tag.length + 3;
      textarea.textContent = html + textarea.textContent.slice(replaceTo);
    } else {
      // Otherwise just insert header one and splice of the length of the text
      textarea.textContent = html + textarea.textContent.slice(headerText.length);
    }
  } catch(error) {
    console.error(error);
    return chrome.runtime.sendMessage({ error: "Failed to edit text area in editor" });
  }


  toggleHtml();

})();