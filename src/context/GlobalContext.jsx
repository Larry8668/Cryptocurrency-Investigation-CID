import React, { createContext, useState } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [sideModalOpen, setSideModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  return (
    <GlobalContext.Provider value={{ sideModalOpen, setSideModalOpen, selectedNode, setSelectedNode }}>
      {children}
    </GlobalContext.Provider>
  );
};
