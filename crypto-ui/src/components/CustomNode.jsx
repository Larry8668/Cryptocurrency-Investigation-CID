// CustomNode.js
import React from 'react';
import { Handle, Position } from 'reactflow';

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

const CustomNode = ({ data }) => {
  return (
    <div onClick={()=>{alert("Bruh")}} className="min-w-32 h-14 p-4 flex items-center justify-around gap-4 bg-white border-2 border-red-700 rounded">
      <span className="p-1 rounded-full bg-slate-600">
        <img src={imageMap[data.exchange]} className='rounded-full' width="40" height="40" />
      </span>
      <div className="text-black">{data.label}</div>
      <Handle type="source" position={Position.Right} id="right" style={{ borderRadius: 0 }} />
      <Handle type="target" position={Position.Left} id="left" style={{ borderRadius: 0 }} />
    </div>
  );
};

export default CustomNode;
