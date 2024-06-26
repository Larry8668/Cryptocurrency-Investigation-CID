import React, { useEffect, useContext, useState, useMemo } from "react";
import ReactFlow, {
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  ControlButton,
  Panel,
} from "reactflow";

import GraphOverlay from "../components/GraphOverlay";
import { useNavigate, useParams } from "react-router-dom";
import "reactflow/dist/style.css";
import "../index.css";
import { SunIcon } from "@radix-ui/react-icons";
import { Toaster, toast } from "sonner";
import { MdOutlineDoubleArrow } from "react-icons/md";

import ElkNode from "./ElkNode";
import useLayoutNodes from "./useLayoutNodes";
import { GlobalContext } from "../context/GlobalContext";
import DownloadButton from "../utils/DownloadButton";
import Modal from "../components/modal/Modal";
import GraphPanel from "../components/GraphPanel";

const nodeTypes = {
  elk: ElkNode,
};

const snapGrid = [50, 25];

export function ElkPage() {
  const {
    sideModalOpen,
    setSideModalOpen,
    selectedNode,
    setSelectedNode,
    thresholdValue,
  } = useContext(GlobalContext);

  const [selectedChain, setSelectedChain] = useState(new Set(["ETH"]));
  const [search, setSearch] = useState("");
  const [apiData, setApiData] = useState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [graphLoaded, setGraphLoaded] = useState(false);

  const selectedValue = useMemo(
    () => Array.from(selectedChain).join(", ").replaceAll("_", " "),
    [selectedChain]
  );

  let { centralNodeAddress } = useParams();
  const navigate = useNavigate();

  useLayoutNodes();

  // Utility function to process nodes and edges
  const processGraphData = (data, threshold, centralNodeAddress) => {
    const formatAddress = (address) => `${address.slice(0, 5)}...${address.slice(-5)}`;
    const processedNodes = [];
    const processedEdges = [];
    const nodeMap = new Map();

    data.forEach((item) => {
      const valueInEth = item.value / 10 ** 18;
      if (valueInEth < threshold) return;

      const fromAddress = item.from_address;
      const toAddress = item.to_address;

      // Create or update the fromNode
      if (!nodeMap.has(fromAddress)) {
        const fromNode = {
          id: fromAddress,
          data: {
            label: formatAddress(fromAddress),
            sourceHandles: [{ id: `${fromAddress}-s` }],
            targetHandles: [{ id: `${fromAddress}-t` }],
          },
          position: { x: 0, y: 0 }, // Position will be updated by layout
          type: "elk",
          style: { minWidth: 100 },
        };
        processedNodes.push(fromNode);
        nodeMap.set(fromAddress, fromNode);
      }

      // Create or update the toNode
      if (!nodeMap.has(toAddress)) {
        const toNode = {
          id: toAddress,
          data: {
            label: formatAddress(toAddress),
            sourceHandles: [{ id: `${toAddress}-s` }],
            targetHandles: [{ id: `${toAddress}-t` }],
          },
          position: { x: 50, y: 50 }, // Position will be updated by layout
          type: "elk",
          style: { minWidth: 100 },
        };
        processedNodes.push(toNode);
        nodeMap.set(toAddress, toNode);
      }

      let edgeColor = "gray";
      if (fromAddress === centralNodeAddress) edgeColor = "red";
      else if (toAddress === centralNodeAddress) edgeColor = "green";

      const edgeWidth = Math.min(Math.max(valueInEth * 5, 1), 5);
      const edgeId = `${fromAddress}-${toAddress}`;

      if (!processedEdges.some((edge) => edge.id === edgeId)) {
        const edge = {
          id: edgeId,
          source: fromAddress,
          sourceHandle: `${fromAddress}-s`,
          target: toAddress,
          targetHandle: `${toAddress}-t`,
          label: `${valueInEth.toFixed(5)} ETH`,
          animated: true,
          style: { stroke: edgeColor, strokeWidth: edgeWidth },
        };
        processedEdges.push(edge);
      }
    });

    return { nodes: processedNodes, edges: processedEdges };
  };

  // Fetch data when centralNodeAddress changes
  useEffect(() => {
    if (!centralNodeAddress) return;
    setGraphLoaded(false);
    const fetchData = async () => {
      try {
        setGraphLoaded(false);
        const response = await fetch(`https://onchainanalysis.vercel.app/api/eth/0x1/${centralNodeAddress}`);
        const data = await response.json();
        console.log("API data ->", data.result);
        setApiData(data.result);

        const { nodes: initialNodes, edges: initialEdges } = processGraphData(data.result, thresholdValue, centralNodeAddress);
        setNodes(initialNodes);
        setEdges(initialEdges);
        setGraphLoaded(true);
      } catch (error) {
        console.error("Error fetching data: ", error);
        toast.error("Failed to fetch data");
      }
    };

    fetchData();
  }, [centralNodeAddress]);

  // // Update nodes and edges when threshold changes
  // useEffect(() => {
  //   if (!apiData.length) return;
  //   setGraphLoaded(false);
  //   const { nodes: filteredNodes, edges: filteredEdges } = processGraphData(apiData, thresholdValue, centralNodeAddress);
  //   setNodes(filteredNodes);
  //   setEdges(filteredEdges);
  //   setGraphLoaded(true);
  // }, [thresholdValue, apiData, centralNodeAddress]);

  console.log("Nodes ->", nodes);
  console.log("Edges ->", edges);

  const handleNodeClick = (event, node) => {
    setSelectedNode(node);
    console.log("Selected node ->", node);
    setSideModalOpen(true);
  };

  const handleSearch = () => {
    if (search.length === 0) return;
    navigate(`/elkjs/${search}`);
  };

  const modifiedOnNodesChange = (changes) => {
    changes.forEach((change) => {
      if (change.type === "select") {
        handleNodeClick(null, change);
      }
    });
    onNodesChange(changes);
  };

  return (
    <div className="w-[100vw] h-[100vh] bg-white text-black">
      {graphLoaded ? null : (
        <GraphOverlay
          centralNodeAddress={centralNodeAddress}
          selectedValue={selectedValue}
          selectedChain={selectedChain}
          setSelectedChain={setSelectedChain}
          setSearch={setSearch}
          handleSearch={handleSearch}
        />
      )}
      <ReactFlow
        nodes={nodes}
        onNodesChange={modifiedOnNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        fitView
        nodeTypes={nodeTypes}
        snapToGrid={true}
        snapGrid={snapGrid}
        className="download-image"
      >
        {graphLoaded ? (
          <Panel position="top-left">
            <GraphPanel />
          </Panel>
        ) : null}
        <Controls>
          <ControlButton
            onClick={() => alert("Something magical just happened. ✨")}
          >
            <SunIcon />
          </ControlButton>
        </Controls>
        <Background
          id="1"
          color="#f1f1f1"
          variant={BackgroundVariant.Lines}
          gap={[200, 500000]}
          lineWidth={2}
        />
        <DownloadButton />
      </ReactFlow>
      <Modal props={{ data: selectedNode, sideModalOpen, setSideModalOpen }} />
      <Toaster position="bottom-center" />
    </div>
  );
}
