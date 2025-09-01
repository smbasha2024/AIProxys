// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize the PageManager
    PageManager.init();
          
    PageManager.on('page:beforeUnload', function(data) {
        console.log('Basha Data: beforeUnload: ', data);
        if(data.from === "contact") QuillManager.destroyEditor('contactEditor');
    });

    PageManager.on('page:afterUnload', function(data) {
        console.log('Basha Data: afterUnload: ', data);
    });

    PageManager.on('page:beforeLoad', function(data) {
        console.log('Basha Data: beforeLoad: ', data);
    });

    PageManager.on('page:afterLoad', function(data) {
        console.log('Basha Data: afterLoad: ', data);
    });

    PageManager.on('page:focus', function(data) {
        console.log('Basha Data: focus: ', data);
    });


});