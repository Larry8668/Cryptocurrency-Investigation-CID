import React, { useEffect, useState, useContext } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaCopy, FaEthereum } from "react-icons/fa";
import { IoWalletOutline } from "react-icons/io5";
import { BiTransfer } from "react-icons/bi";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "sonner";
import { GlobalContext } from "../../context/GlobalContext";
import Table from "./Table";
import DownloadExcelButton from "../../utils/DownloadExcel";
import LoadingDisplay from "../../utils/LoadingDisplay";
import { motion } from "framer-motion";

const tabs = [
  { id: 1, name: "Overview", icon: <IoWalletOutline /> },
  { id: 2, name: "Transactions", icon: <BiTransfer /> },
  { id: 3, name: "Graphs", icon: <FaEthereum /> },
];

const Modal = ({ props }) => {
  const { selectedChain } = useContext(GlobalContext);
  const { data, sideModalOpen, setSideModalOpen } = props;
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletData, setWalletData] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [activeTab, setActiveTab] = useState(tabs[0]);

  useEffect(() => {
    if (data && data.id) {
      setWalletAddress(data.id);
    }
  }, [data]);

  const walletDetails = async () => {
    if (data?.id) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/crypto/${walletAddress}/${selectedChain}`
        );
        const details = await response.json();
        console.log(details)
        setWalletData(details[0]);
      } catch (error) {
        console.error("Error fetching wallet details:", error);
        toast.error("Failed to fetch wallet details");
      }
    }
  };

  useEffect(() => {
    walletDetails();
  }, [data, selectedChain]);

  const formatBalance = (balance) => {
    return parseFloat(balance).toFixed(6);
  };

  const formatDate = (timestamp) => {
    return new Date(parseInt(timestamp)).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: sideModalOpen ? 0 : "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 bottom-0 h-full w-full md:w-[40vw] bg-white shadow-lg rounded-l-2xl border-l-4 border-purple-500 overflow-hidden z-50"
    >
      <div className="p-6 h-full w-full overflow-hidden flex flex-col justify-start items-center text-black">
        <div className="w-full flex justify-between items-center mb-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSideModalOpen(false)}
            className="bg-purple-100 text-purple-600 rounded-full p-2 hover:bg-purple-200 transition-colors"
          >
            <AiOutlineClose size={20} />
          </motion.button>
          <h1 className="text-2xl font-bold text-purple-600">Wallet Dashboard</h1>
          <DownloadExcelButton size={20} fill="purple" data={csvData} />
        </div>

        {walletData ? (
          <div className="w-full h-full flex flex-col justify-start items-center gap-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 p-6 rounded-2xl text-white shadow-lg"
            >
              <h2 className="text-2xl font-bold mb-4">Wallet Overview</h2>
              <p className="text-lg mb-3">{selectedChain.toUpperCase()} Chain</p>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-sm">Address: </span>
                <span className="bg-white text-purple-600 text-sm p-2 rounded-lg font-mono">
                  {walletAddress}
                </span>
                <CopyToClipboard
                  text={walletAddress}
                  onCopy={() => toast.success("Address copied to clipboard!")}
                >
                  <motion.span 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 cursor-pointer bg-purple-200 text-purple-600 rounded-full"
                  >
                    <FaCopy size={14} />
                  </motion.span>
                </CopyToClipboard>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <p className="text-purple-200">Balance:</p>
                  <p className="font-semibold text-lg">{formatBalance(walletData.balance)} {walletData.balanceSymbol}</p>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <p className="text-purple-200">Transactions:</p>
                  <p className="font-semibold text-lg">{walletData.transactionCount}</p>
                </div>
              </div>
            </motion.div>
            
            <div className="w-full flex justify-start items-center gap-4 p-2 overflow-x-auto">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-lg text-sm transition duration-300 flex items-center gap-2
                    ${
                      activeTab.id === tab.id
                        ? "bg-purple-500 text-white"
                        : "bg-white text-purple-500 hover:bg-purple-100"
                    }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.icon}
                  {tab.name}
                </motion.button>
              ))}
            </div>
            
            <div className="w-full h-full border-t-2 border-purple-100 p-4 flex flex-col justify-start items-center gap-5 overflow-y-auto">
              {activeTab.id === 1 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="w-full space-y-6"
                >
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-purple-600 mb-1">First Transaction:</p>
                      <p className="font-semibold text-lg">{formatDate(walletData.firstTransactionTime)}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-purple-600 mb-1">Last Transaction:</p>
                      <p className="font-semibold text-lg">{formatDate(walletData.lastTransactionTime)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-green-600 mb-1">Total Received:</p>
                      <p className="font-semibold text-lg text-green-600">{parseFloat(walletData.totalReceived).toFixed(2)} {walletData.balanceSymbol}</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-red-600 mb-1">Total Sent:</p>
                      <p className="font-semibold text-lg text-red-600">{parseFloat(walletData.totalSent).toFixed(2)} {walletData.balanceSymbol}</p>
                    </div>
                  </div>
                </motion.div>
              )}
              {activeTab.id === 2 && (
                <Table WalletAddress={walletAddress} chain={selectedChain} setCsvData={setCsvData} />
              )}
              {activeTab.id === 3 && (
                <div className="w-full text-center">
                  <p className="text-purple-500 text-lg">Exciting graphs coming soon!</p>
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      ease: "easeInOut",
                      times: [0, 0.2, 0.5, 0.8, 1],
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                    className="text-6xl mt-4 text-purple-400"
                  >
                    📊
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <LoadingDisplay />
        )}
      </div>
    </motion.div>
  );
};

export default Modal;