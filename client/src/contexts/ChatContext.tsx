import { useContext, createContext } from "react";
import { IContextProvider } from "../interfaces/Provider";

export const ChatContext = createContext({});
export default function ChatProvider({ children }: IContextProvider) {

  return (
    <ChatContext.Provider
      value={{
        
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext(): any {
  return useContext(ChatContext);
}