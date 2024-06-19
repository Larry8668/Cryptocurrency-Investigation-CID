import { useEffect, useState, useContext } from "react";
import ReactFlow, { Background } from "reactflow";
import "reactflow/dist/style.css";
import CustomNode from "./CustomNode";
import { nodeData } from "../../data/node-data";
import { Toaster } from "sonner";
import { GlobalContext } from "../context/GlobalContext";
import Modal from "../components/modal/Modal";

const columnSpacing = 200;
const rowSpacing = 100;

const Test = () => {
  const { sideModalOpen, setSideModalOpen, selectedNode, setSelectedNode } = useContext(GlobalContext);
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
    <div className="w-[100vw] h-[100vh] bg-white text-black p-4" id="graphContainer">
      <div className="w-full h-[15%] flex items-center justify-center text-5xl">
        Test Env {sideModalOpen ? "Open" : "Closed"}
      </div>
      <div className="w-full h-[85%] border-2 border-black rounded p-2">
        <div className="w-full h-full relative">
          <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView={true} draggable={true}>
            <Background variant="lines" gap={[100, 500000]} lineWidth={2} offset={3} />
          </ReactFlow>
        </div>
      </div>
      <Modal props={{ data: selectedNode, sideModalOpen, setSideModalOpen }} />      
      <Toaster position="bottom-left"/>
    </div>
  );
};

export default Test;
