apiUrl = window.AppConfig.apiBaseUrl;
apiEmailUrl = apiUrl + "emails";
apiEmail = window.AppConfig.apiBaseEmail;

// To scroll the screen till to the contact form
const strsendMsgBtnText = "Send Message";
const contactForm = document.getElementById("contactform");
if (contactForm) {
  contactForm.scrollIntoView({ behavior: "smooth" });
}

// To set the Send Message button to diabled till all input fields are valid.
const contactMsgForm = document.getElementById('contactMsgForm');
const btnContact = document.getElementById('btnSendContact');
const txtCustomerEmail = document.getElementById('email')
const txtCustomerName = document.getElementById('name')
const txtEmailSubject = document.getElementById('subject')
const txtEmailMessage = document.getElementById('editor') //document.getElementById('message')
const mandatoryFields = contactMsgForm.querySelectorAll('[required]');

// Check form validity on input
contactMsgForm.addEventListener('input', () => {
  console.log('Form valid?', contactMsgForm.checkValidity());
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
  initEditorIfNeeded()
});

function initEditorIfNeeded(){
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

function getEditorContent() {
    const content = QuillManager.getContent('contactEditor');
    return content;
}
function clearEditor() {
    QuillManager.clearEditor('contactEditor');
}


/************************************* Form Event Handlers Calls ***************************/
//        All Form Event Handlers are here
/***************************************************************************/

//send Message

async function resultsToForm(strResult) {
  const result = document.getElementById("result");
  result.innerHTML = "Thank You! We have received your message! We'll be in touch with you shortly."; // + "<br/><b>PS:</b>" + strResult;
  document.getElementById("contactFieldset").disabled = true;
}

async function sendMessage() {
  try {
    btnContact.classList.add('loading');

    btnContact.disabled = true;
    btnContact.textContent = 'Submitting...';
    document.body.style.cursor = 'wait';

    //console.log("calling sendEmail...")
    const apiResult = await sendEmail();
    await resultsToForm("");

    //console.log('API call Result: ', apiResult);
    if (apiResult.status !== 200) throw new Error('Request failed');
    //showSuccessMessage();
    
    //const quoteResp = await getMessages();
    //await resultsToForm(quoteResp);

    console.log('Message Sent!');

  } catch (error) {
    console.log('Error :', error);
  } finally {
    // Reset state
    btnContact.disabled = false;
    btnContact.textContent = strsendMsgBtnText;
    document.body.style.cursor = 'default';
    btnContact.classList.remove('loading');
  }
}

/************************************* API Calls ***************************/
//        All API calls are here
/***************************************************************************/
async function sendEmail(){
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

async function getMessages() {
  try {
    const response = await fetch('https://official-joke-api.appspot.com/random_joke');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.setup;
  } catch (error) {
    console.error('Error:', error);
  }
}

async function postMessage() {
  const url = 'https://api.example.com/data';
  const data = {
    name: "John Doe",
    email: "john@example.com",
    subject: "Message Subject",
    message: "Here is the message!"
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Specify JSON data
        // 'Authorization': 'Bearer YOUR_TOKEN' // Add auth headers if needed
      },
      body: JSON.stringify(data) // Convert data to JSON string
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json(); // Parse JSON response
    console.log('Success:', responseData);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function submitForm() {
  const formData = new FormData();
  formData.append('name', 'john_doe');
  formData.append('email', 'john@example.com');
  formData.append('subject', 'Message Subject');
  formData.append('message', 'Here is the message!');
  //formData.append('profile_pic', fileInput.files[0]);

  try {
    const response = await fetch('https://api.example.com/upload', {
      method: 'POST',
      body: formData // No need for headers - browser sets multipart/form-data
    });
    // ... handle response
  } catch (error) {
    console.error('Error:', error);
  }
}

async function getMessages_axi() {
  try {
    const response = await axios.get('https://api.example.com/data');
    console.log('GET Response:', response.data);
  } catch (error) {
    console.error('GET Error:', error.response?.data || error.message);
  }
}

async function postMessage_axi() {
  const dataToSend = {
    name: "John Doe",
    email: "john@example.com",
    subject: "Message Subject",
    message: "Here is the message!"
  };

  try {
    const response = await axios.post(
      'https://api.example.com/users',
      dataToSend,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_TOKEN' // Optional
        }
      }
    );
    console.log('POST Response:', response.data);
  } catch (error) {
    console.error('POST Error:', error.response?.data || error.message);
  }
}