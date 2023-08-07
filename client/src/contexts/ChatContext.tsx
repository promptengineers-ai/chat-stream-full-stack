import { useContext, createContext, useState } from "react";
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
  const { setLoading } = useAppContext();
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

  function updateCallback(streamMessages: {role: string, content: string}[]): void {
    setMessages(streamMessages);
    setLoading(false);
    setChatPayload({...chatPayload, query: ''});
  }

  function sendChatPayload(pathname: string) {
    if (!chatPayload.query) {
      alert('Please enter a message first.');
      return;
    }
    setLoading(true);
    // Append the user's message to the conversation
    messages[0].content = localStorage.getItem('systemMessage') || chatPayload.systemMessage;
    messages.push({role: 'user', content: chatPayload.query});

    // Construct the payload
    const model = localStorage.getItem('model') || chatPayload.model;
    const temperature = parseFloat(localStorage.getItem('temperature') || '') || chatPayload.temperature;
    const payload = {
      model,
      temperature,
      messages,
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

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        resetMessages,
        chatPayload,
        setChatPayload,
        sendChatPayload,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext(): any {
  return useContext(ChatContext);
}