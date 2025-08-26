apiUrl = window.AppConfig.apiBaseUrl;
apiEmailUrl = apiUrl + "emails";
apiEmail = window.AppConfig.apiBaseEmail;
//console.log("In getstart.js")
//QuillManager.listAllEditors();

//Form Validations..................
const getStartForm = document.getElementById('getStartForm');
const btnGetStart = document.getElementById('btnGetStart');
//const getSartMandFields = getStartForm.querySelectorAll('[required]');

// Check form validity on input
getStartForm.addEventListener('input', () => {
  //console.log('Form valid?', getStartForm.checkValidity());
  btnGetStart.disabled = !getStartForm.checkValidity();
});

// Initial check
btnGetStart.disabled = !getStartForm.checkValidity();

/***************************************************************************/
//        Quill, Rich Text Editor, settings and initialization
/***************************************************************************/
// Initialize editors when DOM is ready
function onDOMReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback(); // DOM is already ready
  }
}

onDOMReady(() => {
  // Your Quill initialization or other code here
  initModalEditorIfNeeded()
});

function initModalEditorIfNeeded(){
  QuillManager.destroyEditor('getStartEditor');

  if (document.readyState !== 'loading') {
    if (document.getElementById('getStartForm')) {
      const container = document.getElementById('getStartEditor');
      QuillManager.getEditor('getStartEditor');
      container.style.display = 'block';
    }
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      if (document.getElementById('getStartForm')) {
        QuillManager.getEditor('getStartEditor');
      }
    });
  }
}

function getModalEditorContent() {
    const content = QuillManager.getContent('getStartEditor');
    return content;
}
function clearModalEditor() {
    QuillManager.clearEditor('getStartEditor');
}

async function closeGetStartModal() {
    //console.log("In closeModal")
    QuillManager.destroyEditor('getStartEditor');
    const modalElem = document.getElementById('getStartModal');
  
    //document.activeElement.blur();  
    modalElem.classList.remove('show');
    modalElem.style.display = 'none';
    modalElem.setAttribute('aria-hidden', 'true');

    // Remove Bootstrap modal classes if present
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';

    document.getElementById("getStartFieldset").disabled = false;
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
    const btnSubmit = document.getElementById('btnGetStart');

    btnSubmit.classList.add('loading');

    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Submitting...';
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
    btnSubmit.disabled = false;
    btnSubmit.textContent = "Submit";
    document.body.style.cursor = 'default';
    btnSubmit.classList.remove('loading');
  }
}

/************************************* API Calls ***************************/
//        All API calls are here
/***************************************************************************/
async function sendEmail(){
  const txtCustName = document.getElementById('getStartName');
  const txtCustEmail = document.getElementById('getStartEmail');
  const txtCustPhone = document.getElementById('getStartPhoneNo');
  const txtCustOrg = document.getElementById('getStartCompany');

    const url = apiEmailUrl;
    const email = [apiEmail];

    const subject = "New User: Getting Started...";
    const message = getModalEditorContent(); //getStartQuill.root.innerHTML // txtEmailMessage.value
    const name = txtCustName.value;
    const customer_email = txtCustEmail.value;
    const customer_phone = txtCustPhone.value;
    const customer_org = txtCustOrg.value;
    const extra_params = {"CustomerPhone": customer_phone, "CustomerOrganization": customer_org};

    // Encode HTML for safe transmission
    const encodedBody = btoa(unescape(encodeURIComponent(message))); // Base64 encode
    // Mock payload
    const payload = {
        email,
        subject,
        message: encodedBody,
        name,
        customer_email,
        extra_params
    };
    //console.log(payload);

    try {
        const response = await fetch(url, {
        method: 'PUT',
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