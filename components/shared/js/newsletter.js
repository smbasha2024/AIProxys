apiUrl = window.AppConfig.apiBaseUrl;
apiEmailUrl = apiUrl + "emails";
apiEmail = window.AppConfig.apiBaseEmail;

const txtSubscribeEmail = document.getElementById('subscriberEmail');
const lblResult = document.getElementById('result')

//console.log("Basha:", apiUrl, apiEmailUrl, apiEmail, window.AppConfig.searchData)

/************************************* API Calls ***************************/
//        All API calls are here
/***************************************************************************/
async function sendEmail(){
    const url = apiEmailUrl;
    const email = [apiEmail];
    const subject = "Newsletter Subscription"; 
    const message = "Newsletter Subscription";  // txtEmailMessage.value
    const name = "Newsletter Subscription";
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
        lblResult.style.color = "white";
        lblResult.innerHTML = "✅   Your email successfully subscribed for newsletter!";
      return {'status': 200, message: responseData}
    } catch (error) {
      //console.error('Error:', error);
      lblResult.style.color = "red";
      if (error.message.includes("Failed to fetch")){
        lblResult.innerHTML = "❌   Server is down. Please try again later."
      }
      else {
        lblResult.innerHTML = "❌   Something went wrong."
      }
    }
}