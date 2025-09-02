// ModalController - Handles actual modal operations
window.ModalController = (function() {
    'use strict';

    const loadedModals = new Map();
    const modalScripts = new Map();

    async function loadModalResources(modalId) {
        // Trigger before load event
        ModalManager.triggerModalEvent('modal:beforeLoad', { 
            modalId, 
            action: 'load',
            timestamp: Date.now()
        });

        try {
            // Load modal HTML
            const htmlResponse = await fetch(`/modals/${modalId}.html`);
            if (!htmlResponse.ok) throw new Error('Failed to load modal HTML');
            const html = await htmlResponse.text();

            // Load modal JavaScript
            const scriptResponse = await fetch(`/js/modals/${modalId}.js`);
            if (!scriptResponse.ok) throw new Error('Failed to load modal script');
            const scriptText = await scriptResponse.text();

            // Create and execute script
            const script = document.createElement('script');
            script.textContent = scriptText;
            document.head.appendChild(script);

            // Store reference
            modalScripts.set(modalId, script);

            // Insert HTML into modal container
            document.getElementById('modal-content-container').innerHTML = html;

            // Initialize Bootstrap modal
            const modalElement = document.getElementById(modalId);
            if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                loadedModals.set(modalId, modal);

                // Add Bootstrap event listeners
                modalElement.addEventListener('shown.bs.modal', () => {
                    ModalManager.triggerModalEvent('modal:shown', { modalId });
                    ModalManager.triggerModalEvent('modal:focus', { modalId });
                });

                modalElement.addEventListener('hidden.bs.modal', () => {
                    ModalManager.triggerModalEvent('modal:hidden', { modalId });
                });
            }

            // Trigger after load event
            ModalManager.triggerModalEvent('modal:afterLoad', { 
                modalId, 
                action: 'load',
                success: true,
                timestamp: Date.now()
            });

            return true;

        } catch (error) {
            ModalManager.triggerModalEvent('modal:afterLoad', { 
                modalId, 
                action: 'load',
                success: false,
                error: error.message,
                timestamp: Date.now()
            });
            return false;
        }
    }

    async function unloadModalResources(modalId) {
        // Trigger before unload event
        ModalManager.triggerModalEvent('modal:beforeUnload', { 
            modalId, 
            action: 'unload',
            timestamp: Date.now()
        });

        try {
            // Remove modal HTML
            const modalContainer = document.getElementById('modal-content-container');
            if (modalContainer) {
                modalContainer.innerHTML = '';
            }

            // Remove modal script
            const script = modalScripts.get(modalId);
            if (script && script.parentNode) {
                script.parentNode.removeChild(script);
            }

            // Cleanup Bootstrap modal
            const modal = loadedModals.get(modalId);
            if (modal) {
                modal.hide();
                modal.dispose();
            }

            // Remove from maps
            loadedModals.delete(modalId);
            modalScripts.delete(modalId);

            // Cleanup global functions
            cleanupModalGlobals(modalId);

            // Trigger after unload event
            ModalManager.triggerModalEvent('modal:afterUnload', { 
                modalId, 
                action: 'unload',
                success: true,
                timestamp: Date.now()
            });

            return true;

        } catch (error) {
            ModalManager.triggerModalEvent('modal:afterUnload', { 
                modalId, 
                action: 'unload',
                success: false,
                error: error.message,
                timestamp: Date.now()
            });
            return false;
        }
    }

    function cleanupModalGlobals(modalId) {
        // Define global functions to clean up for each modal
        const modalGlobals = {
            'getStartModal': ['initGetStartFrom', 'resetGetStartForm', 'submitMessage'],
            'contactModal': ['initContactForm', 'validateContactForm'],
            'loginModal': ['initLoginForm', 'handleLogin']
        };

        const globalsToRemove = modalGlobals[modalId] || [];
        
        globalsToRemove.forEach(globalName => {
            if (typeof window[globalName] !== 'undefined') {
                try {
                    delete window[globalName];
                } catch (e) {
                    window[globalName] = undefined;
                }
            }
        });
    }

    return {
        async openModal(modalId, data = {}) {
            try {
                const success = await loadModalResources(modalId);
                if (success) {
                    const modal = loadedModals.get(modalId);
                    if (modal) {
                        modal.show();
                    }
                }
                return success;
            } catch (error) {
                console.error(`Error opening modal ${modalId}:`, error);
                return false;
            }
        },

        async closeModal(modalId) {
            try {
                const success = await unloadModalResources(modalId);
                return success;
            } catch (error) {
                console.error(`Error closing modal ${modalId}:`, error);
                return false;
            }
        },

        isModalLoaded(modalId) {
            return loadedModals.has(modalId);
        },

        getLoadedModals() {
            return Array.from(loadedModals.keys());
        }
    };
})();