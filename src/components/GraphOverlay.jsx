import React, { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Input,
  Button,
} from "@nextui-org/react";

import { CopyToClipboard } from "react-copy-to-clipboard";

import "reactflow/dist/style.css";
import "../index.css";
import { FaCopy } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa6";
import { SiTicktick } from "react-icons/si";
import { chainList } from "../utils/ChainList";

import { toast } from "sonner";

import { SyncLoader } from "react-spinners";

const GraphOverlay = ({
  centralNodeAddress,
  selectedValue,
  selectedChain,
  setSelectedChain,
  setSearch,
  handleSearch,
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchChain, setSearchChain] = useState(false);
  const [validWallet, setValidWallet] = useState(false);

  useEffect(() => {
    setSearchChain(false);
    setValidWallet(false);
  }, [searchInput]);

  const checkChain = () => {
    if (searchInput.length != 42) {
      toast.error("Invalid Wallet Address!");
      return;
    }
    setSearchChain(true);
    setValidWallet(false);
    if (searchInput.startsWith("0x")) {
      setSelectedChain(new Set(["ETH"]));
      setValidWallet(true);
      setSearch(searchInput);
      toast.success("Ethereum Wallet Detected!");
    } else if (searchInput.startsWith("b")) {
      setSelectedChain(new Set(["BTC"]));
      setValidWallet(true);
      setSearch(searchInput);
      toast.success("Bitcoin Wallet Detected!");
    } else {
      toast.error("No Valid Wallet Found!");
    }
    setSearchChain(false);
  };

  const handleClick = () => {
    if (validWallet) {
      handleSearch();
    } else {
      checkChain();
    }
  };

  return (
    <div className="absolute h-full w-full z-10 backdrop-blur-sm bg-slate-400/10 flex gap-10 justify-center items-center text-2xl">
      {!centralNodeAddress ? (
        <div className="flex flex-col justify-center items-center gap-10 text-4xl">
          Start Investigation 🔎
          <div className="flex justify-center items-center gap-5">
            <div className="flex flex-col justify-center items-center">
              <div className="text-sm text-slate-500">Chains</div>
              <Dropdown className="border-black">
                <DropdownTrigger>
                  <Button variant="bordered" className="capitalize">
                    <img
                      src={
                        chainList.filter((ele) => ele.key == selectedValue)[0]
                          .image
                      }
                      width={20}
                    />
                    {selectedValue}
                    <FaChevronDown />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Single selection example"
                  variant="flat"
                  disallowEmptySelection
                  selectionMode="single"
                  selectedKeys={selectedChain}
                  onSelectionChange={setSelectedChain}
                  className="h-40 overflow-y-auto"
                >
                  {chainList.map((chain) => (
                    <DropdownItem
                      key={chain.key}
                      className="text-black"
                      startContent={
                        <img src={chain.image} className="w-6 h-6" />
                      }
                    >
                      {chain.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
            <Input
              type="text"
              color="secondary"
              label="Address 0x12"
              placeholder="Enter Your Sender Address:"
              className="w-[500px] border-2 border-slate-400 rounded-md"
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleClick(
                    validWallet,
                    setValidWallet,
                    setSearchChain,
                    search,
                    setSearch,
                    setSelectedChain
                  );
                }
              }}
              endContent={
                validWallet ? (
                  <div className="h-full mb-1 flex items-end justify-center text-base text-secondary">
                    <SiTicktick />
                  </div>
                ) : null
              }
            />
            <Button
              color={validWallet ? "primary" : "secondary"}
              variant="shadow"
              onClick={() => handleClick()}
              disabled={searchChain}
            >
              {validWallet ? "Search!" : "Check!"}
            </Button>
          </div>
          <div className="flex flex-col justify-center items-center gap-2">
            <div className="flex justify-center items-start gap-5 text-base text-gray-500">
              <div className="w-full text-left">
                <span className="text-black">ETH:</span>{" "}
                0xa336033fc39a359e375007e75af49768e98d0790
              </div>
              <CopyToClipboard
                text={"0xa336033fc39a359e375007e75af49768e98d0790"}
                onCopy={() => {
                  toast.success("Copied to clipboard!");
                  this.setState({ copied: true });
                }}
              >
                <span className="p-1 cursor-pointer border-2 border-gray-500 rounded-md">
                  <FaCopy />
                </span>
              </CopyToClipboard>
            </div>
            <div className="flex justify-center items-start gap-5 text-base text-gray-500">
              <div className="w-full text-left">
                <span className="text-black">BTC v1:</span>{" "}
                37jKPSmbEGwgfacCr2nayn1wTaqMAbA94Z
              </div>
              <CopyToClipboard
                text={"37jKPSmbEGwgfacCr2nayn1wTaqMAbA94Z"}
                onCopy={() => {
                  toast.success("Copied to clipboard!");
                  this.setState({ copied: true });
                }}
              >
                <span className="p-1 cursor-pointer border-2 border-gray-500 rounded-md">
                  <FaCopy />
                </span>
              </CopyToClipboard>
            </div>
            <div className="flex justify-center items-start gap-5 text-base text-gray-500">
              <div className="w-full text-left">
                <span className="text-black">BTC v2:</span>{" "}
                bc1qs4ln7kdtcwvcuaclqlv0qmf7cm446tdzjwv89c
              </div>
              <CopyToClipboard
                text={"bc1qs4ln7kdtcwvcuaclqlv0qmf7cm446tdzjwv89c"}
                onCopy={() => {
                  toast.success("Copied to clipboard!");
                  this.setState({ copied: true });
                }}
              >
                <span className="p-1 cursor-pointer border-2 border-gray-500 rounded-md">
                  <FaCopy />
                </span>
              </CopyToClipboard>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center gap-10">
          <SyncLoader size={10} /> Fetching details...
        </div>
      )}
    </div>
  );
};

export default GraphOverlay;
