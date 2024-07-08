import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import getImageByExchange from "../../utils/ImageIconMap";
import LineGraph from "../charts/Line";
import CircleGraph from "../charts/Circle";
import LoadingDisplay from "../../utils/LoadingDisplay";
import DownloadExcelButton from "../../utils/DownloadExcel";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaCopy } from "react-icons/fa6";
import {toast} from "sonner";
import Table from "./Table"


const Modal = ({ props }) => {
  const { data, sideModalOpen, setSideModalOpen } = props;
  const [walletData, setWalletData] = useState(null);
  const [csvData, setCsvData]=useState(null);
  useEffect(() => {
    console.log("Modal data: ", data);
  }, [data]);
  let walletAddress = data?.id.slice(0,42);


  const walletDetails = async () => {
    if (data?.id) {
      const response = await fetch(
        `https://onchainanalysis.vercel.app/api/crypto/${walletAddress}`
      );
      const details = await response.json();

      setWalletData(details);
      console.log(details);

    }
  };
  useEffect(() => {
    walletDetails();
  }, [data]);
  console.log("Wallet data: ", walletAddress);

  return (
    <div
      className={`fixed top-0 right-0 bottom-0 h-[98%] w-[100%] md:w-[40vw] bg-white shadow-lg transform rounded-lg md:rounded-r-none my-2 border-2 md:border-r-0 border-black ${
        sideModalOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out z-50`}
    >
      <div className="p-2 h-full w-full overflow-hidden flex flex-col justify-start items-center">
        <div className="w-full flex justify-between items-center">
          <button
            onClick={() => setSideModalOpen(false)}
            className="bg-transparent border-2 border-black text-sm "
          >
            <AiOutlineClose size={16} fill="red" stroke="2px"/>
          </button>
          <DownloadExcelButton  size={12} fill='blue' data={csvData} />
        </div>
        {data ? (
          <div className="w-full h-full flex flex-col justify-start items-center gap-10">
            <div className="w-full flex space-x-2 mt-2">
            <div className="text-left">
              <div className="flex  items-center ">
              <span className="text-sm">blockchain: {" "}</span>
              <span className="flex justify-center items-center p-2 bg-slate-100 rounded-full">
                <img
                  src={getImageByExchange(data?.exchange)}
                  alt={data?.exchange}
                  className="rounded-full"
                  width="25"
                  height="25"
                />
              </span>
              </div>
                <div className="flex items-center gap-2 justify-center">
                  <div className="text-sm font-semibold mt-2">
                    Wallet address:{" "}
                  </div>
                  <div className="w-full flex justify-between items-center gap-2 p-1 rounded-md bg-slate-400">
                    <div className="bg-white p-1 px-2 rounded-md">
                      {walletAddress}
                    </div>
                    <CopyToClipboard
                      text={walletAddress}
                      onCopy={() => {
                        toast.success("Copied to clipboard!");
                        this.setState({ copied: true });
                      }}
                    >
                      <span className="p-1 cursor-pointer border-2 border-black rounded-md">
                        <FaCopy />
                      </span>
                    </CopyToClipboard>
                  </div>
                </div>

                <div className="text-sm font-semibold mt-2 mb-4">
                  Wallet balance: {(walletData?.balance / 10 ** 18).toFixed(4)}{" "}
                  ETH
                </div>
                <div className="text-sm font-semibold mt-2 mb-4">
                  Wallet ERC20: {walletData?.erctokens}
                </div>
              </div>
            </div>
            {data?.exchange ? (
              <p className="text-sm text-red-500">Exchange: {data?.exchange}</p>
            ) : (
              ""
            )}
            <div className="w-full h-full border-t-2 border-b-2 border-black p-4 flex flex-col justify-start items-center gap-5 overflow-y-auto">
              <Table addresswallet={walletAddress} setCsvData={setCsvData} />
            </div>
          </div>
        ) : (
          <LoadingDisplay />
        )}
      </div>
    </div>
  );
};

export default Modal;
