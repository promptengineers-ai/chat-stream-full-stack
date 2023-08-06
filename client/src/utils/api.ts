import config from '../config';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark-dimmed.css';

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

const messages = [
  {role: 'system', content: 'You are a helpful assistant.'}
];

const renderer = new marked.Renderer();
renderer.codespan = function(text) {
	return `<code class="my-custom-class">${text}</code>`;
};
renderer.code = function(code, language, isEscaped) {
	// Check whether the given language is valid for highlight.js.
	const validLang = !!(language && hljs.getLanguage(language));
	// Highlight only if the language is valid.
	const highlighted = validLang ? hljs.highlight(code, { language }).value : code;
	// Render the highlighted code with `hljs` class.
	if (language) {
		return `<pre class="my-custom-code-class hljs ${language}" style="padding: 0;"><div style="background-color: black; color: white;"><p style="padding: 5px; margin: 0; display: flex; justify-content: space-between;">${language}<button class="copy-btn"><i class="fas fa-copy"></i></button></p></div><code class="hljs ${language}" style="padding: 15px;">${highlighted}</code></pre>`;
	} else {
		return `<pre class="my-custom-code-class" style="padding: 0;"><code class="hljs ${language}" style="padding: 15px;">${highlighted}</code></pre>`;
	}
};
renderer.link = function( href, title, text ) {
	return '<a target="_blank" href="'+ href +'" title="' + title + '">' + text + '</a>';
}

// Set options for marked
marked.setOptions({
  headerIds: false,
  mangle: false,
  renderer: renderer,
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  },
});

/**
 * Send a message to the server and get a response
 * @returns 
 */
export function sendContextMessage() {
  // Get the system message and model type from localStorage
  let chatbox = document.getElementById('chatbox') as HTMLDivElement;
  let selectSource = 'formio.pkl';
  let modelType = 'gpt-3.5-turbo';
  let systemMessage = localStorage.getItem('systemMessage') || 'You are a helpful assistant.';
  messages[0].content = systemMessage;

  // create a div for the user's message
  let userMessage = 'Can you provide a react code sample to render a form?';

  // append the user's message to the conversation
	messages.push({role: "user", content: userMessage});

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

  if (!selectSource) {
    alert('Please select a vectorstore.');
    return;
  }

  fetch(`${config.api.SERVER_URL}/chat/stream/vectorstore`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      session_id: '2323d2', 
      messages: messages, 
      vectorstore: selectSource,
      model: modelType,
      temperature: 0.9,
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
        console.log('Stream complete');
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
          messages.push({
            role: "assistant", 
            content: assistantMessage
          });
          assistantMessage = ""; // reset the assistant message for the next response
        } else {							
          assistantMessageDiv.innerHTML = marked.parse(assistantMessage);
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