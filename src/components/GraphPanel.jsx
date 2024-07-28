import React, { useCallback, useState, useEffect } from "react";
import { useReactFlow } from 'reactflow';
import { IoFilterOutline } from "react-icons/io5";
import { CiBoxList } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { CiShare2 } from "react-icons/ci";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { IoHomeOutline } from "react-icons/io5";
import { IoSaveOutline } from "react-icons/io5";
import { TbFileImport } from "react-icons/tb";
import "react-tooltip/dist/react-tooltip.css";
import { toast } from "sonner";

import ShareModal from "./modal/ShareModal";
import SearchModal from "./modal/SearchModal";
import { useDisclosure } from "@nextui-org/modal";

const storageKey = 'graph-flow-data';

const GraphPanel = () => {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setNodes, setEdges, setViewport, getNodes, getEdges, getViewport } = useReactFlow();

  const newSearch = () => {
    setIsModalOpen((curr) => !curr);
  };

  const goHome = () => {
    window.location.href = "/elkjs";
  };

  const filterResult = () => {
    alert("Filter Result");
  };

  const listResults = () => {
    alert("List Results");
  };

  const shareResults = () => {
    onOpen();
  };

  const saveResults = useCallback(() => {
    const flow = {
      nodes: getNodes(),
      edges: getEdges(),
      viewport: getViewport()
    };
    localStorage.setItem(storageKey, JSON.stringify(flow));
    toast("Graph state saved to localStorage");
  }, [getNodes, getEdges, getViewport]);

  const loadResults = useCallback(() => {
    const savedFlow = localStorage.getItem(storageKey);
    if (savedFlow) {
      const flow = JSON.parse(savedFlow);
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
      setViewport(flow.viewport || { x: 0, y: 0, zoom: 1 });
      toast("Graph state loaded from localStorage");
    } else {
      toast("No saved graph state found");
    }
  }, [setNodes, setEdges, setViewport]);

  const options = [
    { type: <FaPlus />, name: "New Search", onClick: newSearch },
    { type: <IoHomeOutline />, name: "Home", onClick: goHome },
    // { type: <IoFilterOutline />, name: "Filter Result", onClick: filterResult },
    // { type: <CiBoxList />, name: "List Results", onClick: listResults },
    { type: <CiShare2 />, name: "Share Results", onClick: shareResults },
    { type: <IoSaveOutline />, name: "Save Results", onClick: saveResults },
    { type: <TbFileImport />, name: "Import Results", onClick: loadResults },
  ];

  return (
    <div className="flex items-center justify-center gap-3 p-2 pr-4 bg-red-300 rounded-xl text-xl">
      <SearchModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      {options.map((option, index) => (
        <button
          key={index}
          className="flex p-1 border-2 border-black rounded-md items-center justify-center bg-transparent"
          data-tooltip-id={option.name}
          data-tooltip-content={option.name}
          onClick={option.onClick}
        >
          {option.type}
          <ReactTooltip
            id={option.name}
            place="bottom"
            effect="solid"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.85)",
              color: "#fff",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
            }}
          />
        </button>
      ))}
      <ShareModal backdrop="opaque" isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export default GraphPanel;