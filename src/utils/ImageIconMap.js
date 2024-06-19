// Correctly import images based on your project setup
import binance from "/binance.png";
import lido from "/lido.png";
import coinbase from "/coinbase.png";
import metamask from "/metamask.png";
import uniswap from "/uniswap.png";
import pepe from "/pepe.png";
import beaverbuild from "/beaverbuild.jpg";
import ethereum from "/ethereum.png";
import bitcoin from "/bitcoin.png";
import walton from "/walton.png";
import fetchai from "/fetchai.png";

const imageMap = {
  "Uniswap: Universal Router": uniswap,
  "Pepe (PEPE)": pepe,
  beaverbuild: beaverbuild,
  "Metamask: Swap Router": metamask,
  "Coinbase: Wallet": coinbase,
  "Lido: Staking": lido,
  "Binance 7": binance,
  defaultImage: ethereum,
  bitcoin: bitcoin,
  "Walton (WTC)": walton,
  "Fetch.ai: Old FET Token": fetchai,
};

function getImageByExchange(exchange) {
  return imageMap[exchange] || imageMap.defaultImage;
}

export default getImageByExchange;
