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

  // //with central node different from the rest
  // // Utility function to process nodes and edges
  // const processGraphData = (data, threshold, centralNodeAddress) => {
  //   const formatAddress = (address) => `${address.slice(0, 5)}...${address.slice(-5)}`;
  //   const processedNodes = [];
  //   const processedEdges = [];
  //   const nodeMap = new Map();
  
  //   data.forEach((item) => {
  //     const valueInEth = item.value / 10 ** 18;
  //     if (valueInEth < threshold) return;
  
  //     const fromAddress = item.from_address;
  //     const toAddress = item.to_address;
  
  //     // Determine the position of nodes based on their relation to the central node
  //     const isCentralNode = (address) => address === centralNodeAddress;

  //     const positionX = isCentralNode(fromAddress) ? 400 : -400; // Central node on x=0, left nodes on x=-200, right nodes on x=200
  //     const positionY = 0; // Start with 0, can be adjusted for better visualization
  
  //     // Create or update the fromNode
  //     if (!nodeMap.has(fromAddress)) {
  //       const fromNode = {
  //         id: fromAddress,
  //         data: {
  //           label: `${isCentralNode(fromAddress) ?">" :"" } ${formatAddress(fromAddress)} ${isCentralNode(fromAddress) ? "<" : ""}`,
  //           sourceHandles: [{ id: `${fromAddress}-s` }],
  //           targetHandles: [{ id: `${fromAddress}-t` }],
  //         },
  //         position: { x: isCentralNode(fromAddress) ? 0 : positionX, y: positionY },
  //         type: "elk",
  //         style: {
  //           minWidth: 100,
  //           textDecoration: isCentralNode(fromAddress) ? "underline" : "none", // Underline the central node
  //         },
  //       };
  //       processedNodes.push(fromNode);
  //       nodeMap.set(fromAddress, fromNode);
  //     }

  //     // Create or update the toNode
  //     if (!nodeMap.has(toAddress)) {
  //       const toNode = {
  //         id: toAddress,
  //         data: {
  //           label: `${isCentralNode(toAddress) ?">" :"" } ${formatAddress(toAddress)} ${isCentralNode(toAddress) ? "<" : ""} `,
  //           sourceHandles: [{ id: `${toAddress}-s` }],
  //           targetHandles: [{ id: `${toAddress}-t` }],
  //         },
  //         position: { x: isCentralNode(toAddress) ? 0 : -positionX, y: positionY },
  //         type: "elk",
  //         style: {
  //           minWidth: 100,
  //           textDecoration: isCentralNode(toAddress) ? "underline" : "none", // Underline the central node
  //         },
  //       };
  //       processedNodes.push(toNode);
  //       nodeMap.set(toAddress, toNode);
  //     }
  
  //     let edgeColor = "gray";
  //     if (fromAddress === centralNodeAddress) edgeColor = "red";
  //     else if (toAddress === centralNodeAddress) edgeColor = "green";
  
  //     const edgeWidth = Math.min(Math.max(valueInEth * 5, 1), 5);
  //     const edgeId = `${fromAddress}-${toAddress}`;
  
  //     if (!processedEdges.some((edge) => edge.id === edgeId)) {
  //       const edge = {
  //         id: edgeId,
  //         source: fromAddress,
  //         sourceHandle: `${fromAddress}-s`,
  //         target: toAddress,
  //         targetHandle: `${toAddress}-t`,
  //         label: `${valueInEth.toFixed(5)} ETH`,
  //         animated: true,
  //         style: { stroke: edgeColor, strokeWidth: edgeWidth },
  //       };
  //       processedEdges.push(edge);
  //     }
  //   });
  
  //   return { nodes: processedNodes, edges: processedEdges };
  // };

  const processGraphData = (data, threshold, centralNodeAddress) => {
    const formatAddress = (address) => `${address.slice(0, 5)}...${address.slice(-5)}`;
    const processedNodes = [];
    const processedEdges = [];
    const nodeTracker = new Set(); // To track unique node positions
  
    data.forEach((item) => {
      const valueInEth = item.value / 10 ** 18;
      if (valueInEth < threshold) return;
  
      const fromAddress = item.from_address;
      const toAddress = item.to_address;
  
      // Differentiate node IDs for duplicates
      const fromNodeID = fromAddress === centralNodeAddress ? fromAddress : `${fromAddress}-from`;
      const toNodeID = toAddress === centralNodeAddress ? toAddress : `${toAddress}-to`;
  
      // Determine the node positions
      const fromPositionX = fromAddress === centralNodeAddress ? 0 : -200;
      const toPositionX = toAddress === centralNodeAddress ? 0 : 200;
  
      // Create the fromNode if not already created for the current context
      if (!nodeTracker.has(fromNodeID)) {
        const fromNode = {
          id: fromNodeID,
          name: fromAddress,
          data: {
            label: formatAddress(fromAddress),
            sourceHandles: [{ id: `${fromNodeID}-s` }],
            targetHandles: [{ id: `${fromNodeID}-t` }],
          },
          position: { x: fromPositionX, y: 0 }, // Position will be updated by layout
          type: "elk",
          style: {
            minWidth: 100,
            textDecoration: fromAddress === centralNodeAddress ? "underline" : "none",
          },
        };
        processedNodes.push(fromNode);
        nodeTracker.add(fromNodeID);
      }
  
      // Create the toNode if not already created for the current context
      if (!nodeTracker.has(toNodeID)) {
        const toNode = {
          id: toNodeID,
          name: toAddress,
          data: {
            label: formatAddress(toAddress),
            sourceHandles: [{ id: `${toNodeID}-s` }],
            targetHandles: [{ id: `${toNodeID}-t` }],
          },
          position: { x: toPositionX, y: 0 }, // Position will be updated by layout
          type: "elk",
          style: {
            minWidth: 100,
            textDecoration: toAddress === centralNodeAddress ? "underline" : "none",
          },
        };
        processedNodes.push(toNode);
        nodeTracker.add(toNodeID);
      }
  
      let edgeColor = "gray";
      if (fromAddress === centralNodeAddress) edgeColor = "red";
      else if (toAddress === centralNodeAddress) edgeColor = "green";
  
      const edgeWidth = Math.min(Math.max(valueInEth * 5, 1), 5);
      const edgeId = `${fromNodeID}-${toNodeID}`;
  
      if (!processedEdges.some((edge) => edge.id === edgeId)) {
        const edge = {
          id: edgeId,
          source: fromNodeID,
          sourceHandle: `${fromNodeID}-s`,
          target: toNodeID,
          targetHandle: `${toNodeID}-t`,
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
      console.log(change.type)
      if(change.type=="position") return;
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
