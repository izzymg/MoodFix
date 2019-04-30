(() => {

  let html;
  let headerText;
  
  chrome.runtime.sendMessage({ status: "Starting header fix" });

  try {
    // First child for text without an HTML tag, first ele for first html tag in section
    let sectionName = document.querySelector("#id_name_value").value || "Unknown Section Name";
    headerText = sectionName;

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
    textarea.value = html + textarea.textContent;
  } catch (error) {
    console.error(error);
    return chrome.runtime.sendMessage({
      error: "Failed to edit text area in editor"
    });
  }
})();