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

export function readStreamResponse(
  response: any, 
  messages: {role: string, content: string}[], 
  chatbox: HTMLDivElement,
  cb: (streamMessages: {role: string, content: string}[]) => void
) {
  let reader = response.body?.getReader();
  let decoder = new TextDecoder();
  let accumulator = "";
  let assistantMessage = "";
  let assistantMessageDiv = constructAssistantMessageDiv();

  reader?.read().then(function processMessage(
    {done, value}: {done: boolean, value: Uint8Array}
  ): Promise<void> {
    if (done) {
      console.log('Stream complete', messages)
      cb(messages)
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
        assistantMessageDiv.innerHTML = config.marked.parse(assistantMessage);
      }
      
      // add the assistant message to the chatbox
      chatbox.appendChild(assistantMessageDiv);

      // scroll to the bottom every time a new message is added
      chatbox.scrollTop = chatbox.scrollHeight;
    }
  
    // continue reading from the stream
    return (reader?.read().then(processMessage)) ?? Promise.resolve();
  }) 
}