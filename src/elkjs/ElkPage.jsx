import React, { useEffect, useContext } from "react";
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
import { SunIcon } from '@radix-ui/react-icons'

import ElkNode from "./ElkNode";
import useLayoutNodes from "./useLayoutNodes";
import { GlobalContext } from "../context/GlobalContext";
import DownloadButton from "../utils/DownloadButton"

import Modal from "../components/modal/Modal";

const nodeTypes = {
  elk: ElkNode,
};

const connectionLineStyle = { stroke: '#ffff' };
const snapGrid = [25, 25];

export function ElkPage() {
  const { sideModalOpen, setSideModalOpen, selectedNode, setSelectedNode } = useContext(GlobalContext);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useLayoutNodes();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://onchainanalysis.vercel.app/api/eth/0x1/0xa336033fc39a359e375007e75af49768e98d0790');
        const data = await response.json();
        console.log(data.result);

        const formatAddress = (address) => `${address.slice(0, 5)}...${address.slice(-5)}`;
        const processedNodes = [];
        const processedEdges = [];
        const nodeMap = new Map();
        const threshold = 0.00001;

        data.result.forEach((item) => {
          const valueInEth = item.value / 10 ** 18;
          if (valueInEth < threshold) return; 
          const fromAddress = item.from_address;
          const toAddress = item.to_address;

          if (!nodeMap.has(fromAddress)) {
            const fromNode = {
              id: fromAddress,
              data: {
                label: formatAddress(fromAddress),
                sourceHandles: [{ id: `${fromAddress}-s` }],
                targetHandles: [{ id: `${fromAddress}-t` }],
              },
              position: { x: 0, y: 0 },
              type: 'elk',
            };
            processedNodes.push(fromNode);
            nodeMap.set(fromAddress, fromNode);
          }

          if (!nodeMap.has(toAddress)) {
            const toNode = {
              id: toAddress,
              data: {
                label: formatAddress(toAddress),
                sourceHandles: [{ id: `${toAddress}-s` }],
                targetHandles: [{ id: `${toAddress}-t` }],
              },
              position: { x: 50, y: 50 },
              type: 'elk',
            };
            processedNodes.push(toNode);
            nodeMap.set(toAddress, toNode);
          }

          const edgeId = `${fromAddress}-${toAddress}`;
          if (!processedEdges.some(edge => edge.id === edgeId)) {
            const edge = {
              id: edgeId,
              source: fromAddress,
              sourceHandle: `${fromAddress}-s`,
              target: toAddress,
              targetHandle: `${toAddress}-t`,
              label: `${(item.value / 10 ** 18).toFixed(5)} ETH`,
              animated: true,
            };
            processedEdges.push(edge);
          }
        });

        setNodes(processedNodes);
        setEdges(processedEdges);

      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, []);

  const handleNodeClick = (event, node) => {
    setSelectedNode(node);
    setSideModalOpen(true);
  };

  const modifiedOnNodesChange = (changes) => {
    changes.forEach(change => {
      if (change.type === 'select') {
        handleNodeClick(null, change);
      }
    });
    onNodesChange(changes);
  };

  return (
    <div className="w-[100vw] h-[100vh] bg-white text-black">
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
        <Panel position="top-left">add something similar to breadcrums for customization</Panel>
        <Controls>
        <ControlButton onClick={() => alert('Something magical just happened. ✨')}>
          <SunIcon />
        </ControlButton>
        </Controls >
        <Background
        id="1"
        gap={10}
        color="#f1f1f1"
        variant={BackgroundVariant.Lines}
      />
 
      <Background
        id="2"
        gap={100}
        color="#ccc"
        variant={BackgroundVariant.Lines}
      />
        <DownloadButton />
      </ReactFlow>
      <Modal props={{ data: selectedNode, sideModalOpen, setSideModalOpen }} /> 
    </div>
  );
}
