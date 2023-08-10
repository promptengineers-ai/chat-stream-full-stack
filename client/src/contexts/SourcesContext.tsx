import { useContext, createContext, useState, useEffect, useCallback } from "react";
import { IContextProvider } from "../interfaces/Provider";
import { getSources } from '../utils/api';

export const SourcesContext = createContext({});
export default function SourcesProvider({ children }: IContextProvider) {
  const [sources, setSources] = useState<string[]>([]);

  const retrieveSources = useCallback(async () => {
    // Your actual code here
    const res = await getSources();
    setSources(res.vectorstores);
  }, []);

  useEffect(() => {
    retrieveSources();
  }, [retrieveSources])

  return (
    <SourcesContext.Provider
      value={{
        retrieveSources,
        sources,
        setSources,
      }}
    >
      {children}
    </SourcesContext.Provider>
  );
}

export function useSourcesContext(): any {
  return useContext(SourcesContext);
}