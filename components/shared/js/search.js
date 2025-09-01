
const searchData = localStorage.getItem('appData')? JSON.parse(localStorage.getItem('appData')) : [];

//console.log("Basha:", searchData)

/************************************* API Calls ***************************/
//        All API calls are here
/***************************************************************************/
async function searchPages(){
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim().toLowerCase();
    //console.log('Basha: ', query, searchData);
            
    if (query === '') {
        //console.log('Query is empty!')
        displayNoResults();
        return;
    }

    // Perform search
    const results = searchData.filter(page => {
        let found = false;
        //console.log("Page", page)
        if (page.title.toLowerCase().includes(query)) {
            found = true;
            //console.log("Reached Title Check")
        }
        
        if (page.content.toLowerCase().includes(query)) {
            found = true;
            //console.log("Reached Content Check")
        }
        
        for (const keyword of page.keywords) {
            if (keyword.toLowerCase().includes(query)) {
                found = true;
                //console.log("Reached KeyWords Check")
                break;
            }
        }
        return found;
    });

    displayResults(results, query);
}

function displayResults(results, query) {
    const resultsContainer = document.getElementById('results-container');
    const resultsCount = document.getElementById('results-count');

    //console.log("In Display Results:", results)
    if (results.length === 0) {
        displayNoResults();
        return;
    }
    
    resultsCount.textContent = `${results.length} results found`;
    
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    // Add results to the page
    results.forEach(page => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        
        // Create title with highlighted text
        const title = highlightText(page.title, query);
        
        // Create snippet with highlighted text
        const snippet = createSnippet(page.content, query);
        
       //console.log("search item url: ", page.url);
       //<a href="${page.url}" class="result-url">${page.url}</a>
        resultItem.innerHTML = `
            <h2 class="result-title">${title}</h2>
            <a onclick="loadContent('${page.url}');" class="result-url">${page.url}</a>
            <p class="result-snippet">${snippet}</p>
        `;
        
        resultItem.querySelector('.result-url').addEventListener('click', (e) => {
            e.preventDefault();
            closeSearchModal();
            //loadContent(page.url);
        });
        resultsContainer.appendChild(resultItem);
    });
}

// Display no results message
function displayNoResults() {
    const resultsContainer = document.getElementById('results-container');
    const resultsCount = document.getElementById('results-count');
    //console.log("In No Results")
    resultsCount.textContent = '0 results found';
    resultsContainer.innerHTML = `
        <div class="no-results">
            <h3>No results found</h3>
            <p>Try different keywords or page titles.</p>
        </div>
    `;
}

// Highlight matching text in results
function highlightText(text, query) {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

// Create a text snippet with highlighted query terms
function createSnippet(content, query) {
    if (!query) return content.substring(0, 150) + '...';
    
    const index = content.toLowerCase().indexOf(query.toLowerCase());
    
    if (index === -1) {
        return content.substring(0, 150) + '...';
    }
    
    // Get context around the match
    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + query.length + 100);
    
    let snippet = '';
    if (start > 0) snippet += '...';
    snippet += content.substring(start, end);
    if (end < content.length) snippet += '...';
    
    return highlightText(snippet, query);
}

function closeSearchModal() {
    const modalElement = document.getElementById('searchModal');
    //const modalInstance = bootstrap.Modal.getInstance(modalElement);
    //modalInstance.hide();

    //const modalElem = document.getElementById(modalName);
    //const modalInstance = bootstrap.Modal.getInstance(modalElem);

    document.activeElement.blur();  
    modalElement.classList.remove('show');
    modalElement.style.display = 'none';
    modalElement.setAttribute('aria-hidden', 'true');

    // Remove Bootstrap modal classes if present
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';

    // Remove modal backdrop if exists
    /*
    const backdrop = document.querySelector('.modal-backdrop');
    
    if (backdrop) {
        try {
            backdrop.remove();
        }
        catch(e){
            console.log('Error in removing backdrop', e);
        }
        finally{
            console.log('Error in removing backdrop');
        }
    }
    */
    //modalInstance.hide();
}

// Initialize with a sample search
setTimeout(searchPages, 500);

