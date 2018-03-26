window.onload = () => {

  // Get references to elements on the page.
  const form = document.getElementById('message-form');
  const messageField = document.getElementById('message');
  const messagesList = document.getElementById('messages');
  const socketStatus = document.getElementById('status');
  const closeBtn = document.getElementById('close');
  let isOpen = false;


  const wsConnect = () => {
    socket = new WebSocket('ws://echo.websocket.org');
    // Handle any errors that occur.
    socket.onerror = error => {
      console.log('WebSocket Error: ' + error);
      socketStatus.innerHTML = 'Reconnecting :( Please try to send your message again in 5.';
      socketStatus.className = 'closed';
    };

    // Show a connected message when the WebSocket is opened.
    socket.onopen = event => {
      socketStatus.innerHTML = 'Connected to: ' + event.currentTarget.url;
      socketStatus.className = 'open';
      isOpen = true;
    };

    // Show a disconnected message when the WebSocket is closed.
    socket.onclose = event => {
      socketStatus.innerHTML = 'Disconnected from WebSocket.';
      socketStatus.className = 'closed';
      isOpen = false;
    };


    // Handle messages sent by the server.
    socket.onmessage = event => {
      var message = event.data;
      messagesList.innerHTML += '<li class="received"><span>Received:</span>' +
        message + '</li>';
    };

    return socket;

  }
  
  // Create a new WebSocket.
  let socket = wsConnect();

  // Send a message when the form is submitted.
  form.onsubmit = e => {
    e.preventDefault();

    if (!isOpen) {
      wsConnect();
  }
    // Retrieve the message from the textarea.
    let message = messageField.value;

    // Send the message through the WebSocket.
    try {
      socket.send(message);
    }  
    catch (ex) {
      // Add the message to the messages list.
      messagesList.innerHTML += '<li class="closed"><span>Error:</span> That message didn\'t send as the chat is reconnecting :( please try again in 5 seconds.</li>';
    }
    // Add the message to the messages list.
    messagesList.innerHTML += `<li class="sent"><span>Sent:</span> ${message} </li>`;

    // Clear out the message field.
    messageField.value = '';

    return false;
  };


  // Close the WebSocket connection when the close button is clicked.
  closeBtn.onclick = e => {
    e.preventDefault();

    // Close the WebSocket.
    socket.close();
    isOpen = false;

    return false;
  };

};
