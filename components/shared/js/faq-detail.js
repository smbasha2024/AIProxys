function initializeListners(){
    //console.log('hello');
    
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    //console.log("Questions", faqQuestions.length);

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('.faq-icon');
            
            // Toggle current answer
            answer.classList.toggle('open');
            icon.classList.toggle('rotate');
            
            // Close other answers
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question) {
                    const otherAnswer = otherQuestion.nextElementSibling;
                    const otherIcon = otherQuestion.querySelector('.faq-icon');
                    
                    otherAnswer.classList.remove('open');
                    otherIcon.classList.remove('rotate');
                }
            });
        });
    });
    
    // Category filtering would be implemented here in a real scenario
    const categoryBtns = document.querySelectorAll('.faq-category-btn');
    //console.log('Category Buttons ', categoryBtns.length)
    categoryBtns.forEach(btn => {
        //console.log(btn);
        btn.addEventListener('click', () => {
            //console.log('Button listner');
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // Actual filtering implementation would go here

            const targetId = btn.getAttribute('data-target');
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
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
  //console.log('OnReady callback');
  initializeListners();
});