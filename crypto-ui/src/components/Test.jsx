import { useEffect, useState } from 'react';
import {ReactFlow, Background} from 'reactflow';
import 'reactflow/dist/style.css';
import { nodeData } from '../../data/node-data'; 

const columnSpacing = 200;
const rowSpacing = 100;
const columnHeight = 500;

const Test = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState(nodeData.initialEdges);

  useEffect(() => {
    // Organize nodes by their layer
    const nodesByLayer = nodeData.initialNodes.reduce((acc, node) => {
      if (!acc[node.layer]) acc[node.layer] = [];
      acc[node.layer].push(node);
      return acc;
    }, {});

    // Calculate new positions for nodes based on their layer
    const positionedNodes = Object.keys(nodesByLayer).flatMap((layerKey, colIndex) => {
      const layerNodes = nodesByLayer[layerKey];
      const numNodes = layerNodes.length;
      const verticalCenter = columnHeight / 2; // Center position for the column
      const totalHeight = (numNodes - 1) * rowSpacing; // Total height covered by all nodes

      return layerNodes.map((node, index) => ({
        ...node,
        position: {
          x: colIndex * columnSpacing,
          y: verticalCenter - totalHeight / 2 + index * rowSpacing // Center nodes around the middle
        }
      }));
    });

    setNodes(positionedNodes);
  }, []);

  // Function to add a new node
  const addNode = () => {
    const newLayer = 1; // Example: Add the node to layer 1
    const nodesInLayer = nodes.filter(node => node.layer === newLayer);
    const newNodeId = (nodes.length + 1).toString();

    // Calculate the new node's y-position in the specified layer
    const verticalCenter = columnHeight / 2;
    const totalHeight = (nodesInLayer.length) * rowSpacing;

    const newNode = {
      id: newNodeId,
      layer: newLayer,
      position: {
        x: (newLayer - 1) * columnSpacing,
        y: verticalCenter - totalHeight / 2 + nodesInLayer.length * rowSpacing
      },
      data: { label: `Node ${newNodeId}` }
    };

    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div className="w-[100vw] h-[100vh]">
      <div className="w-full h-[15%] flex items-center justify-center text-5xl">
        Test Env
      </div>
      <div className="w-full h-[85%] border-2 border-white rounded p-2">
        <div className="w-full h-full relative">
          <ReactFlow nodes={nodes} edges={edges} >
            <Background variant="dots" gap={12} size={2} />
          </ReactFlow>
          <div className="absolute bottom-5 right-5">
            <button
              onClick={addNode}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add Node
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
