import React, { createContext, useState, useContext } from 'react';

const MatchContext = createContext();

export function useMatch() {
  return useContext(MatchContext);
}

export function MatchProvider({ children }) {
  const [currentMatch, setCurrentMatch] = useState(null);

  return (
    <MatchContext.Provider value={{ currentMatch, setCurrentMatch }}>
      {children}
    </MatchContext.Provider>
  );
}

