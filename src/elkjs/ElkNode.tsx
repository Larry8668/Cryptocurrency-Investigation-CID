import React, { useContext } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { ElkNodeData } from "./nodes";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import { Tooltip } from "@nextui-org/react";
import { GlobalContext } from "../context/GlobalContext";

export default function ElkNode({ data, id }: NodeProps<ElkNodeData>) {
  const { 
    selectedChain, 
    outgoingTransactions, 
    updateOutgoingTransactions, 
    toggleOutgoingTransactions 
  } = useContext(GlobalContext);

  const formatAddress = (address) => {
    const [baseAddress, hierarchy] = address.split(':');
    return `${baseAddress.slice(0, 5)}...${baseAddress.slice(-5)}${hierarchy ? `:${hierarchy}` : ''}`;
  };

  const handleRightClick = async () => {
    if (outgoingTransactions[id]) {
      toggleOutgoingTransactions(id);
    } else {
      try {
        // const response = await fetch(`http://localhost:8000/api/${selectedChain.toLowerCase()}/address/${data.label.split(':')[0]}/outgoing`);
        const response = await fetch(`https://onchainanalysis.vercel.app/api/${selectedChain.toLowerCase()}/address/${data.label.split(':')[0]}/outgoing`);
        const result = await response.json();
        updateOutgoingTransactions(id, result.transactions);
      } catch (error) {
        console.error("Error fetching outgoing transactions:", error);
      }
    }
  };

  const isExpanded = !!outgoingTransactions[id];

  return (
    <div className="border border-gray-500 rounded-md p-2 bg-white shadow-md">
      <div className="flex items-center justify-between">
        {/* Left button (unchanged) */}
        <div className="flex-1 mx-1">
          <div className="flex flex-wrap items-center justify-start">
            {data.targetHandles.map((handle) => (
              <Handle
                key={handle.id}
                id={handle.id}
                type="target"
                position={Position.Left}
                className="bg-blue-500 border-2 border-blue-700"
              />
            ))}
          </div>
        </div>

        <Tooltip content={data.label} className="text-center mt-1 text-sm font-semibold text-black">
          {formatAddress(data.label)}
        </Tooltip>
        <div className="flex-1 mx-1">
          <div className="flex flex-wrap items-center justify-end">
            {data.sourceHandles.map((handle) => (
              <Handle
                key={handle.id}
                id={handle.id}
                type="source"
                position={Position.Right}
                className="bg-blue-500 border-2 border-blue-700"
              />
            ))}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRightClick();
          }}
          className={`p-1 flex items-center justify-center rounded-full ${
            isExpanded ? "bg-red-500" : "bg-green-500"
          } text-white hover:bg-gray-700`}
        >
          {isExpanded ? <FaMinusCircle /> : <FaPlusCircle />}
        </button>
      </div>
    </div>
  );
}