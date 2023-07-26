let decoder = new TextDecoder();
let accumulator = "";
let assistantMessage = "";
let assistantMessageDiv = document.createElement('div');


function appendMessage(message, assistantMessageDiv, chatbox) {
	console.log(JSON.parse(message));
	parsed = JSON.parse(message).message;
	// append the assistant's message to the conversation
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

	// scroll to the bottom every time a new message is added
	chatbox.scrollTop = chatbox.scrollHeight;
}

function readMessage(reader, userInput, assistantMessageDiv, chatbox) {
	reader.read().then(function processMessage({done, value}) {
		if (done) {
			// if the stream is done but there's still content in the accumulator, append it
			if (accumulator) {
				appendMessage(accumulator, assistantMessageDiv, chatbox);
				userInput.focus();
			}
			return;
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
			appendMessage(message, assistantMessageDiv, chatbox);
			userInput.focus();
		}

		// continue reading from the stream
		return reader.read().then(processMessage);
	});
}
