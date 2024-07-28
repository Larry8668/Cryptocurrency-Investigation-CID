import React, { createContext, useState, useMemo } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [sideModalOpen, setSideModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [thresholdValue, setThresholdValue] = useState(0.00001);
  const [detectedChain, setDetectedChain] = useState([]);
  const [searchType, setSearchType] = useState("Wallet");
  const [chain, setChain] = useState(new Set(["BTC"]));
  const [outgoingTransactions, setOutgoingTransactions] = useState({});
  const [nodesToUpdate, setNodesToUpdate] = useState(null);

  const handleChainChange = (chain) => {
    setChain(new Set(chain));
  };

  const selectedChain = useMemo(() => {
    if (chain.size === 0) return "BTC";
    return Array.from(chain).join(", ").replaceAll("_", " ");
  }, [chain]);

  const updateOutgoingTransactions = (nodeId, transactions) => {
    setOutgoingTransactions(prev => ({
      ...prev,
      [nodeId]: transactions
    }));
    setNodesToUpdate(nodeId);
  };

  const toggleOutgoingTransactions = (nodeId) => {
    setOutgoingTransactions(prev => ({
      ...prev,
      [nodeId]: prev[nodeId] ? null : prev[nodeId] || []
    }));
    setNodesToUpdate(nodeId);
  };

  return (
    <GlobalContext.Provider
      value={{
        sideModalOpen,
        setSideModalOpen,
        selectedNode,
        setSelectedNode,
        thresholdValue,
        setThresholdValue,
        handleChainChange,
        selectedChain,
        chain,
        setChain,
        detectedChain,
        setDetectedChain,
        searchType,
        setSearchType,
        outgoingTransactions,
        updateOutgoingTransactions,
        toggleOutgoingTransactions,
        nodesToUpdate,
        setNodesToUpdate
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};