import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import { toast } from "sonner";
import ChainDropdown from "./ChainDropdown";
import { Button, Input } from "@nextui-org/react";

const TransactionInput = () => {
  const [transactionHash, setTransactionHash] = useState("");
  const {
    selectedChain,
    chain,
    setChain,
    detectedChain,
    searchType,
    setSearchType,
  } = useContext(GlobalContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setTransactionHash(e.target.value);
  };

  const handleSubmit = () => {
    if (transactionHash.length === 64) {
      if (selectedChain !== "BTC") {
        toast.error(
          "Selected chain is incorrect. Please select Bitcoin for this transaction hash."
        );
        return;
      }
    } else if (transactionHash.length === 66) {
      if (selectedChain !== "ETH") {
        toast.error(
          "Selected chain is incorrect. Please select Ethereum for this transaction hash."
        );
        return;
      }
    } else {
      toast.error("Invalid transaction hash length.");
      return;
    }

    navigate(`/elkjs/${transactionHash}`);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex justify-center items-center gap-5">
        <div className="flex flex-col justify-center items-center">
          <div className="text-sm text-slate-500">Chains</div>
          <ChainDropdown selectedChain={selectedChain} setChain={setChain} />
        </div>
        <Input
          type="text"
          color={"secondary"}
          label="Enter Hash"
          value={transactionHash}
          onChange={handleInputChange}
          className="w-[500px] rounded-xl border border-slate-300"
        />
        <Button
          onClick={handleSubmit}
          className="px-4 py-2 bg-purple-500 text-white hover:bg-purple-600"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default TransactionInput;
