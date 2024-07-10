import React, { useState } from "react";
import { IoFilterOutline } from "react-icons/io5";
import { CiBoxList } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { CiShare2 } from "react-icons/ci";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { IoHomeOutline } from "react-icons/io5";
import "react-tooltip/dist/react-tooltip.css";
import ShareModal from "./modal/ShareModal";
import SearchModal from "./modal/SearchModal";
import { useDisclosure } from "@nextui-org/modal";

const GraphPanel = () => {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  const options = [
    { type: <FaPlus />, name: "New Search", onClick: newSearch },
    { type: <IoHomeOutline />, name: "Home", onClick: goHome },
    { type: <IoFilterOutline />, name: "Filter Result", onClick: filterResult },
    { type: <CiBoxList />, name: "List Results", onClick: listResults },
    { type: <CiShare2 />, name: "Share Results", onClick: shareResults },
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
