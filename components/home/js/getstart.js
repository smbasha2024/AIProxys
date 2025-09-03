apiUrl = window.AppConfig.apiBaseUrl;
apiEmailUrl = apiUrl + "emails";
apiEmail = window.AppConfig.apiBaseEmail;

/***************************************************************************/
//        Quill, Rich Text Editor, settings and initialization
/***************************************************************************/
function initGetStartFrom(){
  // To set the Send Message button to diabled till all input fields are valid.
  const frmGetStartForm = document.getElementById("getStartForm");
  const btnGetStartSubmit = document.getElementById("btnGetStart");
  const mandatoryFields = frmGetStartForm.querySelectorAll('[required]');

  // Check form validity on input
  frmGetStartForm.addEventListener('input', () => {
    //console.log('Form valid?', frmGetStartForm.checkValidity());
    btnGetStartSubmit.disabled = !frmGetStartForm.checkValidity();
  });

  // Initial check
  btnGetStartSubmit.disabled = !frmGetStartForm.checkValidity();

  // Optional: Add visual feedback
  mandatoryFields.forEach(field => {
    if (field.tagName !== 'DIV'){
      field.addEventListener('input', () => {
        field.classList.toggle('valid', field.checkValidity());
      });
    }
  });

  document.getElementById('getStartEmail').addEventListener('input', function() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(this.value)) {
      this.classList.add('valid');
    } else {
      this.classList.remove('valid');
    }
  });

  initModalEditorIfNeeded();
}

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
  //console.log('onDOMReady...');
  initGetStartFrom();
});


function resetGetStartForm(){
  const frmGetStartForm = document.getElementById("getStartForm");
  const fsGetStartFieldSet = document.getElementById("getStartFieldset");
  const btnGetStartSubmit = document.getElementById("btnGetStart");

  // 1. Reset form values
  frmGetStartForm.reset();

  // 2. Remove ALL custom classes
  const allInputs = frmGetStartForm.querySelectorAll('input, select, textarea, div[contenteditable]');
  allInputs.forEach(input => {
    input.classList.remove('valid', 'is-valid', 'is-invalid');

    // Only real form controls support setCustomValidity
    if (typeof input.setCustomValidity === "function") {
      input.setCustomValidity("");
    }
  });

  // 3. Reset Quill editor (clear text area)
  if (typeof clearModalEditor === "function") {
    clearModalEditor();
  }

  // 4. Reset Bootstrap validation helpers
  frmGetStartForm.classList.remove("was-validated");
  fsGetStartFieldSet.classList.remove("was-validated");
  fsGetStartFieldSet.disabled = false;

  // 5. Reset result text
  const resultEl = document.getElementById("getStartResult");
  if (resultEl) resultEl.textContent = "";

  // 6. Disable submit button (force invalid state)
  btnGetStartSubmit.disabled = true;

  // 7. Force browser to re-evaluate validity after DOM reset
  requestAnimationFrame(() => {
    btnGetStartSubmit.disabled = !frmGetStartForm.checkValidity();
    //console.log("Form validity after reset:", frmGetStartForm.checkValidity());
  });
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
    resetGetStartForm();
    QuillManager.destroyEditor('getStartEditor');
    const modalElem = document.getElementById('getStartModal');
  
    //document.activeElement.blur();  
    modalElem.classList.remove('show');
    modalElem.style.display = 'none';
    modalElem.setAttribute('aria-hidden', 'true');

    // Remove Bootstrap modal classes if present
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';

    //document.getElementById("getStartFieldset").disabled = false;
    // Clear the result message
    document.getElementById("getStartResult").textContent = "";
    
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
  const btnSubmit = document.getElementById('btnGetStart');
  try {

    btnSubmit.classList.add('loading');

    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Submitting...';
    document.body.style.cursor = 'wait';

    //console.log("calling sendEmail...")
    const apiResult = await sendEmail();
    await resultsToForm("");

    //console.log('API call Result: ', apiResult);
    if (apiResult.status !== 200) throw new Error('Request failed');

    //console.log('Message Submitted!');

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