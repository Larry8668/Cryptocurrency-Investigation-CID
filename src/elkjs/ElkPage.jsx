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
    outgoingTransactions,
    nodesToUpdate,
    setNodesToUpdate
  } = useContext(GlobalContext);

  const [search, setSearch] = useState("");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [graphLoaded, setGraphLoaded] = useState(false);
  const [walletSearchType, setWalletSearchType] = useState("standard");
  const [walletSearchDepth, setWalletSearchDepth] = useState("4");
  const [currData, setCurrData] = useState([]);

  let { centralNodeAddress } = useParams();
  const navigate = useNavigate();

  useLayoutNodes();

  if (!selectedChain) {
    navigate("/elkjs");
  }

  useEffect(() => {
    if (!centralNodeAddress || !selectedChain) return;

    setGraphLoaded(false);

    if (walletSearchType === "stream") {
      const eventSource = new EventSource(
        // `http://localhost:8000/api/${selectedChain.toLowerCase()}/stream/transactions/${centralNodeAddress}`
        `https://onchainanalysis.vercel.app/api/${selectedChain.toLowerCase()}/stream/transactions/${centralNodeAddress}`
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
        toast.success("SSE Data transfer complete");
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    } else {
      const fetchData = async () => {
        try {
          console.log(
            "Fetching data for chain",
            selectedChain,
            "with address",
            centralNodeAddress,
            "..."
          );
          // const url = `http://localhost:8000/api/${selectedChain.toLowerCase()}/address/${centralNodeAddress}`;
          const url = `https://onchainanalysis.vercel.app/api/${selectedChain.toLowerCase()}/address/${centralNodeAddress}`;
          console.log("URL ->", url);
          const response = await fetch(url);
          const data = await response.json();
          console.log("Response ->", data);
          setCurrData(data.results);
          setNodes(data.results.graphdata.nodes);
          setEdges(data.results.graphdata.edges);
          setGraphLoaded(true);
        } catch (error) {
          console.error("Error fetching data: ", error);
          toast.error("Failed to fetch data");
        }
      };
      fetchData();
    }
  }, [centralNodeAddress, selectedChain, walletSearchType]);

  useEffect(() => {
    if (nodesToUpdate) {
      const transactions = outgoingTransactions[nodesToUpdate];
      if (transactions) {
        // Add new nodes and edges
        const newNodes = transactions.map((tx, index) => ({
          id: `${nodesToUpdate}-${tx.to_address}-${index}`,
          type: 'elk',
          data: { 
            label: `${tx.to_address}:${nodesToUpdate.split(':')[1] || '0'}-${index + 1}`,
            targetHandles: [],
            sourceHandles: []
          },
          position: { x: 0, y: 0 }  // The layout algorithm will position this
        }));

        const newEdges = transactions.map((tx, index) => ({
          id: `${nodesToUpdate}-${tx.to_address}-${index}`,
          source: nodesToUpdate,
          target: `${nodesToUpdate}-${tx.to_address}-${index}`,
          animated: true,
          label: `${tx.value} ${selectedChain}`
        }));

        setNodes(nodes => {
          const existingNodes = nodes.filter(node => !node.id.startsWith(`${nodesToUpdate}-`));
          return [...existingNodes, ...newNodes];
        });
        setEdges(edges => {
          const existingEdges = edges.filter(edge => !edge.id.startsWith(`${nodesToUpdate}-`));
          return [...existingEdges, ...newEdges];
        });
      } else {
        // Remove nodes and edges
        setNodes(nodes => nodes.filter(node => !node.id.startsWith(`${nodesToUpdate}-`)));
        setEdges(edges => edges.filter(edge => !edge.id.startsWith(`${nodesToUpdate}-`)));
      }
      setNodesToUpdate(null);
    }
  }, [nodesToUpdate, outgoingTransactions, setNodes, setEdges, selectedChain, setNodesToUpdate]);

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
          walletSearchType={walletSearchType}
          setWalletSearchType={setWalletSearchType}
          walletSearchDepth={walletSearchDepth}
          setWalletSearchDepth={setWalletSearchDepth}
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
