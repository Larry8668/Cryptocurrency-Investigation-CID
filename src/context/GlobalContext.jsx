import React, { createContext, useState } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [sideModalOpen, setSideModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [thresholdValue, setThresholdValue] = useState(0.00001);

  return (
    <GlobalContext.Provider value={{ sideModalOpen, setSideModalOpen, selectedNode, setSelectedNode, thresholdValue, setThresholdValue}}>
      {children}
    </GlobalContext.Provider>
  );
};
