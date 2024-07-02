import { toast } from "sonner";
import {processEthereumGraphData, processBitcoinGraphData} from "./ProcessGraphData";

const getGraphData = async (walletAddress, selectedChain, thresholdValue) =>{
  console.log("Selected chain ->", selectedChain[0]);
    switch(selectedChain){
        case "ETH":
            return getEthereumData(walletAddress, thresholdValue);
        case "BTC":
            return getBitCoinData(walletAddress, thresholdValue);
        default:
            toast.error("Invalid Chain");
    }
}

const getEthereumData = async (walletAddress, thresholdValue) => {
    try {
        console.log("Getting Ethereum info...")
        const response = await fetch(`https://onchainanalysis.vercel.app/api/eth/0x1/${walletAddress}`);
        const data = await response.json();
        console.log("API data ->", data.result);

        const { nodes: initialNodes, edges: initialEdges } = processEthereumGraphData(data.result, thresholdValue, walletAddress);
        return {nodes: initialNodes, edges: initialEdges};
      } catch (error) {
        console.error("Error fetching data: ", error);
        toast.error("Failed to fetch data");
      }
}

const getBitCoinData = async (walletAddress, thresholdValue) => {
    try {
        console.log("Getting Bitcoin info...")
        const response = await fetch(`https://onchainanalysis.vercel.app/api/bitcoin/transactions/${walletAddress}`);
        const data = await response.json();
        console.log("API data ->", data.result);

        const { nodes: initialNodes, edges: initialEdges } = processBitcoinGraphData(data.result, thresholdValue, walletAddress);
        return {nodes: initialNodes, edges: initialEdges};
      } catch (error) {
        console.error("Error fetching data: ", error);
        toast.error("Failed to fetch data");
      }
}

export default getGraphData;