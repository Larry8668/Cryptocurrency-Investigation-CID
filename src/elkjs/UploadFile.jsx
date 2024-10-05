import React, { useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';

const CustomNode = ({ data }) => {
  return (
    <div
      style={{
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#f0f4f8',
        border: '1px solid #ccc',
        textAlign: 'center',
        color: 'black', // Text color set to black
      }}
    >
      <strong>{data.label}</strong>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

const nodeTypes = { customNode: CustomNode };

const UploadFile = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          if (jsonData.nodes && jsonData.edges) {
            // Map nodes to include positions and types
            const mappedNodes = jsonData.nodes.map((node, index) => ({
              ...node,
              id: node.id || `${index}`,
              data: { label: node.name || node.id },
              position:
                node.position || { x: Math.random() * 400, y: Math.random() * 400 },
              type: 'customNode',
            }));
            const mappedEdges = jsonData.edges.map((edge) => ({
              ...edge,
              id: edge.id || `${edge.source}-${edge.target}`,
            }));

            setNodes(mappedNodes);
            setEdges(mappedEdges);
            setError('');
          } else {
            setError('Invalid JSON structure. Please make sure it contains "nodes" and "edges" arrays.');
          }
        } catch (error) {
          setError('Error parsing JSON file. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen bg-white">
      <header className="bg-purple-600 text-white p-4">
        <h1 className="text-2xl font-bold">Graph Visualizer</h1>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="mb-4">
          <label
            htmlFor="file-upload"
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded cursor-pointer transition duration-300"
          >
            Upload JSON File
          </label>
          <input id="file-upload" type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          {fileName && <div className="text-sm text-gray-600 mt-2">Uploaded: {fileName}</div>}
        </div>
        {error && <div className="text-red-500 text-center">{error}</div>}
        <div className="w-full h-full border border-purple-300 rounded overflow-hidden">
          <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </main>
    </div>
  );
};

export default UploadFile;
