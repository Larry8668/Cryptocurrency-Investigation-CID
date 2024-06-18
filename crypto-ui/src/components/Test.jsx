import { useEffect, useState } from "react";
import ReactFlow, { Background } from "reactflow";
import "reactflow/dist/style.css";
import CustomNode from "../components/CustomNode";
import { nodeData } from "../../data/node-data";
import { Toaster } from "sonner";

const columnSpacing = 250;
const rowSpacing = 100;

const Test = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState(nodeData.initialEdges);

  useEffect(() => {
    const containerHeight =
      document.getElementById("graphContainer")?.clientHeight || 500;
    const verticalCenter = containerHeight / 2;

    const nodesByLayer = nodeData.initialNodes.reduce((acc, node) => {
      if (!acc[node.layer]) acc[node.layer] = [];
      acc[node.layer].push(node);
      return acc;
    }, {});

    const positionedNodes = Object.keys(nodesByLayer).flatMap(
      (layerKey, colIndex) => {
        const layerNodes = nodesByLayer[layerKey];
        const numNodes = layerNodes.length;
        const totalHeight = (numNodes - 1) * rowSpacing;

        return layerNodes.map((node, index) => ({
          ...node,
          type: "customNode",
          position: {
            x: colIndex * columnSpacing,
            y: verticalCenter - totalHeight / 2 + index * rowSpacing,
          },
        }));
      }
    );

    setNodes(positionedNodes);
  }, []);

  const nodeTypes = {
    customNode: CustomNode,
  };

  return (
    <div className="w-[100vw] h-[100vh]" id="graphContainer">
      <div className="w-full h-[15%] flex items-center justify-center text-5xl">
        Test Env
      </div>
      <div className="w-full h-[85%] border-2 border-white rounded p-2">
        <div className="w-full h-full relative">
          <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes}>
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Test;
