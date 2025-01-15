import React, { createContext, useState, ReactNode } from 'react';

type Anchor = {
  id: string;
  name: string;
  coordinates: { x: number; y: number } | null;
  distance: number | null; // Add distance here
}

export const AnchorsContext = createContext<{
  globalAnchors: Record<string, Anchor>;
  setGlobalAnchors: React.Dispatch<
    React.SetStateAction<
      Record<string, Anchor>
    >
  >;
}>({
  globalAnchors: {},
  setGlobalAnchors: () => { },
});

export const AnchorsProvider = ({ children }: { children: ReactNode }) => {
  const [globalAnchors, setGlobalAnchors] = useState<
    Record<string, Anchor>
  >({});

  return (
    <AnchorsContext.Provider value={{ globalAnchors, setGlobalAnchors }}>
      {children}
    </AnchorsContext.Provider>
  );
};