import React, { useState } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { ElkNodeData } from "./nodes";

import { FaPlusCircle } from "react-icons/fa";
import { FaMinusCircle } from "react-icons/fa";

import { Tooltip as ReactTooltip } from "react-tooltip";
import { Tooltip } from "@nextui-org/react";

export default function ElkNode({ data }: NodeProps<ElkNodeData>) {
  const [isLeftExpanded, setIsLeftExpanded] = useState(true);
  const [isRightExpanded, setIsRightExpanded] = useState(true);

  const formatAddress = (address) =>
    `${address.slice(0, 5)}...${address.slice(-5)}`;

  const toggleNodes = (side: "left" | "right") => {
    if (side === "left") {
      setIsLeftExpanded(!isLeftExpanded);
      alert(`Toggled left side nodes. Label: ${data.label}`);
    } else if (side === "right") {
      setIsRightExpanded(!isRightExpanded);
      alert(`Toggled right side nodes. Label: ${data.label}`);
    }
  };

  return (
    <div
      className="border border-gray-500 rounded-md p-2 bg-white shadow-md"
    >
      <div className="flex items-center justify-between">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleNodes("left");
          }}
          className={`p-1 flex items-center justify-center rounded-full ${
            isLeftExpanded ? "bg-red-500" : "bg-green-500"
          } text-white hover:bg-gray-700`}
        >
          {isLeftExpanded ? <FaMinusCircle /> : <FaPlusCircle />}
        </button>
        <div className="flex-1 mx-1">
          {/* Target handles */}
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
            toggleNodes("right");
          }}
          className={`p-1 flex items-center justify-center rounded-full ${
            isRightExpanded ? "bg-red-500" : "bg-green-500"
          } text-white hover:bg-gray-700`}
        >
          {isRightExpanded ? <FaMinusCircle /> : <FaPlusCircle />}
        </button>
      </div>
    </div>
  );
}
