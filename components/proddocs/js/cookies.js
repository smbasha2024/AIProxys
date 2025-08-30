function initializeCookieListners(){
    //localStorage.removeItem('AIP_CookiesAccepted');

    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookies = document.getElementById('cookie-accept');
    const rejectCookies = document.getElementById('cookie-reject');
    
    const cookie_status = localStorage.getItem('AIP_CookiesAccepted');
    //console.log('Cookie Status: ', cookie_status);
    // Check if user has already made a choice

    if ((cookie_status === 'false') || (cookie_status === null) || (cookie_status === undefined)) {
        cookieBanner.style.display = 'block';
    }
    
    // Handle accept button
    acceptCookies.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.setItem('AIP_CookiesAccepted', 'true');
        cookieBanner.style.display = 'none';
    });
    
    // Handle reject button
    rejectCookies.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.setItem('AIP_CookiesAccepted', 'false');
        cookieBanner.style.display = 'none';
        // Additional logic to disable non-essential cookies
    });
}

function onDOMReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback(); // DOM is already ready
  }
}

onDOMReady(() => {
  // Your Quill initialization or other code here
  initializeCookieListners();
});