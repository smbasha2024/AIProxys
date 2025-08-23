
async function loadAppData() {
  // Load JSON data from a file or API
  const response = await fetch('data/searchkeywords.json');
  const data = await response.json();

  // Save JSON data to localStorage
  localStorage.setItem('appData', JSON.stringify(data));
}

// Call once when your app starts
loadAppData();