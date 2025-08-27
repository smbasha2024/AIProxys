window.QuillManager = (function() {
    let isInitialized = false;
    const editors = new Map();
    
    function initialize() {
        if (isInitialized) return;
        
        // Custom fonts definition
        const Font = Quill.import('formats/font');
        Font.allowlist = [
            "arial",
            "verdana",
            "times-new-roman",
            'roboto', 
            'lato', 
            'open-sans', 
            'montserrat', 
            'raleway',
            'sans-serif',
            'serif',
            'monospace'
        ];
        Quill.register(Font, true);

        // Size configuration
        const Size = Quill.import("attributors/class/size");
        Size.whitelist = [
            "extra-small",
            "small",
            "medium",
            "large",
            "extra-large",
            false // normal size
        ];
        Quill.register(Size, true);
        
        isInitialized = true;
        //console.log('Quill globally initialized');
    }
    
    function createEditor(containerId, options = {}) {
        if (!isInitialized) initialize();
        
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container #${containerId} not found`);
            return null;
        }
        
        // Clear existing content
        container.innerHTML = '';
        
        const config = {
            modules: {
                toolbar: [
                    // Font formatting
                    [{ font: Quill.import('formats/font').allowlist }],
                    [{ size: Quill.import("attributors/class/size").whitelist }],
                    // Text formatting
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'align': [] }],
                    
                    // Lists and indentation
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    //[{ 'indent': '-1'}, { 'indent': '+1' }],
                    
                    // Headers
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    
                    // Other
                    //['link', 'image']
                    ['clean']
                ]
            },
            placeholder: options.placeholder || 'Leave your message...',
            theme: 'snow'
        };
        
        const editor = new Quill(container, config);
        editors.set(containerId, editor);
        
        return editor;
    }
    
    function getEditor(containerId) {
        return editors.get(containerId) || createEditor(containerId);
    }
    
    function clearEditor(containerId) {
        const editor = getEditor(containerId);
        if (editor) {
            editor.setContents([]);
            editor.setText('');
        }
    }
    
    function getContent(containerId) {
        const editor = editors.get(containerId);
        return editor ? editor.root.innerHTML : '';
    }

    function destroyEditor(containerId) {
        const editor = editors.get(containerId);
        if (editor) {
            // Properly destroy the Quill instance
            try {
                editor.off(); // Remove all event listeners
            } catch (e) {
                console.warn('Error removing Quill event listeners:', e);
            }
            editors.delete(containerId);
        }
    }

    function listAllEditors() {
        // Remove references to editors whose containers no longer exist in DOM
        for (const [containerId, editor] of editors.entries()) {
            /*
            if (!editor.root.isConnected) {
                log(`Cleaning up stale editor: ${containerId}`);
                editors.delete(containerId);
                
                // Also clear modal reference if it was the modal editor
                if (containerId === 'modalEditor') {
                    activeModalEditor = null;
                }
            }
            */
           console.log(containerId, editor)
        }
    }
    
    return {
        initialize,
        createEditor,
        getEditor,
        clearEditor,
        getContent,
        destroyEditor,
        listAllEditors
    };
})();