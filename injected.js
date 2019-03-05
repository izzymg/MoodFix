// Functions injected into DOM to be used by any content script

function mfOnDomContentLoaded() {
  console.log(document.readyState);
  if(document.readyState == "complete" || document.readyState == "interactive") return;
  return new Promise((resolve, reject) => {
    setTimeout(reject, 10000);
    document.addEventListener("DOMContentLoaded", resolve);
  });
}

function mfOnTime(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}