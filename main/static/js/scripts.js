// Function to handle sending the message
async function sendMessage() {
    const inputField = document.getElementById('user-input');
    const sendButton = document.querySelector('#input-area button');  // Get the send button
    const query = inputField.value.trim();  // Trim extra spaces
    if (!query) return;  // Do nothing if the input is empty

    // Disable the send button and change its color
    sendButton.disabled = true;
    sendButton.classList.add('disabled');

    // Display user message in chatbox on the right
    const chatbox = document.getElementById('chatbox');
    chatbox.innerHTML += `<div class="message user-message">${query}</div>`;
    inputField.value = '';  // Clear the input field

    // Display the loading indicator for bot response
    const loadingIndicator = document.createElement('div');
    loadingIndicator.classList.add('message', 'bot-message');
    loadingIndicator.innerHTML = `
        <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
        </div>`;
    chatbox.appendChild(loadingIndicator);
    chatbox.scrollTop = chatbox.scrollHeight;  // Scroll to the bottom

    try {
        // Send query to the backend
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });

        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
            throw new Error('Failed to fetch response from the backend');
        }

        // Get the plain text response from the server
        const responseText = await response.text();

        // Remove the loading indicator
        chatbox.removeChild(loadingIndicator);

        // Check if the response is empty or undefined
        if (!responseText) {
            throw new Error('Response from the backend is undefined');
        }

        // Use `marked` to parse the markdown and convert it to HTML
        let markdownResponse = marked.parse(responseText);

        // Display bot message in chatbox on the left with parsed HTML
        chatbox.innerHTML += `<div class="message bot-message">${markdownResponse}</div>`;
        chatbox.scrollTop = chatbox.scrollHeight;  // Scroll to the bottom
    } catch (error) {
        console.error('Error fetching the chatbot response:', error);

        // Remove the loading indicator
        chatbox.removeChild(loadingIndicator);

        // Display error message in red
        chatbox.innerHTML += `<div class="message bot-message error-message">There was an error processing your request. Please try again.</div>`;
        chatbox.scrollTop = chatbox.scrollHeight;  // Scroll to the bottom
    } finally {
        // Re-enable the send button and restore its color
        sendButton.disabled = false;
        sendButton.classList.remove('disabled');
    }
}

// Detect 'Enter' key press and send message
const inputField = document.getElementById('user-input');
inputField.addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && !document.querySelector('#input-area button').disabled) {  // Ensure the button is not disabled
        sendMessage();
    }
});
