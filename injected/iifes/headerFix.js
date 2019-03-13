(() => {

  let html;
  let headerText;
  let tag;
  
  chrome.runtime.sendMessage({ status: "Starting header fix" });

  try {
    // First child for text without an HTML tag, first ele for first html tag in section
    const firstEle = document.querySelector("#id_summary_editoreditable").firstElementChild;
    const firstChild = document.querySelector("#id_summary_editoreditable").firstChild;
    let sectionName = document.querySelector("#id_name_value").value || "Unknown Section Name";

    // If the first element and child are the same, we'll use the element
    if (firstEle.textContent === firstChild.textContent) {
      headerText = firstEle.textContent || sectionName;
      tag = firstEle.tagName;
    } else {
      // Use the raw text at the top
      headerText = firstChild.textContent || sectionName;
    }

    // Default if section has no content
    if (!firstEle || !firstEle.textContent) {
      headerText = sectionName;
    } else {

    }
    // Set HTML for header and trim excess white space
    html = `<div class="header1"><i class="fa fa-list" aria-hidden="true"></i>&nbsp;${headerText.trim()}</div>`;
  } catch (error) {
    console.error(error);
    return chrome.runtime.sendMessage({
      error: "Failed to grab first child"
    });
  }

  chrome.runtime.sendMessage({
    status: "Adding header1 class"
  });

  try {
    const textarea = document.querySelector("textarea#id_summary_editor");

    // If we found an HTML element at the top, slice up to its closing tag off and replace with header1
    if (tag) {
      const replaceTo = textarea.textContent.indexOf(`</${tag.toLowerCase()}>`) + tag.length + 3;
      textarea.value = html + textarea.textContent.slice(replaceTo);
    } else {
      // Otherwise just insert header one and splice of the length of the text
      textarea.value = html + textarea.textContent.slice(headerText.length);
    }
  } catch (error) {
    console.error(error);
    return chrome.runtime.sendMessage({
      error: "Failed to edit text area in editor"
    });
  }
})();