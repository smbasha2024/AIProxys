// Fixed JavaScript for header functionality
(function () {
    // Ensure only 1 event binding happens
    if (window.headerInitialized) return;
    window.headerInitialized = true;

    let currentPage = null;

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
    }

    async function navigateTo(pageId, data = {}, updateHistory = true) {
        if (pageId === currentPage) return;

        // Store the previous page
        const previousPage = currentPage;
        const pageEditor = document.querySelector(`[data-page="${pageId}"]`)?.getAttribute('data-has-editor');

        // Trigger beforeUnload event for current page
        if (currentPage) {
            PageManager.triggerNavigationEvent('page:beforeUnload', { 
                from: currentPage, 
                to: pageId,
                data: data
            });
        }

        // Trigger beforeLoad event for new page
        PageManager.triggerNavigationEvent('page:beforeLoad', { 
            from: currentPage, 
            to: pageId,
            data: data
        });
/*
        // 3. Hide current page
        if (currentPage) {
            const currentEl = document.getElementById(currentPage);
            if (currentEl) {
                currentEl.classList.remove('active');
                
                // 4. Trigger afterUnload for current page - RIGHT AFTER HIDING
                PageManager.triggerNavigationEvent('page:afterUnload', { 
                    page: currentPage,    // The page that was just unloaded
                    to: pageId,           // The page we're navigating to
                    from: currentPage,    // The page we came from
                    data: data
                });
            }
        }
*/
        // Load page dynamically
        let loadSuccess = false;
        if ((pageEditor !== null) && (pageEditor !== undefined) && (pageEditor === "true")) {
            await loadContentWithEditor(pageId);
        } else {
            await loadContent(pageId);
        }

        loadSuccess = true;
        // console.log('loadSuccess: ', loadSuccess);
        // Scroll to top
        if (pageId !== "contact") {
            moveToTop();
        }

        // Update navigation
        updateNavigation(pageId);

        // Update history
        if (updateHistory) {
            window.location.hash = pageId;
        }

        // Set current page
        currentPage = pageId;

        // Update active state
        const activeLink = document.querySelector(`[data-page="${pageId}"]`);
        if (activeLink) {
            updateActiveState(activeLink);
        }

        if (loadSuccess) {
            // Trigger afterLoad event
            PageManager.triggerNavigationEvent('page:afterLoad', { 
                page: pageId, 
                from: previousPage,
                data: data
            });
            
            // Trigger focus event
            PageManager.triggerNavigationEvent('page:focus', { 
                page: pageId,
                from: previousPage,
                data: data
            });
        } else {
            // Trigger error event
            PageManager.triggerNavigationEvent('page:loadError', { 
                page: pageId,
                from: previousPage,
                data: data,
                error: 'Failed to load page content'
            });
        }
    }

    // Function to update navigation UI
    function updateNavigation(activePage) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-page') === activePage);
        });
    }

    // Handle navigation clicks
    document.addEventListener("click", async (e) => {
        const link = e.target.closest("[data-page]");
        if (link) {
            e.preventDefault();
            const page = link.getAttribute("data-page");
            // Navigate to home
            await navigateTo(page);
        
            // Handle brand logo and title clicks
            const brandLogo = e.target.closest('#brand-logo');
            const brandTitle = e.target.closest('#brand-title');
            
            if (brandLogo || brandTitle) {
                e.preventDefault();
                navigateTo('home');
            }
        }
    });

    // Highlight nav links based on initial URL hash
    document.addEventListener("DOMContentLoaded", function() {
        // Load initial page from URL or default to "home"
        const initialPage = window.location.hash.substring(1) || 'home';
        if (window.navigateToPage) {
            window.navigateToPage(initialPage, {}, false);
        }
    });

})();
   
        
        