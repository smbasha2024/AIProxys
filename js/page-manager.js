//console.log('Page Manager...')

window.PageManager = (function() {
    'use strict';

    let currentPage = null;
    const pages = {};
    const eventHandlers = {
        'page:beforeUnload': [],
        'page:afterLoad': [],
        'app:initialized': []
    };
    /*
    function createPageElement(pageId, content) {
        const pageElement = document.createElement('div');
        pageElement.className = 'page';
        pageElement.id = `${pageId}-page`;
        pageElement.innerHTML = content;
        return pageElement;
    }
    */
    function triggerEvent(event, data) {
        (eventHandlers[event] || []).forEach(handler => handler(data));
    }

    function updateNavigation(activePage) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-page') === activePage);
        });
    }

    /*
    function getMainContent() {
        return document.getElementById('mainContent');
    }
    */

    return {
        init() {
            // Navigation clicks
            document.addEventListener('click', (e) => {
                if (e.target.matches('.nav-link')) {
                    e.preventDefault();
                    this.navigateTo(e.target.getAttribute('data-page'));  // need to check how to handle data-page in header.html
                }
            });

            // Back/forward navigation
            window.addEventListener('popstate', (e) => {
                if (e.state?.page) this.navigateTo(e.state.page, {}, false);
            });

            // Load initial page from URL or default to "home"
            const initialPage = new URLSearchParams(window.location.search).get('page') || 'home';
            this.navigateTo(initialPage, {}, false);
            triggerEvent('app:initialized', { page: initialPage });
        },

        registerPage(pageId, config) {
            if (pages[pageId]) return;
            pages[pageId] = {
                id: pageId //,
                //template: config.template || `<h2>${pageId}</h2>`,
                //controller: config.controller || (() => {})
            };
        },

        navigateTo(pageId, data = {}, updateHistory = true) {
            if (!pages[pageId] || pageId === currentPage) return;

            triggerEvent('page:beforeUnload', { from: currentPage, to: pageId });

            // Hide current page
            if (currentPage) {
                const currentEl = document.getElementById(`${currentPage}-page`);
                if (currentEl) currentEl.classList.remove('active');
            }

            // Create new page if not in DOM
            //const mainContent = getMainContent();
            let newPageElement = document.getElementById(`${pageId}-page`);
            /*
            if (!newPageElement) {
                newPageElement = createPageElement(pageId, pages[pageId].template);
                mainContent.appendChild(newPageElement);
            }
            */

            // Show new page
            newPageElement.classList.add('active');

            // Update navigation & history
            updateNavigation(pageId);
            if (updateHistory) {
                const url = new URL(window.location);
                url.searchParams.set('page', pageId);
                window.history.pushState({ page: pageId }, '', url);
            }

            // Run page controller
            //pages[pageId].controller(data);
            currentPage = pageId;

            triggerEvent('page:afterLoad', { page: pageId, data });
        },

        on(event, handler) {
            if (eventHandlers[event]) eventHandlers[event].push(handler);
        },

        off(event, handler) {
            if (eventHandlers[event]) {
                eventHandlers[event] = eventHandlers[event].filter(h => h !== handler);
            }
        }
    };
})();