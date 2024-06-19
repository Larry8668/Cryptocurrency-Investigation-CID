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
  const [nodes, , onNodesChange] = useNodesState(initNodes);
  const [edges, , onEdgesChange] = useEdgesState(initEdges);

  useLayoutNodes();

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
