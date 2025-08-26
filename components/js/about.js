/*
console.log('hi');
function initModalEdinititorIfNeeded(){
    console.log('hi init');
    document.addEventListener("DOMContentLoaded", function () {
        console.log('DOM this.lastModified.at.apply.');
        window.addEventListener("hashchange", () => {
            console.log("Hash changed to:", window.location.hash);
        });
    });
}

function onDOMReady(callback) {
    console.log('hi onready');
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback(); // DOM is already ready
  }
}

onDOMReady(() => {
    console.log('hi onreay callback');
  // Your Quill initialization or other code here
  initModalEdinititorIfNeeded()
});

function onPageChange() {
    console.log("Current page:", window.location.hash || window.location.pathname);
}

window.addEventListener("hashchange", onPageChange);
window.addEventListener("popstate", onPageChange);

// 1. Document Load
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Ready - Initialize App");
});

// 2. Page Fully Loaded
window.addEventListener("load", () => {
  console.log("Page Fully Loaded");
});

// 3. Visibility Changes (Tab Switch)
document.addEventListener("visibilitychange", () => {
  console.log(document.hidden ? "Page Hidden" : "Page Visible");
});

// 4. Navigation Changes (Hash or History)
window.addEventListener("hashchange", () => {
  console.log("Hash changed to:", window.location.hash);
});

window.addEventListener("popstate", () => {
  console.log("History changed:", window.location.pathname);
});

// 5. Leaving the Page
window.addEventListener("beforeunload", () => {
  console.log("User leaving page");
});

console.log("Query Selctor on about tab", document.querySelector("#home"))
document.addEventListener('page:enter', e => {
  console.log("Entered page:", e.target.className);
});

document.addEventListener('page:leave', e => {
  console.log("Left page:", e.target.className);
});
*/
