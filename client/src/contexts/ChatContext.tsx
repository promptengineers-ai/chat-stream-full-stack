import { useContext, createContext, useState, useRef, useEffect } from "react";
import { IContextProvider } from "../interfaces/Provider";
import { 
  sendLangchainAgentChatMessage,
  sendLangchainVectorstoreChatMessage, 
  sendOpenAiChatMessage,
  sendOpenAiFunctionChatMessage,
} from "../utils/api";
import { useAppContext } from "./AppContext";
import { useSourcesContext } from "./SourcesContext";

export const ChatContext = createContext({});
export default function ChatProvider({ children }: IContextProvider) {
  const chatboxRef = useRef(null);
  const userInputRef = useRef<HTMLInputElement | null>(null);
  const { setLoading, setActive } = useAppContext();
  const { sources } = useSourcesContext();
  const [chatPayload, setChatPayload] = useState({
    systemMessage: 'You are a helpful assistant.',
    query: '',
    temperature: 0,
    model: 'gpt-3.5-turbo',
    vectorstore: '',
    functions: [
      "get_current_weather",
      "get_latest_market_news"
    ]
  });
  const [messages, setMessages] = useState([
    {role: 'system', content: ''},
  ]);

  const resetMessages = () => {
    setMessages([
      {role: 'system', content: ''},
    ]);  
  };

  function handleChatboxClick(e: MouseEvent) {
    console.log('Chatbox button clicked');
    if ((e.target as HTMLElement).closest('.copy-btn')) {
      console.log('Copy button clicked');
      // 2. Get the code content
      const preElement = (e.target as HTMLElement).closest('pre');
      const codeContent = preElement?.querySelector('code')?.innerText || '';
      console.log(codeContent)
      // 3. Use Clipboard API to copy
      navigator.clipboard.writeText(codeContent).then(() => {
        // Optional: Show a toast or feedback to user saying "Copied to clipboard!"
        alert('Copied to clipboard!');
        return;
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    }

    if ((e.target as HTMLElement).closest('.delete-btn')) {
      const chatbox = document.getElementById('chatbox') as HTMLElement;
      const messageDiv = (e.target as HTMLElement).closest('.message') as HTMLElement;
      const allMessages = Array.from(chatbox.children);
      const messageIndex = allMessages.indexOf(messageDiv);

      // Create a copy of the current messages
      const updatedMessages = [...messages];
      let lastElement = updatedMessages[messageIndex + 1];
      setChatPayload({...chatPayload, query: lastElement.content});

      // Remove elements from the array
      allMessages.splice(messageIndex);
      updatedMessages.splice(messageIndex+1); // Includes a system message
      setMessages(updatedMessages);

      // Remove corresponding DOM elements
      while (chatbox.children.length > messageIndex) {
        chatbox.removeChild(chatbox.lastChild!);
      }
    }
  }

  function updateCallback(streamMessages: {role: string, content: string}[]): void {
    setMessages(streamMessages);
    setLoading(false);
    setChatPayload({...chatPayload, query: ''});
    userInputRef.current?.focus();
  }

  function sendChatPayload(pathname: string) {
    if (!chatPayload.query) {
      alert('Please enter a message first.');
      return;
    }
    setLoading(true);

    // Create a copy of the current messages
    const updatedMessages = [...messages];

    // Append the user's message to the conversation
    updatedMessages[0].content = localStorage.getItem('systemMessage') || chatPayload.systemMessage;
    updatedMessages.push({role: 'user', content: chatPayload.query});

    // Construct the payload
    const model = localStorage.getItem('model') || chatPayload.model;
    const temperature = parseFloat(localStorage.getItem('temperature') || '') || chatPayload.temperature;
    const payload = {
      model,
      temperature,
      messages: updatedMessages,
    }

    // Send the message to the appropriate API
    if (pathname === '/') {
      sendOpenAiChatMessage(payload, updateCallback);
    } else if (pathname === '/functions') {
      sendOpenAiFunctionChatMessage({
        ...payload,
        functions: chatPayload.functions
      }, updateCallback);
    } else if (pathname === '/vectorstore') {
      sendLangchainVectorstoreChatMessage({
        ...payload,
        source: localStorage.getItem('source') || sources[0],
      }, updateCallback);
    } else if (pathname === '/agent') {
      sendLangchainAgentChatMessage(payload, updateCallback);
    } else {
      alert("This feature is not available yet.");
      return;
    }
  }

  useEffect(() => {
    // 1. Add an event listener on the chatbox
    const chatbox = document.getElementById('chatbox');
    chatbox?.addEventListener('click', handleChatboxClick);
    
    userInputRef.current?.focus();

    // Cleanup event listener
    return () => {
      chatbox?.removeEventListener('click', handleChatboxClick);
    };
  }, [,messages]);

  return (
    <ChatContext.Provider
      value={{
        chatboxRef,
        userInputRef,
        messages,
        setMessages,
        resetMessages,
        chatPayload,
        setChatPayload,
        sendChatPayload,
        handleChatboxClick,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext(): any {
  return useContext(ChatContext);
}