import { useContext, createContext, useState } from "react";
import { IContextProvider } from "../interfaces/Provider";
import { getSources } from '../utils/api';

export const SourcesContext = createContext({});
export default function SourcesProvider({ children }: IContextProvider) {
  const [sources, setSources] = useState<string[]>([]);

  async function retrieveSources() {
    const res = await getSources();
    setSources(res.vectorstores);
  }

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