import React from 'react';

const ChainCard = ({ providerName, transactions, error }) => {
  return (
    <div className={`flex flex-col items-center m-2 p-4 rounded-lg text-black min-w-[200px] ${error ? 'bg-gray-200 border-gray-400 opacity-50' : 'shadow-lg'} border-2`}>
      <div className="text-center">
        <span className="block text-sm font-semibold">{providerName}</span>
        {!error && <span className="block text-xs mt-1">{transactions}</span>}
      </div>
      {error && <span className="text-gray-700 text-xs mt-1">Error</span>}
    </div>
  );
};

export default ChainCard;
