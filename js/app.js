// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize the PageManager
    PageManager.init();

    /********************************* Page Manager Evenrts ************************/
    PageManager.on('page:beforeUnload', function(data) {
        //console.log("Page Manager: BUL");
        if(data.from === "contact") {
            //QuillManager.listAllEditors();
            QuillManager.destroyEditor('contactEditor');
            resetContactForm();
            //QuillManager.listAllEditors();
        }
    });

    PageManager.on('page:afterUnload', function(data) {
        //console.log("Page Manager: AUL");
    });

    PageManager.on('page:beforeLoad', function(data) {
        //console.log("Page Manager: BL");
    });

    PageManager.on('page:afterLoad', function(data) {
        //console.log("Page Manager: AL");
        if (data.page === "contact") {
            initContactForm();
        }
    });

    PageManager.on('page:focus', function(data) {
        //console.log("Page Manager: Fo");
        if((data.page === 'home') || (data.page === 'products') || (data.page === 'services') || (data.page === 'casestudy')){
            window.initializeTestimonialCarousel();
        }
    });




    /************************************ Model Manager Events ******************/
    // Initialize Model Manager
    ModalManager.init();


    // Listen for modal events
    ModalManager.on('modal:beforeLoad', function(data) {
        //console.log('BL', data);
        //console.log('BL', ModalManager.getLoadedModals())
        // Show loading indicator

        if(data.modalId ==="getStartModal"){
            //initGetStartFrom();
            //console.log("BL>>>>>>>>>>>>>>>>>>>>>>>>>");
            //QuillManager.listAllEditors();
        }

    });

    ModalManager.on('modal:afterLoad', function(data) {
        if (data.success) {
            //console.log('AL>>>>>>>>>>>>>>>>>>>>>>>>>>:', data);
            // Initialize modal components
            if(data.modalId ==="getStartModal"){
                //initGetStartFrom();
                //QuillManager.listAllEditors();
            }
        }
    });

    ModalManager.on('modal:beforeUnload', function(data) {
        //console.log('BUL:', data);
        // Save state, validate forms
        if(data.modalId ==="getStartModal") {
            //console.log('resetting...');
            QuillManager.destroyEditor('getStartEditor');
            resetGetStartForm();
        }
    });

    ModalManager.on('modal:afterUnload', function(data) {
        //console.log('AUL:', data);
        // Cleanup resources
    });

    ModalManager.on('modal:focus', function(data) {
        //console.log('Fo:', data);
        // initialize objects heres
    });

    ModalManager.on('modal:shown', function(data) {
        //console.log('Shown:', data);
        // initialize objects heres
    });

     ModalManager.on('modal:hidden', function(data) {
        //console.log('Hide:', data);
        // initialize objects heres
    });

});
