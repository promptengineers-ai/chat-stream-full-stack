

let chatbox = document.getElementById('chatbox');
let userInput = document.getElementById('userInput');
let messageForm = document.getElementById('messageForm');
let sessionID = Math.random().toString(36).substring(2, 15);
// Get the system message and model type from localStorage
let modelType = localStorage.getItem('modelType') || 'gpt-3.5-turbo';
let systemMessage = localStorage.getItem('systemMessage') || 'You are a helpful assistant.';

// Focus on Chat Input
userInput.focus();

let messages = [
	{
		"role": "system", 
		"content": systemMessage
	}
];

document.getElementById('setSystemMessage').addEventListener('click', function () {
	// Get the text from the textarea
	let text = document.getElementById('systemMessage').value;
	let model = document.getElementById('modelType').value;

	// Save the system message to localStorage
	localStorage.setItem('systemMessage', text);
	localStorage.setItem('modelType', model);
	console.log(`System message: ${text}`);
	console.log(`Model type: ${model}`);
	alert("Settngs saved!");
	// Hide the offcanvas
	let offcanvasElement = document.getElementById('offcanvasExample');
	let offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasElement);
	offcanvasInstance.hide();
}, false);

// Message Actions
document.body.addEventListener('click', function(event) {
	// Copy a code block to clipboard
	if (event.target.closest('.copy-btn')) {
		// Get the adjacent code element
		const code = event.target.closest('pre').querySelector('code');
		// Copy its contents to clipboard
		navigator.clipboard.writeText(code.textContent).then(function() {
			console.log('Copying to clipboard was successful!');
		}, function(err) {
			console.error('Could not copy text: ', err);
		});
	}
	// Delete a message
	if (event.target.closest('.delete-btn')) {
		// Get the message element
		let messageDiv = event.target.closest('.message');
		let allMessages = Array.from(chatbox.children);
		// Get the index of the message in the 'messages' array
		let messageIndex = allMessages.indexOf(messageDiv);
		// If it's the first user message, don't delete system message in the 'messages' array
		if (messageIndex === 1 && messages[1].role === 'user') {
			messages = messages.slice(0, messageIndex);
		} else {
			messages = messages.slice(0, messageIndex + 1);
		}
		// Remove all messages after the deleted message
		for (let i = messageIndex; i < allMessages.length; i++) {
			chatbox.removeChild(allMessages[i]);
		}
		// Set the input field to the deleted message
		userInput.value = messageDiv.textContent.replace('Delete', '').trim();
		userInput.focus();
	}
});

// Send a message to the server when the user submits the form
messageForm.addEventListener('submit', function(event) {
	// prevent the form from submitting normally
	event.preventDefault();

	let userMessage = userInput.value;
	if (userMessage.trim() === '') {
			return; // don't send an empty message
	}

	// append the user's message to the conversation
	messages.push({role: "user", content: userMessage});

	// create a div for the user's message
	let userMessageDiv = document.createElement('div');
	let messageText = document.createElement('span');
	messageText.textContent = userMessage;

	// Add a delete button to the user's message
	let deleteButton = document.createElement('button');
	let icon = document.createElement('i');
	icon.className = 'fas fa-undo';
	deleteButton.appendChild(icon);
	deleteButton.className = 'delete-btn';

	// Add the delete button and message text to the message div
	let messageWrapper = document.createElement('div');
	messageWrapper.appendChild(deleteButton);
	messageWrapper.appendChild(messageText);
	userMessageDiv.appendChild(messageWrapper);

	// Add the classes to the message div
	userMessageDiv.className = 'message user';
	messageWrapper.className = 'message-wrapper';

	// Add the message div to the chatbox
	chatbox.appendChild(userMessageDiv);

	// scroll to the bottom every time a new message is added
	chatbox.scrollTop = chatbox.scrollHeight;

	// reset the input field
	userInput.value = '';
	
	sendChatMessage(messages, sessionID, userInput, chatbox);
});