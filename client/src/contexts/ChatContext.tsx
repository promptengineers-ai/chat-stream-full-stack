import { useContext, createContext, useState } from "react";
import { IContextProvider } from "../interfaces/Provider";
import { sendContextMessage } from "../utils/api";
import { useSourcesContext } from "./SourcesContext";

export const ChatContext = createContext({});
export default function ChatProvider({ children }: IContextProvider) {
  const { sources } = useSourcesContext();
  const [chatPayload, setChatPayload] = useState({
    systemMessage: 'You are a helpful assistant.',
    query: '',
    temperature: 0,
    model: 'gpt-3.5-turbo',
    vectorstore: '',
  });
  const [messages, setMessages] = useState([
    {role: 'system', content: ''},
  ]);

  function sendChatPayload(pathname: string) {
    // append the user's message to the conversation
    messages[0].content = localStorage.getItem('systemMessage') || chatPayload.systemMessage;
    messages.push({role: 'user', content: chatPayload.query});
    if (pathname === '/vectorstore') {
      sendContextMessage({
        model: localStorage.getItem('model') || chatPayload.model,
        source: localStorage.getItem('source') || sources[0],
        temperature: parseFloat(localStorage.getItem('temperature') || '') || chatPayload.temperature,
        messages: messages
      }, setMessages);
    } else {
      alert("This feature is not available yet.");
      return;
    }
    setChatPayload({...chatPayload, query: ''});
  }

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
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