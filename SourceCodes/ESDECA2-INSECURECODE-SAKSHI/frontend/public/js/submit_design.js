let $submitDesignFormContainer = $('#submitDesignFormContainer');
if ($submitDesignFormContainer.length != 0) {
  console.log('Submit design form detected. Binding event handling logic to form elements.');
  // If the jQuery object which represents the form element exists,
  // the following code will create a method to submit design details
  // to the server-side API when the #submitButton element fires the click event.
  $('#submitButton').on('click', function (event) {
    event.preventDefault();
    const baseUrl = 'http://52.2.77.200:5000';
    let userId = localStorage.getItem('user_id');
    let designTitle = $('#designTitleInput').val();
    let designDescription = $('#designDescriptionInput').val();
    let file = document.getElementById('fileInput').files[0];
    const token = localStorage.getItem('token');

    // Create the JSON payload
    let jsonData = {
      designTitle: designTitle,
      designDescription: designDescription,
      userId: userId,
      file: {
        path: `./${file.name}`, // Use the selected file's name
      },
    };

    axios({
      method: 'post',
      url: `https://uide6ygynd.execute-api.us-east-1.amazonaws.com/testS?designTitle=${encodeURIComponent(designTitle)}&designDescription=${encodeURIComponent(designDescription)}&userId=${encodeURIComponent(userId)}`,
      data: jsonData, // Use JSON payload
     timeout:5000,

      headers: {
        'user': userId,
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + token,
        // Set Content-Type to JSON
      },
    })
    .then(function (response) {
      Noty.overrideDefaults({
        callbacks: {
          onTemplate: function () {
            if (this.options.type === 'systemresponse') {
              this.barDom.innerHTML = '<div class="my-custom-template noty_body">';
              this.barDom.innerHTML += '<div class="text-black noty-header">Message:</div>';
              this.barDom.innerHTML += '<p class="text-black noty-message-body">' + this.options.text + '</p>';
              this.barDom.innerHTML += '<img src="' + this.options.imageURL + '">';
              this.barDom.innerHTML += '<div>';
            }
          },
        },
      });

      new Noty({
        type: 'systemresponse',
        layout: 'topCenter',
        timeout: '5000',
        text: response.data.message,
        imageURL: response.data.imageURL,
      }).show();
    })
    .catch(function (error) {
      alert(error);
      alert(designTitle);

      console.dir(error);
      new Noty({
        type: 'error',
        timeout: '6000',
        layout: 'topCenter',
        theme: 'sunset',
        text: 'Unable to submit design file.',
      }).show();
    });
  });
} // End of checking for $submitDesignFormContainer jQuery object
