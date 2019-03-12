// Sends the number of courses in a category

(async() => {
  const courses = document.querySelectorAll(".courses .coursename");
  chrome.runtime.sendMessage({ courses: courses.length });
})();