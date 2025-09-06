// FAQ toggle functionality
function toggleAnswer(element) {
    const answer = element.nextElementSibling;
    //const icon = element.querySelector('i');
    const icon = element.children[0]
    //console.log('Toggling answer for:', answer, icon, element.children[0]);
    if(answer) {
      if (answer.classList.contains('active')) {
          answer.classList.remove('active');
          if(icon) {
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
          }
      } else {
          answer.classList.add('active');
          if(icon){
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
          }
      }
    }
}

function initializeHelpListners() {
    const firstQuestion = document.querySelector('.faq-question');
    if (firstQuestion) {
        toggleAnswer(firstQuestion);
    }
}

function onDOMReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback(); // DOM is already ready
  }
}

onDOMReady(() => {
  // Your Quill initialization or other code here
  initializeHelpListners();
});


