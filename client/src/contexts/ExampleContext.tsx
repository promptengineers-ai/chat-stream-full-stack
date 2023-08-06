import { useContext, createContext } from "react";
import { IContextProvider } from "../interfaces/Provider";

export const ExampleContext = createContext({});

export default function ExampleProvider({ children }: IContextProvider) {

  return (
    <ExampleContext.Provider
      value={{
        
      }}
    >
      {children}
    </ExampleContext.Provider>
  );
}

export function useExampleContext(): any {
  return useContext(ExampleContext);
}