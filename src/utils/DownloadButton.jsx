import React from "react";
import {
  Panel,
  useReactFlow,
  getRectOfNodes,
  getTransformForBounds,
} from "reactflow";
import { toPng } from "html-to-image";
import { FaDownload } from "react-icons/fa6";
import { Tooltip as ReactTooltip } from "react-tooltip";

function downloadImage(dataUrl) {
  const a = document.createElement("a");

  a.setAttribute("download", "reactflow.png");
  a.setAttribute("href", dataUrl);
  a.click();
}

const imageWidth = 1024;
const imageHeight = 768;

function DownloadButton() {
  const { getNodes } = useReactFlow();
  const onClick = () => {
    const nodesBounds = getRectOfNodes(getNodes());
    const transform = getTransformForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2
    );

    toPng(document.querySelector(".react-flow__viewport"), {
      backgroundColor: "#fff",
      width: imageWidth,
      height: imageHeight,
      style: {
        width: imageWidth,
        height: imageHeight,
        transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
      },
    }).then(downloadImage);
  };

  return (
    <Panel position="top-right">
      <button
        className="bg-white text-black border-2 border-black rounded-lg"
        onClick={onClick}
        data-tooltip-id={"Download Button"}
        data-tooltip-content={"Download Image"}
      >
        <FaDownload />
      </button>
      <ReactTooltip
        id={"Download Button"}
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
    </Panel>
  );
}

export default DownloadButton;
