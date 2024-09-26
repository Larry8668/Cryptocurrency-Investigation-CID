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
import ChainDropdown from "../utils/ChainDropdown";
import TransactionInput from "../utils/TransactionInput";
import { RadioGroup, Radio, cn } from "@nextui-org/react";
import { MdOutlineUploadFile } from "react-icons/md";

const examplesWallet = [
  { type: "ETH", address: "0xa336033fc39a359e375007e75af49768e98d0790" },
  { type: "BTC", address: "bc1qs4ln7kdtcwvcuaclqlv0qmf7cm446tdzjwv89c" },
  { type: "MATIC", address: "0xa336033fc39a359e375007e75af49768e98d0790" },
  { type: "TRX", address: "TLUd7JuJbZuqxkn1itHGurXUknygmRuiSj"},
];

const exampleTransactions = [
  {
    type: "ETH",
    address:
      "0x7f188036829191b7fd4270edf0afad7e74a9ff9ee3c2ea7ba771fe05a666562e",
  },
  {
    type: "BTC",
    address: "b403a1a753a4cfd44b061cc691b85530637a6e74fa942d19afe7560b6f99c130",
  },
];

const options = [
  { value: "Wallet", label: "Wallet" },
  { value: "Transaction", label: "Transaction" },
];

const GraphOverlay = ({
  centralNodeAddress,
  setSearch,
  handleSearch,
  walletSearchType,
  setWalletSearchType,
  walletSearchDepth,
  setWalletSearchDepth,
}) => {
  const {
    selectedChain,
    chain,
    setChain,
    detectedChain,
    searchType,
    setSearchType,
  } = useContext(GlobalContext);

  const homies = [
    { name: "Leharaditya", link: "https://github.com/Larry8668", sep: <>&</> },
    { name: "PramathS", link: "https://github.com/pramaths", sep: <>🚀</> },
  ];

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [searchInput, setSearchInput] = useState("");
  const [searchChain, setSearchChain] = useState(false);
  const [validWallet, setValidWallet] = useState(false);
  useEffect(() => {
    if (!validWallet) return;
    setSearch(searchInput);
  }, [validWallet]);

  useEffect(() => {
    // if (detectedChain.length && selectedChain == detectedChain[0].key) {
    if (detectedChain.length) {
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
                  return (
                    <>
                      <Link
                        to={homie.link}
                        target="_blank"
                        className="underline text-slate-500 hover:text-black font-bold"
                      >
                        {homie.name}
                      </Link>
                      {homie.sep}
                    </>
                  );
                })}
              </div>
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
          {searchType === "Wallet" ? (
            <div className="w-full flex justify-center items-center flex-col md:flex-row gap-5">
              <div className="flex flex-col justify-center items-center">
                <div className="text-sm text-slate-500">Chains</div>
                <ChainDropdown
                  selectedChain={selectedChain}
                  setChain={setChain}
                />
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
                {validWallet
                  ? "Search!"
                  : searchChain
                  ? "Validating!"
                  : "Check!"}
              </Button>
            </div>
          ) : (
            <div className="w-full flex justify-center items-center flex-col md:flex-row gap-5">
              <TransactionInput />
            </div>
          )}
          <div className="w-[600px] border-2 border-[#b46efa] bg-[#f2eafa] border-dashed rounded-xl p-8 py-3 flex flex-col justify-center items-center gap-5">
            <div className="w-full flex justify-between items-center gap-4">
              <div className="flex justify-center items-center gap-5">
                {options.map((option) => (
                  <Tooltip content={`Search by ${option.label}`} className="text-black">
                  <Button
                    onClick={() => setSearchType(option.value)}
                    className={`${
                      searchType === option.value
                        ? "bg-purple-500 text-white border-2 border-purple-700"
                        : "bg-white text-black border border-slate-400 hover:bg-purple-300"
                    } p-2 rounded-md text-xs`}
                  >
                    {option.label}
                  </Button></Tooltip>
                ))}
              </div>
              <Tooltip content="Upload Graph" className="text-black">
                <Link
                  to="/upload-graph"
                  target="_blank"
                  className="text-xl bg-purple-500 text-white border-2 border-purple-700 hover:bg-purple-300 p-2 rounded-md flex justify-center items-center gap-2"
                >
                  <MdOutlineUploadFile />
                </Link>
              </Tooltip>
            </div>
            {searchType === "Wallet" ? (
              <div className="flex flex-col justify-center items-center gap-5">
                <div className="flex w-full justify-center items-center gap-5">
                  <div className="text-sm">Select search type :</div>
                  <RadioGroup
                    orientation="horizontal"
                    color="secondary"
                    className="text-sm"
                    value={walletSearchType}
                    onValueChange={setWalletSearchType}
                  >
                    <CustomRadio value="standard" description="(fastest)">
                      <Tooltip
                        content="Regular single-layered search"
                        placement="bottom"
                        className="text-black"
                      >
                        <span className="text-sm">Standard</span>
                      </Tooltip>
                    </CustomRadio>
                    <CustomRadio value="stream" description="(may take longer)">
                      <Tooltip
                        content="Layered search for more detailed results"
                        placement="bottom"
                        className="text-black"
                      >
                        <span className="text-sm">Stream</span>
                      </Tooltip>
                    </CustomRadio>
                  </RadioGroup>
                </div>
                {walletSearchType === "stream" && (
                  <div className="flex w-full justify-center items-center gap-5">
                    <div className="text-base">Select search depth :</div>
                    <RadioGroup
                      orientation="horizontal"
                      color="secondary"
                      className="text-sm"
                      value={walletSearchDepth}
                      onValueChange={setWalletSearchDepth}
                    >
                      <CustomRadio value="2">
                        <Tooltip
                          content="Search upto depth 2"
                          placement="bottom"
                          className="text-black"
                        >
                          2
                        </Tooltip>
                      </CustomRadio>
                      <CustomRadio value="3">
                        <Tooltip
                          content="Search upto depth 3"
                          placement="bottom"
                          className="text-black"
                        >
                          3
                        </Tooltip>
                      </CustomRadio>
                      <CustomRadio value="4">
                        <Tooltip
                          content="Search upto depth 4"
                          placement="bottom"
                          className="text-black"
                        >
                          4
                        </Tooltip>
                      </CustomRadio>
                    </RadioGroup>
                  </div>
                )}
              </div>
            ) : null}
          </div>
          {
            <div className="flex flex-col justify-center items-center gap-2 w-full">
              {(searchType === "Wallet"
                ? examplesWallet
                : exampleTransactions
              ).map((example) => (
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
          }
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

const CustomRadio = (props) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
          "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-10 p-2 border-2 border-transparent",
          "data-[selected=true]:border-secondary"
        ),
      }}
    >
      {children}
    </Radio>
  );
};

export default GraphOverlay;
