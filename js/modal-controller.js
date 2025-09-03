// ModalController - Handles actual modal operations
window.ModalController = (function() {
    'use strict';

    const loadedModals = new Map();
    const modalScripts = new Map();

    async function loadModalResources(modalId, page, pageEditor) {
        // Trigger before load event
        ModalManager.triggerModalEvent('modal:beforeLoad', { 
            modalId, 
            action: 'load',
            timestamp: Date.now()
        });

        try {
            // Load page dynamically
            if ((pageEditor !== null) && (pageEditor !== undefined) && (pageEditor === "true")) {
                await loadModalContentWithEditor(page, modalId);
            } else {
                await loadModalContent(page, modalId);
            }

            // Store reference
            modalScripts.set(modalId, page);

            // Initialize Bootstrap modal
            const modalElement = document.getElementById(modalId);
            if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                loadedModals.set(modalId, modal);
                //console.log("In Controller. BL..... ", "HTML Map Set");
                // Add Bootstrap event listeners
                modalElement.addEventListener('shown.bs.modal', () => {
                    ModalManager.triggerModalEvent('modal:shown', { modalId, action: 'load', success: true, timestamp: Date.now()});
                    ModalManager.triggerModalEvent('modal:focus', { modalId, action: 'load', success: true, timestamp: Date.now()});
                });

                modalElement.addEventListener('hidden.bs.modal', () => {
                    ModalManager.triggerModalEvent('modal:hidden', { modalId, action: 'unload', success: true, timestamp: Date.now() });
                });
                if(modal){
                    modal.show();
                    //ModalManager.triggerModalEvent('modal:focus', { modalId,  action: 'unload', success: true, timestamp: Date.now()}); 
                }
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
            console.log("Triggered AfterLoad event with error.", error);
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
            if (script) {
                await unloadModalContentScript(script);
            }

            // Cleanup Bootstrap modal
            //const modal = loadedModals.get(modalId);
            //console.log('Modal Name', modal)
            const modal = document.getElementById(modalId);
            if (modal) {
                if(typeof modal.hide === "function") modal.hide();
                if(typeof modal.dispose === "function") modal.dispose();
            }
            
            // Remove from maps
            loadedModals.delete(modalId);
            modalScripts.delete(modalId);

            // Cleanup global functions
            //cleanupModalGlobals(modalId);
            
            // Trigger after unload event
            ModalManager.triggerModalEvent('modal:afterUnload', { 
                modalId, 
                action: 'unload',
                success: true,
                timestamp: Date.now()
            });

            return true;

        } catch (error) {
            console.log("Unload Resource - After Unload event tirggering error.", error);
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
            'getStartModal': ['initGetStartFrom', 'initModalEditorIfNeeded', 'resetGetStartForm', 'submitMessage', 'closeGetStartModal']
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
            // data should have data.scriptPath and data.hasEditor
            let scriptPath = null;
            let hasEditor = null;

            const isDataEmpty = Object.keys(data).length === 0;
            if(!isDataEmpty) {
                const hasScriptPath = "scriptPath" in data;
                const hasEditorData = "hasEditor" in data;
                if (hasScriptPath) scriptPath = data.scriptPath;
                if (hasEditorData) hasEditor = data.hasEditor;
            }

            try {
                const success = await loadModalResources(modalId, scriptPath, hasEditor);
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