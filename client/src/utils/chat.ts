import config from '../config';

export const getLastUserIndex = (messages: {role: string, content: string}[]): number => {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'user') {
      // Return the index if the object property "role" is equal to "user"
      return i;
    }
  }
  // Return -1 if no object property "role" is equal to "user"
  return -1;
};

export function constructAssistantMessageDiv() {
  let assistantMessageDiv = document.createElement('div');
  assistantMessageDiv.className = 'message assistant';
  assistantMessageDiv.style.display = 'block'; 
  return assistantMessageDiv;
}

export function constructDeleteMessageButton() {
  let deleteButton = document.createElement('button');
	let icon = document.createElement('i');
	icon.className = 'fas fa-undo';
	deleteButton.appendChild(icon);
	deleteButton.className = 'delete-btn';
  return deleteButton;
}

export function constructUserMessageDiv(messages: {role: string, content: string}[]) {
  // Add the user's message to the messages array
	let userMessageDiv = document.createElement('div');
  userMessageDiv.className = 'message user';
	userMessageDiv.innerHTML = config.marked.parse(
    messages[getLastUserIndex(messages)].content
  );
  // Add a delete button to the user's message
	let deleteButton = constructDeleteMessageButton();
  // Add the delete button and message text to the message div
	let messageWrapper = document.createElement('div');
  messageWrapper.className = 'message-wrapper';
  messageWrapper.appendChild(deleteButton);
	userMessageDiv.appendChild(messageWrapper);
  return userMessageDiv;
}