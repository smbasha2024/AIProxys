apiUrl = window.AppConfig.apiBaseUrl;
apiEmailUrl = apiUrl + "emails";
apiEmail = window.AppConfig.apiBaseEmail;
apiKeyEmail = window.AppConfig.apiKeyEmail;

/***************************************************************************/
//        Quill, Rich Text Editor, settings and initialization
/***************************************************************************/
// Initialize editors when DOM is ready
function initContactForm(){
  const contactFormSec = document.getElementById("contactform");

  // To scroll the screen till to the contact form
  if (contactFormSec) {
    contactFormSec.scrollIntoView({ behavior: "smooth" });
  }

  // To set the Send Message button to diabled till all input fields are valid.
  const contactMsgForm = document.getElementById('contactMsgForm');
  const btnContact = document.getElementById('btnSendContact');
  const mandatoryFields = contactMsgForm.querySelectorAll('[required]');

  // Check form validity on input
  contactMsgForm.addEventListener('input', () => {
    //console.log('Form valid?', contactMsgForm.checkValidity());
    btnContact.disabled = !contactMsgForm.checkValidity();
  });

  // Initial check
  btnContact.disabled = !contactMsgForm.checkValidity();

  // Optional: Add visual feedback
  mandatoryFields.forEach(field => {
    //console.log(field);
    if (field.tagName !== 'DIV'){
      field.addEventListener('input', () => {
        field.classList.toggle('valid', field.checkValidity());
      });
    }
  });

  document.getElementById('email').addEventListener('input', function() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(this.value)) {
      this.classList.add('valid');
    } else {
      this.classList.remove('valid');
    }
  });

  initEditorIfNeeded();
}

function initEditorIfNeeded(){
  //console.log('Contact Editor', QuillManager.hasEditor('contactEditor'));
  const ceditor = QuillManager.hasEditor('contactEditor');
  if ((ceditor === undefined) || (ceditor === null)) {
    QuillManager.destroyEditor('contactEditor');

    if (document.readyState !== 'loading') {
      if (document.getElementById('contactMsgForm')) {
        const container = document.getElementById('contactEditor');
        QuillManager.getEditor('contactEditor');
        container.style.display = 'block';
      }
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('contactMsgForm')) {
          QuillManager.getEditor('contactEditor');
        }
      });
    }
  }
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
  try {
    if (typeof initContactForm === "function") {
      initContactForm();
    }
  } catch (e) {
    console.warn("initContactForm not available yet");
  }
});

function getEditorContent() {
    const content = QuillManager.getContent('contactEditor');
    return content;
}
function clearEditor() {
    QuillManager.clearEditor('contactEditor');
}


/************************************* Form Event Handlers Calls ***************************/
//        All Form Event Handlers are here
/*******************************************************************************************/

async function resultsToContactForm(strResult, bSuccess) {
  const lblResult = document.getElementById("result");

  lblResult.style.paddingLeft = "15px";
  lblResult.style.fontSize = "1.2rem"

  if(bSuccess) {
    lblResult.style.color = "green";
    lblResult.innerHTML = "✅   Thank You! We have received your message! We'll be in touch with you shortly."; // + "<br/><b>PS:</b>" + strResult;
    document.getElementById("contactFieldset").disabled = true;
  }
  else {
    lblResult.style.color = "red";
    lblResult.innerHTML = "❌   Server is down. Please try again later."
  }
}

function resetContactForm(){
  const frmConform = document.getElementById("contactMsgForm");
  const fsConFieldSet = document.getElementById("contactFieldset");
  const btnConsubmit = document.getElementById("btnSendContact");

  frmConform.reset();  // clears all field values
  btnConsubmit.disabled = true;  // disable submit again
  fsConFieldSet.classList.remove("was-validated");
  frmConform.classList.remove("was-validated");
  fsConFieldSet.disabled = false;
}

async function sendMessageContact() {
  const btnContact = document.getElementById('btnSendContact');
  try {
    btnContact.classList.add('loading');

    btnContact.disabled = true;
    btnContact.textContent = 'Submitting...';
    document.body.style.cursor = 'wait';

    //console.log("calling sendEmail...")
    const apiResult = await sendEmailContact();

    //console.log('API call Result: ', apiResult);
    if (apiResult.status !== 200) throw new Error('Request failed');
    await resultsToContactForm("", true);
    //console.log('Message Sent!');

  } catch (error) {
    console.log('Error :', error);
  } finally {
    // Reset state
    btnContact.disabled = false;
    btnContact.textContent = "Send Message";
    document.body.style.cursor = 'default';
    btnContact.classList.remove('loading');
  }
}

/************************************* API Calls ***************************/
//        All API calls are here
/***************************************************************************/
async function sendEmailContact(){
    const txtCustomerEmail = document.getElementById('email');
    const txtCustomerName = document.getElementById('name');
    const txtEmailSubject = document.getElementById('subject');

    const url = apiEmailUrl;
    const email = [apiEmail];
    const subject = txtEmailSubject.value;
    const message =  getEditorContent();// txtEmailMessage.value
    const name = txtCustomerName.value
    const customer_email = txtCustomerEmail.value;

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

    try {
        const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json', // Specify JSON data
          'X-API-KEY': apiKeyEmail,
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
      await resultsToContactForm("", false);
      console.error('Error:', error);
    }
}
