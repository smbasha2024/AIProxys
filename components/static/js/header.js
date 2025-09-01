// Fixed JavaScript for header functionality
(function () {
    // Ensure only 1 event binding happens
    if (window.headerInitialized) return;
    window.headerInitialized = true;

    // Function to update active states
    function updateActiveState(activeElement) {
        // Remove active class from all nav links and dropdown items
        document.querySelectorAll(".nav-link, .dropdown-item").forEach(nav => {
            nav.classList.remove("active");
        });
        
        // Add active class to clicked element
        activeElement.classList.add("active");
        
        // If clicked item is in a dropdown, highlight the parent toggle
        if (activeElement.classList.contains('dropdown-item')) {
            const parentDropdown = activeElement.closest('.dropdown');
            if (parentDropdown) {
                const parentToggle = parentDropdown.querySelector('.dropdown-toggle');
                parentToggle.classList.add('active');
            }
        }
        
        // Update current page display
        const pageName = activeElement.getAttribute('data-page');
        //document.getElementById('current-page').textContent = pageName.charAt(0).toUpperCase() + pageName.slice(1);
    }

    // Handle navigation clicks
    document.addEventListener("click", async (e) => {
        const link = e.target.closest("[data-page]");
        if (link) {
            e.preventDefault();
            const page = link.getAttribute("data-page");
            const pageEditor = link.getAttribute("data-has-editor")

            // Load page dynamically
            if((pageEditor !== null)  && (pageEditor !== undefined) && (pageEditor === "true")) {
                await loadContentWithEditor(page);
            }
            else {
                await loadContent(page);
            }
            // Scroll to top
            if(page !== "contact") {
                moveToTop();
            }

            // Update active state
            updateActiveState(link);

            // For demo purposes, we'll just update the active state
            // In a real app, you would load content here

            //console.log("Navigating to:", page);
        }
        
        // Handle brand logo and title clicks
        const brandLogo = e.target.closest('#brand-logo');
        const brandTitle = e.target.closest('#brand-title');
        
        if (brandLogo || brandTitle) {
            e.preventDefault();
            
            // Find the home link and trigger click
            const homeLink = document.getElementById('nav-home');
            if (homeLink) {
                updateActiveState(homeLink);
                //console.log("Brand clicked - navigating to: Home");
            }
        }
    });

    // Highlight nav links based on initial URL hash
    document.addEventListener("DOMContentLoaded", function() {
        const hash = window.location.hash;
        if (hash) {
            const targetLink = document.querySelector(`[data-page="${hash.substring(1)}"]`);
            if (targetLink) {
                updateActiveState(targetLink);
            }
        }
    });

})();

// Demo function to set active state
function setActive(id) {
    const element = document.getElementById(id);
    if (element) {
        // Remove active class from all nav links and dropdown items
        document.querySelectorAll(".nav-link, .dropdown-item").forEach(nav => {
            nav.classList.remove("active");
        });
        
        // Add active class to clicked element
        element.classList.add("active");
        
        // If it's a dropdown item, highlight the parent toggle
        if (element.classList.contains('dropdown-item')) {
            const parentDropdown = element.closest('.dropdown');
            if (parentDropdown) {
                const parentToggle = parentDropdown.querySelector('.dropdown-toggle');
                parentToggle.classList.add('active');
            }
        }
        
        // Update current page display
        const pageName = element.getAttribute('data-page');
        document.getElementById('current-page').textContent = pageName.charAt(0).toUpperCase() + pageName.slice(1);
        
        // Update URL hash for demo
        window.location.hash = element.getAttribute('data-page');
    }
}
        
        
        