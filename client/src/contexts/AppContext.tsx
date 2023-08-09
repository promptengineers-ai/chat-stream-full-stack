import { useContext, createContext, useState } from "react";
import { IContextProvider } from "../interfaces/Provider";

export const AppContext = createContext({});

export default function AppProvider({ children }: IContextProvider) {

  const [loading, setLoading] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);

  return (
    <AppContext.Provider
      value={{
        loading,
        setLoading,
        active,
        setActive,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): any {
  return useContext(AppContext);
}