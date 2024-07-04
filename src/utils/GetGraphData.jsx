import { toast } from "sonner";
import { cacheClient } from "../../redis/cacheProvider";
import { processEthereumGraphData, processBitcoinGraphData } from "./ProcessGraphData";

const CACHE_EXPIRATION_TIME = 3600; // Cache expiration time in seconds (e.g., 1 hour)

const getGraphData = async (walletAddress, selectedChain, thresholdValue) => {
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

const parseCachedData = (data) => {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("Error parsing cached data:", error);
      return null;
    }
  }
  return data; 
}

const getEthereumData = async (walletAddress, thresholdValue) => {
  try {
    const cacheKey = `eth_${walletAddress}`;
    let cachedData = await cacheClient.get(cacheKey);

    if (cachedData) {
      console.log("Returning cached Ethereum data");
      return parseCachedData(cachedData);
    }

    console.log("Fetching Ethereum data...");
    const response = await fetch(`https://onchainanalysis.vercel.app/api/eth/0x1/${walletAddress}`);
    const data = await response.json();
    console.log("API data ->", data.result);

    const { nodes: initialNodes, edges: initialEdges } = processEthereumGraphData(data.result, thresholdValue, walletAddress);
    const result = { nodes: initialNodes, edges: initialEdges };

    console.log("Setting Ethereum data in cache...")
    await cacheClient.set(cacheKey, JSON.stringify(result), { expirationTtl: CACHE_EXPIRATION_TIME });
    return result;
  } catch (error) {
    console.error("Error fetching Ethereum data: ", error);
    toast.error("Failed to fetch Ethereum data");
  }
}

const getBitCoinData = async (walletAddress, thresholdValue) => {
  try {
    const cacheKey = `btc_${walletAddress}`;
    let cachedData = await cacheClient.get(cacheKey);

    if (cachedData) {
      console.log("Returning cached Bitcoin data");
      return parseCachedData(cachedData);
    }

    console.log("Fetching Bitcoin data...");
    const response = await fetch(`https://onchainanalysis.vercel.app/api/bitcoin/transactions/${walletAddress}`);
    const data = await response.json();
    console.log("API data ->", data.result);

    const { nodes: initialNodes, edges: initialEdges } = processBitcoinGraphData(data.result, thresholdValue, walletAddress);
    const result = { nodes: initialNodes, edges: initialEdges };

    
    console.log("Setting Bitcoin data in cache...")
    await cacheClient.set(cacheKey, JSON.stringify(result), { expirationTtl: CACHE_EXPIRATION_TIME });
    return result;
  } catch (error) {
    console.error("Error fetching Bitcoin data: ", error);
    toast.error("Failed to fetch Bitcoin data");
  }
}

export default getGraphData;
