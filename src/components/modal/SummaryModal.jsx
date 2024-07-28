import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@nextui-org/react";
import MyLoader from "../skeletons/MyLoader";
import MyHeaderSkeleton from "../skeletons/MyHeaderSkeleton";
import { HashLoader } from "react-spinners";
import { IoCloseSharp } from "react-icons/io5";
import { toast } from "sonner";
import ChainCard from "../../utils/ChainCard";

export default function SummaryModal({
  isOpen,
  onClose,
  walletAddress,
  walletData = null,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [evmDataLoading, setEVMDataLoading] = useState(true);
  const [evmData, setEVMData] = useState(null);
  const [showAllChains, setShowAllChains] = useState(false);

  const fetchEVMData = async () => {
    try {
      toast.info("Generating summary...");
      const response = await fetch(
        `https://onchainanalysis.vercel.app/api/evmchain/transactions/${walletAddress}`
        // `http://localhost:8000/api/evmchain/transactions/${walletAddress}`
      );
      const data = await response.json();
      console.log("Data: ", data);
      setEVMData(data);
      setEVMDataLoading(false);
    } catch (error) {
      toast.error("An error occurred while fetching data");
      console.error("Error: ", error);
    }
  };

  useEffect(() => {
    console.log("Modal data: ", walletData, isOpen);
    if (walletAddress && isOpen) {
      fetchEVMData();
    }
    setShowAllChains(false);
  }, [walletAddress, isOpen]);

  const handleShowAllChains = () => {
    setShowAllChains(true);
  };

  return (
    <>
      <Modal
        size="full"
        isOpen={isOpen}
        onClose={onClose}
        className="text-black"
        scrollBehavior="inside"
        closeButton={
          <div className="text-black">
            <IoCloseSharp size={24} />
          </div>
        }
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader
                className={`flex flex-col gap-2 min-h-48 md:min-h-[25vh]`}
              >
                <div className="flex justify-end px-10">
                  <div
                    className={`w-fit justify-center items-center gap-2 p-2 rounded-md border-2 border-slate-400 text-slate-400 text-sm ${
                      isLoading ? "flex" : "hidden"
                    }`}
                  >
                    <HashLoader size={15} color="#99a7bb" />{" "}
                    <span>Loading...</span>
                  </div>
                </div>
                <div className="text-xs md:text-base">{walletAddress}</div>
                <div className={`${isLoading ? "flex" : "hidden"}`}>
                  <MyHeaderSkeleton />
                </div>
              </ModalHeader>
              <ModalBody className="flex flex-col justify-start items-center">
                <div className="w-[70%] border border-slate-400 mb-4"></div>{" "}
                {/* Margin here */}
                {evmDataLoading ? (
                  <div className="w-full md:flex justify-center items-center hidden">
                    <MyLoader />
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 justify-center items-center">
                    <div className="text-3xl">Multi-Chain Portfolio</div>
                    <div className="w-full md:flex justify-center items-center flex-wrap gap-4">
                      {evmData && evmData.length > 0 ? (
                        <>
                          {evmData
                            .filter((chain) => !chain.error || showAllChains)
                            .map((chain, index) => (
                              <ChainCard
                                key={index}
                                providerName={chain.providerName}
                                transactions={
                                  chain.data
                                    ? `${chain.data.result.length}`
                                    : null
                                }
                                error={chain.error}
                              />
                            ))}
                          {!showAllChains && (
                            <button
                              onClick={handleShowAllChains}
                              className=" text-xs bg-transparent border border-slate-500 rounded-lg hover:bg-slate-400 transition-colors"
                            >
                              Show more chains
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="cursor-pointer text-slate-500 text-sm ">
                          No chains detected
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
