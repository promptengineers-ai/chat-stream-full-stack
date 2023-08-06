import config from '../config';
import { getLastUserIndex } from './chat';

/**----------------------------------------------------------
 * Retrieve the vectorstores from the server
 * ----------------------------------------------------------
 * @returns 
 */
export async function getSources() {
	return fetch(`${config.api.SERVER_URL}/vectorstores`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
	})
	.then(response => response.json())
	.catch(error => console.error('Error:', error));
}

/**----------------------------------------------------------
 * Send a message to the server and get a response
 * ----------------------------------------------------------
 * @returns 
 */
export function sendContextMessage(
  payload: {
    model: string,
    source: string,
    temperature: number,
    messages: {role: string, content: string}[],
  },
  cb: (streamMessages: {role: string, content: string}[]) => void
) {

  if (!payload.source) {
    alert('Please select a vectorstore.');
    return;
  }
  
  // Add the user's message to the messages array
	let userMessageDiv = document.createElement('div');
	userMessageDiv.innerHTML = config.marked.parse(
    payload.messages[getLastUserIndex(payload.messages)].content
  );

  // Add a delete button to the user's message
	let deleteButton = document.createElement('button');
	let icon = document.createElement('i');
	icon.className = 'fas fa-undo';
	deleteButton.appendChild(icon);
	deleteButton.className = 'delete-btn';

  // Add the delete button and message text to the message div
	let messageWrapper = document.createElement('div');

	messageWrapper.appendChild(deleteButton);
	userMessageDiv.appendChild(messageWrapper);

  // Add the classes to the message div
	userMessageDiv.className = 'message user';
	messageWrapper.className = 'message-wrapper';

  // Add the message div to the chatbox
  let chatbox = document.getElementById('chatbox') as HTMLDivElement;
	chatbox.appendChild(userMessageDiv);

  fetch(`${config.api.SERVER_URL}/chat/stream/vectorstore`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      session_id: '2323d2', 
      messages: payload.messages, 
      vectorstore: payload.source,
      model: payload.model,
      temperature: payload.temperature,
    }),
  }).then(response => {
    console.log('Server Response:', response);
    
    let reader = response.body?.getReader();
    let decoder = new TextDecoder();
    let accumulator = "";
    let assistantMessage = "";
    let assistantMessageDiv = document.createElement('div');

    reader?.read().then(function processMessage({done, value}): Promise<void> {
      if (done) {
        console.log('Stream complete', payload.messages)
        cb(payload.messages)
        return Promise.resolve();  // return a resolved Promise
      }
    
      // add the new data to the accumulator
      accumulator += decoder.decode(value);
    
      // while there are complete messages in the accumulator, process them
      let newlineIndex;
      while ((newlineIndex = accumulator.indexOf("\n\n")) >= 0) {
        let message = accumulator.slice(0, newlineIndex);
        accumulator = accumulator.slice(newlineIndex + 2);
    
        if (message.startsWith("data: ")) {
          message = message.slice(6);
        }
    
        // append the message to the DOM
        console.log(JSON.parse(message));
        let parsed = JSON.parse(message).message;
        assistantMessage += parsed;

        if (JSON.parse(message).type === "end") {
          payload.messages.push({
            role: "assistant", 
            content: assistantMessage
          });
          assistantMessage = ""; // reset the assistant message for the next response
        } else {							
          assistantMessageDiv.innerHTML = config.marked.parse(assistantMessage);
        }
        
        assistantMessageDiv.className = 'message assistant';
        assistantMessageDiv.style.display = 'block'; 
        // add the assistant message to the chatbox
        chatbox.appendChild(assistantMessageDiv);

        // scroll to the bottom every time a new message is added
	      chatbox.scrollTop = chatbox.scrollHeight;
      }
    
      // continue reading from the stream
      return (reader?.read().then(processMessage)) ?? Promise.resolve();
    })    
  });
}