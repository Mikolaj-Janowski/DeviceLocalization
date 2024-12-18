import React, { createContext, useState, ReactNode } from 'react';

export const AnchorsContext = createContext<{
  anchors: Record<string, { 
    id: string; 
    name: string; 
    coordinates: { x: number; y: number } | null; 
    distance?: number; // Add distance here
  }>;
  setGlobalAnchors: React.Dispatch<
    React.SetStateAction<
      Record<string, { 
        id: string; 
        name: string; 
        coordinates: { x: number; y: number } | null; 
        distance?: number; 
      }>
    >
  >;
}>({
  anchors: {},
  setGlobalAnchors: () => {},
});

export const AnchorsProvider = ({ children }: { children: ReactNode }) => {
  const [anchors, setGlobalAnchors] = useState<
    Record<string, { id: string; name: string; coordinates: { x: number; y: number } | null }>
  >({});

  return (
    <AnchorsContext.Provider value={{ anchors, setGlobalAnchors }}>
      {children}
    </AnchorsContext.Provider>
  );
};