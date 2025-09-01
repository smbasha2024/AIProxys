window.PageManager = (function() {
    'use strict';

    const eventHandlers = {
        'page:beforeUnload': [],
        'page:afterUnload': [],
        'page:beforeLoad': [],
        'page:afterLoad': [],
        'page:focus': [],
        'app:initialized': []
    };

    function triggerEvent(event, data) {
        logEvent(event, data);
        (eventHandlers[event] || []).forEach(handler => handler(data));
    }

    function logEvent(event, data) {
        const now = new Date();
        const timeString = `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}]`;
        // Also log to console
        // console.log('PageManager Event:', {logTime: timeString, logEvent: event, logData: JSON.stringify(data)});
    }

    return {
        init() {
            // PageManager doesn't handle navigation, only events
            triggerEvent('app:initialized', { timestamp: Date.now() });
        },

        // Method to trigger navigation events from external code
        triggerNavigationEvent(event, data) {
            if (eventHandlers[event]) {
                triggerEvent(event, data);
            } else {
                console.warn(`Event "${event}" is not supported by PageManager`);
            }
        },

        on(event, handler) {
            if (eventHandlers[event]) {
                eventHandlers[event].push(handler);
            } else {
                console.warn(`Event "${event}" is not supported by PageManager`);
            }
        },

        off(event, handler) {
            if (eventHandlers[event]) {
                eventHandlers[event] = eventHandlers[event].filter(h => h !== handler);
            }
        }
    };
})();
