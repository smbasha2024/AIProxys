
async function loadModalComponentContent(path, containerId, modalName) {
  try {
    //console.log(containerId, `components/${path}.html`);
    const container = document.getElementById(containerId);

    const response = await fetch(`components/${path}.html`);
    if (!response.ok) throw new Error(`Failed to load ${path}`);
    const html = await response.text();
    
    container.innerHTML = html;
    container.setAttribute("data-loaded", "true");

    // Load associated JavaScript (e.g., header.js for header.html)
    var scriptPath = `${path}`;
    if(scriptPath.includes('/')) {
      scriptPath = 'components/' + scriptPath.replace('/','/js/') + '.js';
    }
    else
    {
      scriptPath = 'components/js/' + scriptPath + '.js';
    }
    //console.log('script path : ', scriptPath);
    
    const fullPath = new URL(scriptPath, document.baseURI).href;
    if (document.querySelector(`script[src="${scriptPath}"]`)){ 
      return;
    }

    const scriptResponse = await fetch(scriptPath);
    if (scriptResponse.ok) {
      //const scriptResponse = await fetch(scriptPath);
        const script = await scriptResponse.text();
        const scriptElement = document.createElement('script');
        scriptElement.textContent = script;
        scriptElement.src = scriptPath;
        scriptElement.defer = true;
        document.body.appendChild(scriptElement);
    }

  } catch (error) {
      //console.error(`Error loading ${path}:`, error);
      console.log(`Error loading ${path}:`, error);
  }
}

// Load main content (Home, FAQ, Newsletter)
async function loadModalContent(page, modalName) {
    //console.log('loadModalContent method');
    await loadModalComponentContent(page, 'modal-content-container', modalName);
    await openModal(modalName);
  //console.log('page - ', page);
  
  window.history.pushState({ page }, '', `#${page}`);
}

function initModalEditorIfNeeded(){
  //console.log("Editor initialization.. call...")
}

async function loadModalContentWithEditor(page, modalName) {
  //console.log('loadModalContent method');
  await loadModalComponentContent(page, 'modal-content-container', modalName);
  await openModal(modalName);
  //console.log('page - ', page);
  
  initModalEditorIfNeeded();
  window.history.pushState({ page }, '', `#${page}`);
}

async function openModal(modalName) {
    // Get the modal element
    const modalElem = document.getElementById(modalName);
    
    // Create a Bootstrap Modal instance
    const modal = new bootstrap.Modal(modalElem);
    
    // Show the modal
    modal.show();
}

async function closeModal(modalName) {
    //console.log("In closeModal")
    const modalElem = document.getElementById(modalName);
    //const modalInstance = bootstrap.Modal.getInstance(modalElem);

    document.activeElement.blur();  
    modalElem.classList.remove('show');
    modalElem.style.display = 'none';
    modalElem.setAttribute('aria-hidden', 'true');

    // Remove Bootstrap modal classes if present
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';

    /*
    // Remove modal backdrop if exists
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop && backdrop.parentNode) {
      console.log('Removing backdrop', backdrop);
      backdrop.parentNode.removeChild(backdrop);
    } else if (backdrop && !backdrop.parentNode) {
        console.log('Backdrop exists but is not in DOM');
      } else {
          console.log('No backdrop found');
        }
  */
    //modalInstance.hide();
}