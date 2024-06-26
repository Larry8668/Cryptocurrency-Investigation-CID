import React, {useState, useContext} from "react";
import { IoFilterOutline } from "react-icons/io5";
import { CiBoxList } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { CiShare2 } from "react-icons/ci";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { Slider } from "@nextui-org/react";
import { GlobalContext } from "../context/GlobalContext";
import SearchModal from "./modal/SearchModal";



const GraphPanel = () => {
  const { thresholdValue, setThresholdValue } = useContext(GlobalContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const newSearch = () => {
    setIsModalOpen((curr)=>!curr);
  };
  
  const filterResult = () => {
    alert("Filter Result");
  };
  
  const listResults = () => {
    alert("List Results");
  };
  
  const shareResults = () => {
    alert("Share Results");
  };
  const options = [
    { type: <FaPlus />, name: "New Search", onClick: newSearch },
    { type: <IoFilterOutline />, name: "Filter Result", onClick: filterResult },
    { type: <CiBoxList />, name: "List Results", onClick: listResults },
    { type: <CiShare2 />, name: "Share Results", onClick: shareResults },
  ];
  return (
    <div className="flex items-center justify-center gap-3 p-2 bg-red-300 rounded-xl text-xl">
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

      <Slider
        size="sm"
        label="Threshold"
        step={0.0001}
        color="foreground"
        maxValue={1}
        minValue={0}
        defaultValue={0.4}
        className="w-64"
        onChange={(value) => {
          console.log(value);
          setThresholdValue(value);
        }}
      />
    </div>
  );
};

export default GraphPanel;
