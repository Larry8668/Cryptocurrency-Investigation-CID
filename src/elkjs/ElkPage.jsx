import React, { useEffect, useContext, useState } from "react";
import ReactFlow, {
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  ControlButton,
  Panel,
} from "reactflow";

import "reactflow/dist/style.css";
import "../index.css";
import { SunIcon } from "@radix-ui/react-icons";

import ElkNode from "./ElkNode";
import useLayoutNodes from "./useLayoutNodes";
import { GlobalContext } from "../context/GlobalContext";
import DownloadButton from "../utils/DownloadButton";

import Modal from "../components/modal/Modal";

import { SyncLoader } from "react-spinners";
import GraphPanel from "../components/GraphPanel";

const nodeTypes = {
  elk: ElkNode,
};

const centralNodeAddress = "0xa336033fc39a359e375007e75af49768e98d0790";
const snapGrid = [50, 25];

export function ElkPage() {
  const { sideModalOpen, setSideModalOpen, selectedNode, setSelectedNode } =
    useContext(GlobalContext);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [graphLoaded, setGraphLoaded] = useState(false);

  useLayoutNodes();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setGraphLoaded(false);
        const response = await fetch(
          `https://onchainanalysis.vercel.app/api/eth/0x1/${centralNodeAddress}`
        );
        const data = await response.json();
        console.log("API data ->", data.result);

        const formatAddress = (address) =>
          `${address.slice(0, 5)}...${address.slice(-5)}`;
        const processedNodes = [];
        const processedEdges = [];
        const nodeMap = new Map();
        const threshold = 0.00001;

        data.result.forEach((item) => {
          const valueInEth = item.value / 10 ** 18;
          if (valueInEth < threshold) return;
          const fromAddress = item.from_address;
          const toAddress = item.to_address;
          console.log("From ->", fromAddress, "To ->", toAddress, "Value ->", valueInEth)

          // if (nodeMap.has(fromAddress)) {
            const fromNode = {
              id: fromAddress,
              data: {
                label: formatAddress(fromAddress),
                sourceHandles: [{ id: `${fromAddress}-s` }],
                targetHandles: [{ id: `${fromAddress}-t` }],
              },
              position: { x: 0, y: 0 },
              type: "elk",
              style: {
                minWidth: 100,
              },
            };
            processedNodes.push(fromNode);
            nodeMap.set(fromAddress, fromNode);
          // }

          // if (!nodeMap.has(toAddress)) {
            const toNode = {
              id: toAddress,
              data: {
                label: formatAddress(toAddress),
                sourceHandles: [{ id: `${toAddress}-s` }],
                targetHandles: [{ id: `${toAddress}-t` }],
              },
              position: { x: 50, y: 50 },
              type: "elk",
              style: {
                minWidth: 100,
              },
            };
            processedNodes.push(toNode);
            nodeMap.set(toAddress, toNode);
          // }

          let edgeColor = "gray";
          if (fromAddress === centralNodeAddress) {
            edgeColor = "red";
          } else if (toAddress === centralNodeAddress) {
            edgeColor = "green";
          }

          const edgeWidth = Math.min(Math.max(valueInEth * 10, 1), 10);

          const edgeId = `${fromAddress}-${toAddress}`;
          // if (!processedEdges.some((edge) => edge.id === edgeId)) {
            const edge = {
              id: edgeId,
              source: fromAddress,
              sourceHandle: `${fromAddress}-s`,
              target: toAddress,
              targetHandle: `${toAddress}-t`,
              label: `${(item.value / 10 ** 18).toFixed(5)} ETH`,
              animated: true,
              style: {
                stroke: edgeColor,
                strokeWidth: edgeWidth,
              },
            };
            processedEdges.push(edge);
          // }
        });
        console.log("Processed nodes ->", processedNodes);
        console.log("Processed edges ->", processedEdges);
        setNodes(processedNodes);
        setEdges(processedEdges);
        setGraphLoaded(true);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, []);
console.log("Nodes ->", nodes)
console.log("Edges ->", edges)
  const handleNodeClick = (event, node) => {
    setSelectedNode(node);
    console.log("Selected node ->", node);
    setSideModalOpen(true);
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
        <div className="absolute h-full w-full z-10 backdrop-blur-sm bg-slate-400/10 flex gap-10 justify-center items-center text-2xl">
          {" "}
          <SyncLoader size={10} /> Fetching details...
        </div>
      )}
      <ReactFlow
        nodes={nodes}
        onNodesChange={modifiedOnNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        fitView={true}
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
    </div>
  );
}
