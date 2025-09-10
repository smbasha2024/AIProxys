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
    const container = document.getElementById(containerId);

    //PageManager.getAllComponentsCache();
    const compCache = PageManager.getComponentCache(`${path}`);

    let html = '';
    let script = '';
    let scriptPath = null;

    if (compCache !== undefined) {
      // Fetch HTML and Javascript content from cache
      html = compCache.html;
      script = compCache.js;
      scriptPath = compCache.scriptPath;

      container.innerHTML = html;
      container.setAttribute("data-loaded", "true");

      const scriptElement = document.createElement('script');
        
      if (!document.querySelector(`script[data-path="${scriptPath}"]`)) {
        scriptElement.textContent = script;
        scriptElement.dataset.path = scriptPath; // mark it
        document.body.appendChild(scriptElement);
        //eval(scriptCache.get(scriptPath));
      }
    }
    else {
      // Fetch HTML and Javascript content from external files
      const response = await fetch(`components/${path}.html`);
      if (!response.ok) throw new Error(`Failed to load ${path}`);
      html = await response.text();
      
      container.innerHTML = html;
      container.setAttribute("data-loaded", "true");
      
      scriptPath = `${path}`;
      if(scriptPath.includes('/')) {
        scriptPath = 'components/' + scriptPath.replace('/','/js/') + '.js';
      }
      else
      {
        scriptPath = 'components/js/' + scriptPath + '.js';
      }
      
      const fullPath = new URL(scriptPath, document.baseURI).href;
      
      if (document.querySelector(`script[src="${scriptPath}"]`)){ 
        return;
      }
      
      const scriptResponse = await fetch(scriptPath);
      script = await scriptResponse.text();
      if (scriptResponse.ok) {
        const scriptElement = document.createElement('script');
        scriptElement.src = scriptPath;
        scriptElement.defer = true;
        document.body.appendChild(scriptElement);
      }
      PageManager.setComponentCache(`${path}`, {html: html, js: script, scriptPath: scriptPath});
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
  
  //for (const container of subContainers) {
  const promises = Array.from(subContainers).map(container => {
    const subName = container.dataset.subcomponent;
    //console.log("Loading sub-component: ", subName);
    var subPath = `${parentPath}/${subName}`;

    if (subName.includes('/')) {
      var subPath = `${subName}`;
      //console.log ("shared sub Name: ", subPath);
    }

    // Load Subcomponent Conent
    return loadComponentContent(subPath, container.id);
  });

  await Promise.all(promises);
}

// Load main content (Home, FAQ, Newsletter)
async function loadContent(page) {
  await loadComponent(page, 'content-container','');
  //console.log('page - ', page);

  if((page !== 'index') && (page !== '#')) {
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

  if((page !== 'index') && (page !== '#')) {
    loadMenuTitle(page);
  }

  initEditorIfNeeded();

  window.history.pushState({ page }, '', `#${page}`);
}

async function loadMenuTitle(page){
  var navPath = page;
  navPath = navPath.charAt(0).toUpperCase() + navPath.slice(1);
  //console.log(navPath)
  navTitle = navPath;
  if (navPath === "Faq") { navPath = "Blogs / FAQ"; navTitle = "FAQ"; }
  if (navPath === "Casestudy") {navPath = "Blogs / Case Studies"; navTitle = "Case Studies"; }
  if (navPath === "Team") {navPath = "Blogs / Our Team";}
  if (navPath === "Testimonials") {navPath = "Blogs / Testimonials";}
  if (navPath === "Proddocs/policies") {navPath = "Blogs / Policies"; navTitle = "Policies"; }
  if (navPath === "Proddocs/cookies") {navPath = "Blogs / Cookies"; navTitle = "Cookies"; }
  if (navPath === "Proddocs/help") {navPath = "Blogs / Help"; navTitle = "Help"; }

  if(document.getElementById("navItemHeader") !== null) document.getElementById("navItemHeader").innerHTML = navTitle;
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
  // Load Home page and its sub-components
  showSpinner(); //await delayPageLoad(1500); // Simulate loading delay
  await loadContent('home');
  hideSpinner();
});
