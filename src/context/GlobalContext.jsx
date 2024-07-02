import React, { createContext, useState, useMemo } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [sideModalOpen, setSideModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [thresholdValue, setThresholdValue] = useState(0.00001);
  const [detectedChain, setDetectedChain] = useState([]);

  const [chain, setChain] = useState(new Set(["ETH"]));

  const handleChainChange = (chain) =>{
    setChain(new Set(chain));
  }

  const selectedChain =useMemo(
    () => {
      if(chain.size === 0) return "ETH";
      return Array.from(chain).join(", ").replaceAll("_", " ")
    },
    [chain]
  );

  return (
    <GlobalContext.Provider value={{ sideModalOpen, setSideModalOpen, selectedNode, setSelectedNode, thresholdValue, setThresholdValue, handleChainChange, selectedChain, chain, setChain, detectedChain, setDetectedChain}}>
      {children}
    </GlobalContext.Provider>
  );
};
