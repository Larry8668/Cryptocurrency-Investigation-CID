import React, { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  useDisclosure,
  Tooltip,
} from "@nextui-org/react";

import { CopyToClipboard } from "react-copy-to-clipboard";
import "reactflow/dist/style.css";
import "../index.css";
import { FaCopy } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa6";
import { chainList } from "../utils/ChainList";
import { toast } from "sonner";
import { SyncLoader } from "react-spinners";
import AutocompleteBar from "../utils/AutocompleteBar";
import { FaInfo } from "react-icons/fa6";

import InfoModal from "./modal/InfoModal";
import { Link } from "react-router-dom";

const examples = [
  { type: "ETH", address: "0xa336033fc39a359e375007e75af49768e98d0790" },
  { type: "BTC v1", address: "37jKPSmbEGwgfacCr2nayn1wTaqMAbA94Z" },
  { type: "BTC v2", address: "bc1qs4ln7kdtcwvcuaclqlv0qmf7cm446tdzjwv89c" },
];

const GraphOverlay = ({ centralNodeAddress, setSearch, handleSearch }) => {
  const { selectedChain, chain, setChain, detectedChain } =
    useContext(GlobalContext);

  const homies = [{name:"Leharaditya", link: "https://github.com/Larry8668", sep:<>&</>}, {name: "PramathS", link: "https://github.com/pramaths", sep:<>🚀</>}];

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [searchInput, setSearchInput] = useState("");
  const [searchChain, setSearchChain] = useState(false);
  const [validWallet, setValidWallet] = useState(false);
  useEffect(() => {
    if (!validWallet) return;
    setSearch(searchInput);
  }, [validWallet]);

  useEffect(() => {
    if (detectedChain.length && selectedChain == detectedChain[0].key) {
      setValidWallet(true);
      setSearchChain(false);
      setSearchInput(detectedChain[0].address);
      setSearch(detectedChain[0].address);
      return;
    }
    setSearchChain(false);
    setValidWallet(false);
  }, [chain]);

  const handleClick = () => {
    if (validWallet) {
      handleSearch();
    } else {
      toast.error("Invalid Wallet Address!");
    }
  };

  return (
    <div className="absolute h-full w-full z-10 backdrop-blur-sm bg-slate-400/10 flex gap-10 justify-center items-center text-2xl">
      {!centralNodeAddress ? (
        <div className="flex flex-col justify-center items-center gap-10 text-3xl md:text-4xl w-full">
          <div className="absolute bottom-2 w-full flex justify-center items-center">
            <div className="px-4 flex justify-center items-center gap-2 text-sm text-slate-400 hover:text-slate-700 hover:text-base ease-linear duration-100">
              Made with ❣️ by :
              <div className="flex justify-center items-center gap-1">
              {homies.map((homie) => {
                return <><Link to={homie.link} target="_blank" className="underline text-slate-500 hover:text-black font-bold">{homie.name}</Link>{homie.sep}</>;
              })}</div>
            </div>
          </div>
          <Tooltip content="More Information" className="text-black">
            <Button
              onClick={onOpen}
              className="absolute text-base top-2 left-2 rouned-xl border-1 border-slate-600 bg-white shadow-lg"
            >
              <FaInfo />
            </Button>
          </Tooltip>
          Start Investigation 🔎
          <div className="w-full flex justify-center items-center flex-col md:flex-row gap-5">
            <div className="flex flex-col justify-center items-center">
              <div className="text-sm text-slate-500">Chains</div>
              <Dropdown className="border-black">
                <DropdownTrigger>
                  <Button variant="bordered" className="capitalize">
                    <img
                      src={
                        chainList.filter((ele) => ele.key === selectedChain)[0]
                          .image
                      }
                      width={20}
                    />
                    {selectedChain}
                    <FaChevronDown />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Single selection example"
                  variant="flat"
                  disallowEmptySelection
                  selectionMode="single"
                  selectedKeys={chain}
                  onSelectionChange={setChain}
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
            <AutocompleteBar
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              setValidWallet={setValidWallet}
              setSearchChain={setSearchChain}
            />
            <Button
              color={validWallet ? "primary" : "secondary"}
              variant="shadow"
              onClick={() => handleClick()}
              disabled={searchChain}
            >
              {validWallet ? "Search!" : searchChain ? "Validating!" : "Check!"}
            </Button>
          </div>
          <div className="flex flex-col justify-center items-center gap-2 w-full">
            {examples.map((example) => (
              <div className="flex justify-center items-start gap-5 text-base text-gray-500">
                <div className="w-full text-left flex flex-col md:flex-row justify-center items-center">
                  <span className="text-black text-sm md:text-base">
                    {example.type}:
                  </span>{" "}
                  <span className="text-xs md:text-base">
                    {example.address}
                  </span>
                </div>
                <CopyToClipboard
                  text={example.address}
                  onCopy={() => {
                    toast.success("Copied to clipboard!");
                  }}
                >
                  <span className="p-1 cursor-pointer border-2 border-gray-500 rounded-md">
                    <FaCopy />
                  </span>
                </CopyToClipboard>
              </div>
            ))}
          </div>
          <InfoModal
            size={"2xl"}
            backdrop={"blur"}
            isOpen={isOpen}
            onClose={onClose}
          />
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
