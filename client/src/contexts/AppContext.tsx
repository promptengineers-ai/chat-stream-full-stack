import { useContext, createContext } from "react";
import { IContextProvider } from "../interfaces/Provider";

export const AppContext = createContext({});

export default function AppProvider({ children }: IContextProvider) {

  return (
    <AppContext.Provider
      value={{
        
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): any {
  return useContext(AppContext);
}