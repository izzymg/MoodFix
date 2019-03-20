(() => {

  chrome.runtime.sendMessage({ status: "Starting desc fix" });

  const html = `<p></p><p>In class, your facilitator will introduce you to the topic. The online activities listed below support the course work.</p>`;

  try {
    const textarea = document.querySelector("textarea#id_summary_editor");
    // If we found an HTML element at the top, slice up to its closing tag off and replace with header1
    const replaceFrom = textarea.textContent.indexOf("</div>") + 6;
    const start = textarea.textContent.slice(0, replaceFrom);
    const end = textarea.textContent.slice(replaceFrom);
    textarea.value = start + html + end;
  } catch (error) {
    console.error(error);
    return chrome.runtime.sendMessage({
      error: "Failed to edit text area in editor"
    });
  }
})();