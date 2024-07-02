import binance from "/cid/binance.png";
// import lido from "/lido.png";
import coinbase from "/cid/coinbase.png";
// import metamask from "/metamask.png";
import uniswap from "/cid/uniswap.png";
import pepe from "/cid/pepe.png";
// import beaverbuild from "/beaverbuild.jpg";
import ethereum from "/cid/ethcoin.png";
import bitcoin from "/cid/bitcoin.png";
// import walton from "/walton.png";
// import fetchai from "/fetchai.png";

const imageMap = {
  "Uniswap: Universal Router": uniswap,
  "Pepe (PEPE)": pepe,
  // "beaverbuild": beaverbuild,
  // "Metamask: Swap Router": metamask,
  "Coinbase: Wallet": coinbase,
  // "Lido: Staking": lido,
  "Binance 7": binance,
  "ethereum": ethereum,
  "bitcoin": bitcoin,
  // "Walton (WTC)": walton,
  // "Fetch.ai: Old FET Token": fetchai,
  defaultImage: ethereum,
};

function getImageByExchange(exchange) {
  return imageMap[exchange] || imageMap.defaultImage;
}

export default getImageByExchange;
