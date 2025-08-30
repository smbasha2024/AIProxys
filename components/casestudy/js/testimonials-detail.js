function initializeTestmonialListners(){
    // Category filtering would be implemented here in a real scenario
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // Actual filtering implementation would go here
            
            let targetId = btn.getAttribute('data-target');
            console.log(targetId);
            if(targetId === 'tm-all') targetId = 'tm-healthcare';
            console.log(targetId);
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            
        });
    });

    // Initialize with all testimonials shown
}

function initializeTmFilterListners(){
    const filterButtons = document.querySelectorAll('.filter-btn');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    // Filter testimonials based on category
    function filterTestimonials(category) {
        testimonialCards.forEach(card => {
            if (category === 'tm-all' || card.getAttribute('data-industry') === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Add click event listeners to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Filter testimonials
            const filterValue = button.getAttribute('data-filter');
            filterTestimonials(filterValue);
        });
    });
    
    // Initialize with all testimonials shown
    filterTestimonials('tm-all');
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
  //initializeTestmonialListners();
  initializeTmFilterListners();
});