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
import DownloadOptions from "../utils/DownloadOptions";
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
    selectedChain,
    searchType,
  } = useContext(GlobalContext);

  const [search, setSearch] = useState("");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [graphLoaded, setGraphLoaded] = useState(false);
  const [currData, setCurrData] = useState([]);

  let { centralNodeAddress } = useParams();
  const navigate = useNavigate();

  useLayoutNodes();

  if(!selectedChain) {
   navigate("/elkjs");  
  }


  useEffect(() => {
    if (!centralNodeAddress || !selectedChain) return;

    setGraphLoaded(false);

    const eventSource = new EventSource(
      `http://localhost:8000/api/${selectedChain.toLowerCase()}/stream/transactions/${centralNodeAddress}`
    );

    console.log("Event source ->", eventSource);

    eventSource.onmessage = function (event) {
      const data = JSON.parse(event.data);
      console.log("Received data ->", data);
      console.log("Nodes ->", data.graphdata.nodes);
      console.log("Edges ->", data.graphdata.edges);

      setNodes((prevNodes) => [...prevNodes, ...data.graphdata.nodes]);
      setEdges((prevEdges) => [...prevEdges, ...data.graphdata.edges]);

      setGraphLoaded(true);
    };

    eventSource.onerror = function (error) {
      console.error("EventSource failed:", error);
      toast.error("Failed to fetch data via SSE");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [centralNodeAddress, selectedChain]);
  
  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!centralNodeAddress) return;
  //     setGraphLoaded(false);
  //     try {
  //       console.log(
  //         "Fetching data for chain",
  //         selectedChain,
  //         "with address",
  //         centralNodeAddress,
  //         "..."
  //       );
  //       // const url = `https://onchainanalysis.vercel.app/api/${selectedChain.toLowerCase()}/address/${centralNodeAddress}`;
  //       const url = `http://localhost:8000/api/${selectedChain.toLowerCase()}/address/${centralNodeAddress}`;
  //       console.log("URL ->", url);
  //       const response = await fetch(url);
  //       const data = await response.json();
  //       console.log("Response ->", data);
  //       setCurrData(data.results);
  //       // const data = await getGraphData(
  //       //   centralNodeAddress,
  //       //   selectedChain,
  //       //   thresholdValue,
  //       //   searchType
  //       // );
  //       setNodes(data.results.graphdata.nodes);
  //       setEdges(data.results.graphdata.edges);
  //       setGraphLoaded(true);
  //     } catch (error) {
  //       console.error("Error fetching data: ", error);
  //       toast.error("Failed to fetch data");
  //     }
  //   };
  //   fetchData();
  // }, [centralNodeAddress]);

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
    setSideModalOpen(true);
  };

  const handleSearch = () => {
    if (search.length === 0) return;
    navigate(`/elkjs/${search}`);
  };

  const modifiedOnNodesChange = (changes) => {
    changes.forEach((change) => {
      if (change.type == "position") return;
    });
    onNodesChange(changes);
  };
  console.log("Selected node ->", selectedNode);

  return (
    <div className="w-[100vw] h-[100vh] bg-white text-black">
      {graphLoaded ? null : (
        <GraphOverlay
          centralNodeAddress={centralNodeAddress}
          setSearch={setSearch}
          handleSearch={handleSearch}
        />
      )}
      <ReactFlow
        nodes={nodes}
        onNodeClick={handleNodeClick}
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
        <DownloadOptions centralNode={centralNodeAddress} />
      </ReactFlow>
      <Modal props={{ data: selectedNode, sideModalOpen, setSideModalOpen }} />
      <Toaster position="bottom-center" />
    </div>
  );
}
