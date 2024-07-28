import React, { useState, useEffect, useRef } from 'react';

const BitcoinTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const eventSourceRef = useRef(null);

  useEffect(() => {
    const address = 'bc1qhg7fpzxl68m2g5l0ane9h9akw4hfnh2s8hn3gm';
    // eventSourceRef.current = new EventSource(`http://localhost:8000/api/btc/trace/transactions/${address}`);
    eventSourceRef.current = new EventSource(`https://onchainanalysis.vercel.app/api/btc/trace/transactions/${address}`);

    eventSourceRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received data:', data); // Log each received message
      
      if (data.type === 'transactions') {
        data.transactions.forEach(tx => {
          setTransactions(prevTransactions => [
            ...prevTransactions,
            {
              ...tx,
              value: tx.value / 100000000, // Convert from satoshi to BTC
              layer: data.layerNumber,
              totalProcessed: data.totalProcessed
            }
          ]);
          console.log('Added transaction:', tx); // Log each added transaction
        });
      } else if (data.type === 'error') {
        setError(data.message);
      } else if (data.type === 'close') {
        console.log('Stream completed');
        setIsComplete(true);
        eventSourceRef.current.close();
      }
    };

    eventSourceRef.current.onerror = (error) => {
      console.error('EventSource failed:', error);
      setError('Connection to server failed');
      eventSourceRef.current.close();
    };

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  // This effect will run after each render, logging the current state of transactions
  useEffect(() => {
    console.log('Current transactions:', transactions);
  }, [transactions]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Bitcoin Transactions</h1>
      <p>Total transactions received: {transactions.length}</p>
      <table>
        <thead>
          <tr>
            <th>Layer</th>
            <th>From Address</th>
            <th>To Address</th>
            <th>Value (BTC)</th>
            <th>Total Processed</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, index) => (
            <tr key={index}>
              <td>{tx.layer}</td>
              <td>{tx.from_address}</td>
              <td>{tx.to_address}</td>
              <td>{tx.value.toFixed(8)}</td>
              <td>{tx.totalProcessed}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {isComplete && <p>Stream completed. No more transactions to process.</p>}
    </div>
  );
};

export default BitcoinTransactions;