import React from "react";
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
  import { FaEthereum, FaBitcoin } from "react-icons/fa";
  
  import { toast } from "sonner";
  
  import { SyncLoader } from "react-spinners";  

const GraphOverlay = ({centralNodeAddress, selectedValue, selectedChain, setSelectedChain, setSearch, handleSearch}) => {
  return (
    <div className="absolute h-full w-full z-10 backdrop-blur-sm bg-slate-400/10 flex gap-10 justify-center items-center text-2xl">
      {!centralNodeAddress ? (
        <div className="flex flex-col justify-center items-center gap-10 text-4xl">
          Start Investigation 🔎
          <div className="flex justify-center items-center gap-5">
            <Dropdown className="border-slate-400">
              <DropdownTrigger>
                <Button variant="bordered" className="capitalize">
                  {selectedValue}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Single selection example"
                variant="flat"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={selectedChain}
                onSelectionChange={setSelectedChain}
              >
                <DropdownItem
                  key="ETH"
                  className="text-black"
                  startContent={<FaEthereum />}
                >
                  Ethereum
                </DropdownItem>
                <DropdownItem
                  key="BTC"
                  className="text-black"
                  startContent={<FaBitcoin />}
                >
                  Bitcoin
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Input
              type="text"
              color="secondary"
              label="Address 0x12"
              placeholder="Enter Your Sender Address:"
              className="w-[300px] border-2 border-slate-400 rounded-md"
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              color="secondary"
              variant="shadow"
              onClick={() => handleSearch()}
            >
              Search!
            </Button>
          </div>
          <div className="flex justify-center items-center gap-5 text-base text-gray-500">
            <div>Ex: 0xa336033fc39a359e375007e75af49768e98d0790</div>
            <CopyToClipboard
              text={"0xa336033fc39a359e375007e75af49768e98d0790"}
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
      ) : (
        <div className="flex justify-center items-center gap-10">
          <SyncLoader size={10} /> Fetching details...
        </div>
      )}
    </div>
  );
};

export default GraphOverlay;
