apiUrl = window.AppConfig.apiBaseUrl;
apiEmailUrl = apiUrl + "emails";
apiEmail = window.AppConfig.apiBaseEmail;
//console.log("In getstart.js")

const txtCustomerName = document.getElementById('getStartName');
const txtCustomerEmail = document.getElementById('getStartEmail');
const txtCustomerPhone = document.getElementById('getStartPhoneNo');
const btnGetStart = document.getElementById('btnGetStart');
const getStartForm = document.getElementById('getStartForm');

const mandatoryFields = getStartForm.querySelectorAll('[required]');

// Check form validity on input
getStartForm.addEventListener('input', () => {
  console.log('Form valid?', getStartForm.checkValidity());
  btnGetStart.disabled = !getStartForm.checkValidity();
});

// Initial check
btnGetStart.disabled = !getStartForm.checkValidity();

/***************************************************************************/
//        Quill, Rich Text Editor, settings and initialization
/***************************************************************************/
// Custom fonts definition
if (!window.__getStartQuillSetup) {
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

    // ✅ Use class-based size attribution (instead of style)
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

    window.__getStartQuillSetup = true;
}

// Persist the instance across dynamic loads
let quill = window.__getStartQuillInstance || undefined;

function createQuill(container) {
    return new Quill(container, {
            modules: {
                toolbar: [
                    // Font formatting
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
            placeholder: 'Leave us your message...',
            theme: 'snow'
    });
}

// Mount if needed (container must be the *current* #getStartEditor)
function mountQuillIfNeeded() {
  const container = document.getElementById('getStartEditor');
  if (!container) return; // modal content not injected yet

  const needsRemount =
    !quill ||
    !quill.root?.isConnected ||               // old instance detached from DOM
    !container.contains(quill.root);          // instance bound to a different (old) container

  if (needsRemount) {
    if (quill) quill.off();                   // clean listeners on stale instance
    quill = createQuill(container);
    window.__getStartQuillInstance = quill;   // persist for next dynamic load
  }
}

// Call after the modal HTML is injected / when it becomes visible.
// If you use Bootstrap 5:
document.addEventListener('shown.bs.modal', (e) => {
  if (e.target && e.target.id === 'getStartModal') {
    mountQuillIfNeeded();
  }
});

// If you manually show/hide the modal or inject HTML via components.js,
// call mountQuillIfNeeded() right after you inject the modal content or set it visible:
function openGetStartModal() {
  // ...your code that injects/opens #getStartModal...
  mountQuillIfNeeded();
}

// Optional: initialize immediately if the DOM is already ready and modal is visible
if (document.readyState !== 'loading') {
  if (document.getElementById('getStartModal')?.classList.contains('show')) {
    mountQuillIfNeeded();
  }
} else {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('getStartModal')?.classList.contains('show')) {
      mountQuillIfNeeded();
    }
  });
}

async function closeGetStartModal() {
    //console.log("In closeModal")
    const modalElem = document.getElementById('getStartModal');
    //const modalInstance = bootstrap.Modal.getInstance(modalElem);
/*
    document.activeElement.blur();  
    modalElem.classList.remove('show');
    modalElem.style.display = 'none';
    modalElem.setAttribute('aria-hidden', 'true');

    // Remove Bootstrap modal classes if present
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
*/
}

/************************************* Form Event Handlers Calls ***************************/
//        All Form Event Handlers are here
/***************************************************************************/
async function resultsToForm(strResult) {
  const result = document.getElementById("getStartResult");
  result.innerHTML = "Thank You! We have received your message! We'll be in touch with you shortly."; // + "<br/><b>PS:</b>" + strResult;
  document.getElementById("getStartFieldset").disabled = true;
}

async function submitMessage() {
  try {
    btnGetStart.classList.add('loading');

    btnGetStart.disabled = true;
    btnGetStart.textContent = 'Submitting...';
    document.body.style.cursor = 'wait';

    //console.log("calling sendEmail...")
    const apiResult = await sendEmail();
    await resultsToForm("");

    //console.log('API call Result: ', apiResult);
    if (apiResult.status !== 200) throw new Error('Request failed');
    //showSuccessMessage();
    
    //const quoteResp = await getMessages();
    //await resultsToForm(quoteResp);

    console.log('Message Submitted!');

  } catch (error) {
    console.log('Error :', error);
  } finally {
    // Reset state
    btnGetStart.disabled = false;
    btnGetStart.textContent = "Submit";
    document.body.style.cursor = 'default';
    btnGetStart.classList.remove('loading');
  }
}

/************************************* API Calls ***************************/
//        All API calls are here
/***************************************************************************/
async function sendEmail(){
    const url = apiEmailUrl;
    const email = [apiEmail];

    const subject = "New User: Getting Started...";
    const message = quill.root.innerHTML // txtEmailMessage.value
    const name = txtCustomerName.value
    const customer_email = txtCustomerEmail.value;
    const customer_phone = txtCustomerPhone.value;

    // Encode HTML for safe transmission
    const encodedBody = btoa(unescape(encodeURIComponent(message))); // Base64 encode
    // Mock payload
    const payload = {
        email,
        subject,
        message: encodedBody,
        name,
        customer_email
    };
    console.log(payload);
    try {
        const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json', // Specify JSON data
          // 'Authorization': 'Bearer YOUR_TOKEN' // Add auth headers if needed
        },
        body: JSON.stringify(payload) // Convert data to JSON string
      });

      //console.log('checking response', response)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json(); // Parse JSON response
      //console.log('Success:', responseData);
      return {'status': 200, message: responseData}
    } catch (error) {
      console.error('Error:', error);
    }
}