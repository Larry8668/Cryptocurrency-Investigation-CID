import React from "react";
import { Panel, useReactFlow } from "reactflow";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { Tooltip as ReactTooltip } from "react-tooltip";

import { toast } from "sonner";
import { onClickPNG, downloadAsJson } from "./DownloadHelpers";

import { FaDownload } from "react-icons/fa6";
import { BsFiletypeJson } from "react-icons/bs";
import { PiFilePng } from "react-icons/pi";

const DownloadOptions = ({ centralNode }) => {
  const { getNodes, getEdges, getViewport } = useReactFlow();

  const options = [
    {
      label: "Download as PNG",
      note: "Not ideal for large graphs",
      logo: PiFilePng,
      onClick: () => onClickPNG(getNodes),
    },
    {
      label: "Download as JSON",
      note: "Recommended for large graphs",
      logo: BsFiletypeJson,
      onClick: () => downloadAsJson(getNodes, getEdges, getViewport, centralNode),
    },
  ];

  return (
    <Panel position="top-right">
      <Dropdown>
        <DropdownTrigger>
          <Button
            variant="bordered"
            data-tooltip-id={"Download Button"}
            data-tooltip-content={"Download Options"}
          >
            <FaDownload />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          variant="faded"
          aria-label="Dropdown menu with icons"
          className="text-black"
        >
          {options.map((option, index) => (
            <DropdownItem
              key={index}
              startContent={
                <div className="text-xl">
                  <option.logo />
                </div>
              }
              description={option.note || ""}
              onClick={() => {
                toast("Processing...");
                option.onClick();
              }}
            >
              {option.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
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
};

export default DownloadOptions;
