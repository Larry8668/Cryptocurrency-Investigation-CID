import React, { useEffect, useContext, useState, useRef } from "react";
import ReactFlow, {
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  ControlButton,
  Panel,
  MarkerType,
} from "reactflow";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
  PDFDownloadLink,
  pdf,
} from "@react-pdf/renderer";
import html2canvas from "html2canvas";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_VERCEL_GEMINI_API_KEY
);

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
    setNodesToUpdate,
    searchType,
    setSearchType,
  } = useContext(GlobalContext);

  const [search, setSearch] = useState("");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [graphLoaded, setGraphLoaded] = useState(false);
  const [walletSearchType, setWalletSearchType] = useState("standard");
  const [walletSearchDepth, setWalletSearchDepth] = useState("4");
  const [currData, setCurrData] = useState([]);

  const [pdfData, setPdfData] = useState(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const reactFlowWrapper = useRef(null);

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

        const updatedEdges = data.graphdata.edges.map((node) => ({
          ...node,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: "#FF0072",
          },
        }));

        setNodes((prevNodes) => [...prevNodes, ...data.graphdata.nodes]);
        setEdges((prevEdges) => [...prevEdges, ...updatedEdges]);

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
          let url;
          if (searchType === "Transaction") {
            url = `http://localhost:8000/api/${selectedChain.toLowerCase()}/txhash/${centralNodeAddress}`;
          } else {
            url = `http://localhost:8000/api/${selectedChain.toLowerCase()}/address/${centralNodeAddress}`;
          }
          console.log("URL ->", url);
          const response = await fetch(url);
          const data = await response.json();
          console.log("Response ->", data);

          // Process wallet data
          setCurrData(data.results);
          const updatedEdges = data.results.graphdata.edges.map((node) => ({
            ...node,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: node.style.stroke,
            },
          }));
          setNodes(data.results.graphdata.nodes);
          setEdges(updatedEdges);

          setGraphLoaded(true);
          setSearchType("Wallet"); // Reset search type to Wallet after search
        } catch (error) {
          console.error("Error fetching data: ", error);
          toast.error("Failed to fetch data");
        }
      };
      fetchData();
    }
  }, [centralNodeAddress, selectedChain, searchType]);

  useEffect(() => {
    if (nodesToUpdate) {
      const transactions = outgoingTransactions[nodesToUpdate];
      if (transactions) {
        // Add new nodes and edges
        const newNodes = transactions.map((tx, index) => ({
          id: `${nodesToUpdate}-${tx.to_address}-${index}`,
          type: "elk",
          data: {
            label: `${tx.to_address}:${nodesToUpdate.split(":")[1] || "0"}-${
              index + 1
            }`,
            targetHandles: [],
            sourceHandles: [],
          },
          position: { x: 0, y: 0 }, // The layout algorithm will position this
        }));

        const newEdges = transactions.map((tx, index) => ({
          id: `${nodesToUpdate}-${tx.to_address}-${index}`,
          source: nodesToUpdate,
          target: `${nodesToUpdate}-${tx.to_address}-${index}`,
          animated: true,
          label: `${tx.value} ${selectedChain}`,
        }));

        setNodes((nodes) => {
          const existingNodes = nodes.filter(
            (node) => !node.id.startsWith(`${nodesToUpdate}-`)
          );
          return [...existingNodes, ...newNodes];
        });
        setEdges((edges) => {
          const existingEdges = edges.filter(
            (edge) => !edge.id.startsWith(`${nodesToUpdate}-`)
          );
          return [...existingEdges, ...newEdges];
        });
      } else {
        // Remove nodes and edges
        setNodes((nodes) =>
          nodes.filter((node) => !node.id.startsWith(`${nodesToUpdate}-`))
        );
        setEdges((edges) =>
          edges.filter((edge) => !edge.id.startsWith(`${nodesToUpdate}-`))
        );
      }
      setNodesToUpdate(null);
    }
  }, [
    nodesToUpdate,
    outgoingTransactions,
    setNodes,
    setEdges,
    selectedChain,
    setNodesToUpdate,
  ]);

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

  const captureViewport = async () => {
    if (reactFlowWrapper.current) {
      const canvas = await html2canvas(reactFlowWrapper.current);
      return canvas.toDataURL("image/png");
    }
    return null;
  };

  const generatePdf = async () => {
    if (!currData) {
      toast.error("No data available to generate PDF");
      return;
    }

    setIsGeneratingPdf(true);

    try {
      const viewportImage = await captureViewport();

      // Use Gemini SDK
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const prompt = `Given the nodes and edges data from a cryptocurrency investigation tool tracking wallet transactions where the green edges signify incoming to the to-node and the red signify outgoing for the from-node , generate a structured analysis report. Include:
  
      1. A brief summary describing the nature of the graph data.
      2. A well-formatted table that includes the source wallet, destination wallet, transaction amount, and status.
      3. Key insights derived from the data, such as most active wallets, suspicious activities, or large transactions. Provide these insights in JSON format with each insight having a "header" and "description".
      4. Calculate total transaction count, inflow, and outflow for each wallet involved.
  
      Input Data:
      ${JSON.stringify({ node: nodes, edge: edges })}
  
      Output Format:
      {
        "description": "<description>",
        "tableData": [
          {
            "source": "<source wallet>",
            "destination": "<destination wallet>",
            "amount": "<amount>",
            "status": "<status>",
            "totalTransactions": "<total transaction count>",
            "inflow": "<total inflow>",
            "outflow": "<total outflow>"
          },
          ...
        ],
        "insights": [
          {
            "header": "<insight header>",
            "description": "<insight description>"
          },
          ...
        ]
      }`;

      const result = await model.generateContent(prompt);
      let responseText = result.response.text();

      // Remove backticks and markdown annotations
      responseText = responseText.replace(/```json|```|```/g, "");

      console.log("Generated PDF content:", responseText);

      // Ensure the response is a properly formatted JSON
      let generatedContent;
      try {
        generatedContent = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError, responseText);
        toast.error("Failed to parse generated PDF content");
        return;
      }

      setPdfData({
        description: generatedContent.description,
        table: generatedContent.tableData,
        insights: generatedContent.insights,
        image: viewportImage,
      });

      setIsPdfModalOpen(true);
    } catch (error) {
      console.error("Error generating PDF content:", error);
      toast.error("Failed to generate PDF content");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // PDF Document Component
  const PdfDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Transaction Analysis Report</Text>
          <Text style={styles.description}>{pdfData.description}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.subtitle}>Key Insights</Text>
          {pdfData?.insights.map((insight, index) => (
            <View key={index} style={styles.insight}>
              <Text style={styles.insightHeader}>{insight.header}</Text>
              <Text style={styles.insightDescription}>
                {insight.description}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.subtitle}>Data Table</Text>
          {pdfData?.table.map((row, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableCellContainer}>
                <Text style={styles.tableCellLabel}>Source Wallet:</Text>
                <Text style={styles.tableCellValue}>{row.source}</Text>
              </View>
              <View style={styles.tableCellContainer}>
                <Text style={styles.tableCellLabel}>Destination Wallet:</Text>
                <Text style={styles.tableCellValue}>{row.destination}</Text>
              </View>
              <View style={styles.tableCellContainer}>
                <Text style={styles.tableCellLabel}>Transaction Amount:</Text>
                <Text style={styles.tableCellValue}>{row.amount}</Text>
              </View>
              <View style={styles.tableCellContainer}>
                <Text style={styles.tableCellLabel}>Status:</Text>
                <Text style={styles.tableCellValue}>{row.status}</Text>
              </View>
              <View style={styles.tableCellContainer}>
                <Text style={styles.tableCellLabel}>Total Transactions:</Text>
                <Text style={styles.tableCellValue}>
                  {row.totalTransactions}
                </Text>
              </View>
              <View style={styles.tableCellContainer}>
                <Text style={styles.tableCellLabel}>Inflow:</Text>
                <Text style={styles.tableCellValue}>{row.inflow}</Text>
              </View>
              <View style={styles.tableCellContainer}>
                <Text style={styles.tableCellLabel}>Outflow:</Text>
                <Text style={styles.tableCellValue}>{row.outflow}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Graph Visualization</Text>
          <Image src={pdfData.image} style={styles.image} />
        </View>
      </Page>
    </Document>
  );

  // PDF Styles
  const styles = StyleSheet.create({
    page: { padding: 30 },
    section: { marginBottom: 20 },
    title: { fontSize: 24, marginBottom: 10, textAlign: "center" },
    subtitle: { fontSize: 18, marginBottom: 5 },
    description: { fontSize: 12, marginBottom: 10, textAlign: "justify" },
    image: { maxWidth: "100%", height: "auto", marginBottom: 10 },
    table: { display: "table", width: "100%", marginTop: 10 },
    tableHeader: {
      flexDirection: "row",
      borderBottom: "1px solid #000",
      marginBottom: 5,
    },
    tableRow: { marginBottom: 10 },
    tableCellContainer: {
      flexDirection: "row",
      marginBottom: 5,
    },
    tableCellLabel: {
      fontSize: 10,
      fontWeight: "bold",
      marginRight: 5,
    },
    tableCellValue: {
      fontSize: 10,
      flex: 1,
    },
    insight: { marginBottom: 10 },
    insightHeader: { fontWeight: "bold", fontSize: 14 },
    insightDescription: { fontSize: 12, marginBottom: 5 },
  });

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
      <div ref={reactFlowWrapper} style={{ width: "100%", height: "100%" }}>
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
      </div>
      <Modal props={{ data: selectedNode, sideModalOpen, setSideModalOpen }} />

      {/* Generate PDF button at the bottom */}
      {graphLoaded && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <button
            onClick={generatePdf}
            disabled={isGeneratingPdf || !nodes}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {isGeneratingPdf ? "Generating PDF..." : "Generate PDF"}
          </button>
        </div>
      )}

      {isPdfModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg w-3/4 h-3/4">
            <h2 className="text-2xl mb-4">PDF Preview</h2>
            <PDFViewer width="100%" height="80%">
              <PdfDocument />
            </PDFViewer>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsPdfModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Close
              </button>
              <PDFDownloadLink
                document={<PdfDocument />}
                fileName="Transaction_Analysis_Report.pdf"
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                {({ blob, url, loading, error }) =>
                  loading ? "Loading document..." : "Download PDF"
                }
              </PDFDownloadLink>
            </div>
          </div>
        </div>
      )}
      <Toaster position="bottom-center" />
    </div>
  );
}
