import React, { useState } from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

const UploadFile = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          if (jsonData.nodes && jsonData.edges) {
            setNodes(jsonData.nodes);
            setEdges(jsonData.edges);
          } else {
            alert('Invalid JSON structure. Please make sure it contains "nodes" and "edges" arrays.');
          }
        } catch (error) {
          alert('Error parsing JSON file. Please check the file format.');
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
          <label htmlFor="file-upload" className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded cursor-pointer transition duration-300">
            Upload JSON File
          </label>
          <input id="file-upload" type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
        </div>
        <div className="w-full h-full border border-purple-300 rounded">
          <ReactFlow nodes={nodes} edges={edges} fitView>
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </main>
    </div>
  );
};

export default UploadFile;