import config from '../config';
import { 
  constructUserMessageDiv, 
  readStreamResponse,
} from './chat';

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
 export function sendOpenAiChatMessage(
  payload: {
    model: string,
    temperature: number,
    messages: {role: string, content: string}[],
  },
  cb: (streamMessages: {role: string, content: string}[]) => void
) {
  // Add the user's message to the messages array
	let userMessageDiv = constructUserMessageDiv(payload.messages);

  // Add the message div to the chatbox
  let chatbox = document.getElementById('chatbox') as HTMLDivElement;
	chatbox.appendChild(userMessageDiv);

  fetch(`${config.api.SERVER_URL}/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      session_id: '2323d2', 
      messages: payload.messages,
      model: payload.model,
      temperature: payload.temperature,
    }),
  }).then(response => {
    console.log('Server Response:', response);
    readStreamResponse(response, payload.messages, chatbox, cb);   
  });
}

/**----------------------------------------------------------
 * Send a message to the server and get a response
 * ----------------------------------------------------------
 * @returns 
 */
 export function sendOpenAiFunctionChatMessage(
  payload: {
    model: string,
    temperature: number,
    messages: {role: string, content: string}[],
    functions: string[],
  },
  cb: (streamMessages: {role: string, content: string}[]) => void
) {
  // Add the user's message to the messages array
	let userMessageDiv = constructUserMessageDiv(payload.messages);

  // Add the message div to the chatbox
  let chatbox = document.getElementById('chatbox') as HTMLDivElement;
	chatbox.appendChild(userMessageDiv);

  fetch(`${config.api.SERVER_URL}/chat/stream/functions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      session_id: '2323d2', 
      messages: payload.messages,
      model: payload.model,
      temperature: payload.temperature,
      functions: payload.functions,
    }),
  }).then(response => {
    console.log('Server Response:', response);
    readStreamResponse(response, payload.messages, chatbox, cb);   
  });
}

/**----------------------------------------------------------
 * Send a message to the server and get a response
 * ----------------------------------------------------------
 * @returns 
 */
export function sendLangchainVectorstoreChatMessage(
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
	let userMessageDiv = constructUserMessageDiv(payload.messages);

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
    readStreamResponse(response, payload.messages, chatbox, cb);   
  });
}

/**----------------------------------------------------------
 * Send a message to the server and get a response
 * ----------------------------------------------------------
 * @returns 
 */
 export function sendLangchainAgentChatMessage(
  payload: {
    model: string,
    temperature: number,
    messages: {role: string, content: string}[],
  },
  cb: (streamMessages: {role: string, content: string}[]) => void
) {
  // Add the user's message to the messages array
	let userMessageDiv = constructUserMessageDiv(payload.messages);

  // Add the message div to the chatbox
  let chatbox = document.getElementById('chatbox') as HTMLDivElement;
	chatbox.appendChild(userMessageDiv);

  fetch(`${config.api.SERVER_URL}/chat/stream/agent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      session_id: '2323d2', 
      messages: payload.messages,
      model: payload.model,
      temperature: payload.temperature,
    }),
  }).then(response => {
    console.log('Server Response:', response);
    readStreamResponse(response, payload.messages, chatbox, cb);   
  });
}