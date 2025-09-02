// ModalManager Implementation - Handles only events
window.ModalManager = (function() {
    'use strict';

    const eventHandlers = {
        'modal:beforeLoad': [],
        'modal:afterLoad': [],
        'modal:beforeUnload': [],
        'modal:afterUnload': [],
        'modal:focus': [],
        'modal:shown': [],
        'modal:hidden': []
    };

    function triggerEvent(event, data) {
        logEvent(event, data);
        (eventHandlers[event] || []).forEach(handler => handler(data));
    }

    function logEvent(event, data) {
        const now = new Date();
        const timeString = `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}]`;
        console.log('ModalManager Event:', {logTime: timeString, logEvent: event, logData: JSON.stringify(data)});
    }

    return {
        init() {
            console.log('ModalManager initialized');
        },

        // Method to trigger modal events from external code
        triggerModalEvent(event, data) {
            if (eventHandlers[event]) {
                triggerEvent(event, data);
            } else {
                console.warn(`Event "${event}" is not supported by ModalManager`);
            }
        },

        on(event, handler) {
            if (eventHandlers[event]) {
                eventHandlers[event].push(handler);
            } else {
                console.warn(`Event "${event}" is not supported by ModalManager`);
            }
        },

        off(event, handler) {
            if (eventHandlers[event]) {
                eventHandlers[event] = eventHandlers[event].filter(h => h !== handler);
            }
        }
    };
})();