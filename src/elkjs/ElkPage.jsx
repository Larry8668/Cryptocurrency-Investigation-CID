import React, { useEffect } from "react";
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
} from "reactflow";

import "reactflow/dist/style.css";
import "../index.css";

import ElkNode from "./ElkNode";
import { nodes as initNodes } from "./nodes";
import { edges as initEdges } from "./edges";
import useLayoutNodes from "./useLayoutNodes";

const nodeTypes = {
  elk: ElkNode,
};

export function ElkPage() {
  // const [nodes, , onNodesChange] = useNodesState(initNodes);
  // const [edges, , onEdgesChange] = useEdgesState(initEdges);
  
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

        data.result.forEach((item) => {
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
              position: { x: Math.random() * 600, y: Math.random() * 400 },
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
              position: { x: Math.random() * 600, y: Math.random() * 400 },
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
              label: `${item.value} ETH`,
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


  return (
    <div className="w-[100vw] h-[100vh] bg-white text-black">
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        fitView
        nodeTypes={nodeTypes}
  
      >
        <Background />
      </ReactFlow>
    </div>
  );
}
