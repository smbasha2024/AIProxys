apiUrl = window.AppConfig.apiBaseUrl;
apiEmailUrl = apiUrl + "emails";
apiEmail = window.AppConfig.apiBaseEmail;
apiKeyEmail = window.AppConfig.apiKeyEmail;

//console.log("Basha:", apiUrl, apiEmailUrl, apiEmail, window.AppConfig.searchData)
function initNewsletterPage(){
  // To set the Send Message button to diabled till all input fields are valid.
  const frmNewsletter = document.getElementById("newsletterForm");   //subscriberEmail
  const btnSubscribe = document.getElementById("emailSubscribe");
  const mandatoryFields = frmNewsletter.querySelectorAll('[required]');

  // Check form validity on input
  frmNewsletter.addEventListener('input', () => {
    //console.log('Form valid?', frmNewsletter.checkValidity());
    btnSubscribe.disabled = !frmNewsletter.checkValidity();
  });

  // Initial check
  //console.log('Form valid?', frmNewsletter.checkValidity());
  btnSubscribe.disabled = !frmNewsletter.checkValidity();

  // Optional: Add visual feedback
  mandatoryFields.forEach(field => {
    if (field.tagName !== 'DIV'){
      field.addEventListener('input', () => {
        field.classList.toggle('valid', field.checkValidity());
      });
    }
  });

  document.getElementById('subscriberEmail').addEventListener('input', function() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(this.value)) {
      this.classList.add('valid');
    } else {
      this.classList.remove('valid');
    }
  });
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
  initNewsletterPage();
});

function resetContactForm(){
  const frmNewsletter = document.getElementById("newsletterForm");
  const fsNewsFieldSet = document.getElementById("newsletterFieldset");
  const btnSubscribe = document.getElementById("emailSubscribe");

  frmNewsletter.reset();  // clears all field values
  btnSubscribe.disabled = true;  // disable submit again
  fsNewsFieldSet.classList.remove("was-validated");
  frmNewsletter.classList.remove("was-validated");
  fsNewsFieldSet.disabled = false;
}

/************************************* API Calls ***************************/
//        All API calls are here
/***************************************************************************/
async function resultsToNewsForm(strResult, bSuccess) {
  const lblResult = document.getElementById("result");

  lblResult.style.paddingLeft = "15px";
  lblResult.style.fontSize = "1.2rem"

  if(bSuccess) {
    lblResult.style.color = "white";
    result.innerHTML = "✅   Your email subscription for newsletter is successful !"; // + "<br/><b>PS:</b>" + strResult;
    document.getElementById("newsletterFieldset").disabled = true;
  }
  else {
    lblResult.style.color = "red";
    lblResult.innerHTML = "❌   Server is down. Please try again later."
  }
}

async function subscribeToNewsletter() {
  const btnSubscribe = document.getElementById('emailSubscribe');
  try {
    btnSubscribe.classList.add('loading');

    btnSubscribe.disabled = true;
    //btnSubscribe.textContent = 'Submitting...';
    document.body.style.cursor = 'wait';

    //console.log("calling sendEmail...")
    const apiResult = await sendEmailNews();

    //console.log('API call Result: ', apiResult);
    if (apiResult.status !== 200) throw new Error('Request failed');
    await resultsToNewsForm("", true);

  } catch (error) {
    console.log('Error :', error);
  } finally {
    // Reset state
    btnSubscribe.disabled = false;
    //btnSubscribe.textContent = "Send Message";
    document.body.style.cursor = 'default';
    btnSubscribe.classList.remove('loading');
  }
}

async function sendEmailNews(){
    const url = apiEmailUrl;
    const email = [apiEmail];
    const subject = "Newsletter Subscription"; 
    const message = "Newsletter Subscription";  // txtEmailMessage.value
    const name = "Newsletter Subscription";

    const txtSubscribeEmail = document.getElementById('subscriberEmail');
    const lblResult = document.getElementById('result');
    const customer_email = txtSubscribeEmail.value;

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
    //console.log(payload); return;
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
      //console.error('Error:', error);
      await resultsToNewsForm("", false);
    }
}