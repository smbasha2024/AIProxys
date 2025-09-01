// Load static components (header/footer)
async function loadStaticComponents() {
  await Promise.all([
    loadComponentContent('static/header', 'header-container'),
    loadComponentContent('static/footer', 'footer-container')
  ]);
}

// Helper function to check if the JS file exists
async function checkIfScriptExists(scriptPath) {
  try {
    const response = await fetch(scriptPath, { method: 'HEAD' });
    return response.ok; // Returns true if the file exists
  } catch (error) {
    return false; // Treat network errors as "file not found"
  }
}

async function loadComponentContent(path, containerId) {
  try {
    //console.log(containerId, `components/${path}.html`);
    const container = document.getElementById(containerId);
    
    /*
    if (container.getAttribute("data-loaded") === "true") {
      console.log(`Already loaded: ${path}`);
      return;
    }
    */

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
    //if ([...document.scripts].some(s => s.src === fullPath)) {
      //console.log("Already attached script", scriptPath);
      return;
    }
    
   /*
    const existingScript = document.querySelector(`script[src="${scriptPath}"]`);
    if (existingScript) {
        // Remove it so that we can reload fresh
        existingScript.remove();
        console.log('Removed script file', scriptPath);
    }
    */
    const scriptResponse = await fetch(scriptPath);
    if (scriptResponse.ok) {
      //const scriptResponse = await fetch(scriptPath);
      const script = await scriptResponse.text();
      const scriptElement = document.createElement('script');
      //scriptElement.textContent = script;
      scriptElement.src = scriptPath;
      scriptElement.defer = true;
      document.body.appendChild(scriptElement);
    }

  } catch (error) {
      //console.error(`Error loading ${path}:`, error);
      console.log(`Error loading ${path}:`, error);
  }
}

// Load a component and its sub-components
async function loadComponent(path, containerId) {
  try {
    if ((containerId !== 'header-container') && (containerId !== 'footer-container')) {
      const container = document.getElementById(containerId);

      // Load component content
      await loadComponentContent(path, containerId);

      // Load sub-components recursively (if any)
      await loadSubComponents(container, path);
    }
  } catch (error) {
    console.log(`Error loading ${path}:`, error);
  }
}

// Load sub-components within a parent component
async function loadSubComponents(parentElement, parentPath) {
  const subContainers = parentElement.querySelectorAll('[data-subcomponent]');
  
  for (const container of subContainers) {
    const subName = container.dataset.subcomponent;
    var subPath = `${parentPath}/${subName}`;

    if (subName.includes('/')) {
      var subPath = `${subName}`;
      //console.log ("shared sub Name: ", subPath);
    }

    // Load Subcomponent Conent
    await loadComponentContent(subPath, container.id);
  }
}

// Load main content (Home, FAQ, Newsletter)
async function loadContent(page) {
  await loadComponent(page, 'content-container','');
  //console.log('page - ', page);

  if((page !== 'home') && (page !== 'index') && (page !== '#')) {
    loadMenuTitle(page);
  }

  window.history.pushState({ page }, '', `#${page}`);
}

function initEditorIfNeeded(){
  //console.log("Editor initialization.. call...")
}

// Load main content (Home, FAQ, Newsletter)
async function loadContentWithEditor(page) {
  await loadComponent(page, 'content-container','');
  //console.log('page - ', page);

  if((page !== 'home') && (page !== 'index') && (page !== '#')) {
    loadMenuTitle(page);
  }

  initEditorIfNeeded();

  window.history.pushState({ page }, '', `#${page}`);
}

async function loadMenuTitle(page){
  var navPath = page;
  navPath = navPath.charAt(0).toUpperCase() + navPath.slice(1);
  //console.log(navPath)

  if(document.getElementById("navItemHeader") !== null) document.getElementById("navItemHeader").innerHTML = navPath;
  if(document.getElementById("navItemChild") !== null) document.getElementById("navItemChild").innerHTML = navPath;
}

async function moveToTop ()
{
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Initialize the app
window.addEventListener('DOMContentLoaded', async () => {
  await loadStaticComponents();
  
  // Example: Load Home page and its sub-components
  await loadContent('home');
});
