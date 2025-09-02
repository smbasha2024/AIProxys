// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize the PageManager
    PageManager.init();
    ModalManager.init();
          
    PageManager.on('page:beforeUnload', function(data) {
        if(data.from === "contact") {
            //QuillManager.listAllEditors();
            QuillManager.destroyEditor('contactEditor');
            resetContactForm();
            //QuillManager.listAllEditors();
        }
    });

    PageManager.on('page:afterUnload', function(data) {
        //console.log('Basha: AU');
    });

    PageManager.on('page:beforeLoad', function(data) {
        //console.log('Basha: BL');
    });

    PageManager.on('page:afterLoad', function(data) {
        if (data.page === "contact") {
            initContactForm();
        }
    });

    PageManager.on('page:focus', function(data) {
        if((data.page === 'home') || (data.page === 'products') || (data.page === 'services') || (data.page === 'casestudy')){
            window.initializeTestimonialCarousel();
        }
    });

});


/*
// Open a modal
document.getElementById('open-getstart-btn').addEventListener('click', function() {
    ModalController.openModal('getStartModal');
});

// Close a modal
document.getElementById('close-modal-btn').addEventListener('click', function() {
    ModalController.closeModal('getStartModal');
});

// Listen for modal events
ModalManager.on('modal:beforeLoad', function(data) {
    console.log('Modal loading:', data.modalId);
    // Show loading indicator
});

ModalManager.on('modal:afterLoad', function(data) {
    if (data.success) {
        console.log('Modal loaded:', data.modalId);
        // Initialize modal components
    }
});

ModalManager.on('modal:beforeUnload', function(data) {
    console.log('Modal unloading:', data.modalId);
    // Save state, validate forms
});

ModalManager.on('modal:afterUnload', function(data) {
    console.log('Modal unloaded:', data.modalId);
    // Cleanup resources
});
*/