// Waits for the index wanted to be opened and opens it

(async () => {
  chrome.runtime.sendMessage({ status: "Waiting on course number" });
  const onCourseNumber = new Promise(resolve => {
    chrome.runtime.onMessage.addListener(msg => {
      if(msg.hasOwnProperty("courseNumber")) resolve({ courseNumber: msg.courseNumber, numCourses: msg.courses});
    });
  });

  const { courseNumber, numCourses } = await onCourseNumber;
  const courses = document.querySelectorAll(".courses .coursename");
  chrome.runtime.sendMessage({ status: `Opening course ${courseNumber + 1}/${numCourses}` });
  console.log(courses[courseNumber].firstElementChild.href);
  window.location.href = courses[courseNumber].firstElementChild.href.replace("view", "edit");
})();