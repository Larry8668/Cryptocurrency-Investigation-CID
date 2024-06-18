export const nodeData={
    initialNodes: [
        { layer: 1, id: '1', position: { x: 0, y: 0 }, data: { label: '1', exchange : 'Uniswap: Universal Router' } },
        { layer: 2, id: '2', position: { x: 0, y: 100 }, data: { label: '2', exchange: 'Pepe (PEPE)' } },
        { layer: 3, id: '3', position: { x: 0, y: 100 }, data: { label: '3', exchange: 'Metamask: Swap Router' } },
        { layer: 2, id: '4', position: { x: 0, y: 100 }, data: { label: '4', exchange: 'Coinbase: Wallet' } },
        { layer: 3, id: '5', position: { x: 0, y: 100 }, data: { label: '5', exchange: 'Lido: Staking' } },
        { layer: 3, id: '9', position: { x: 0, y: 100 }, data: { label: '6', exchange: 'Binance 7' } },
        { layer: 2, id: '6', position: { x: 0, y: 100 }, data: { label: '7', exchange: 'Walton (WTC)' } },
        { layer: 2, id: '8', position: { x: 0, y: 100 }, data: { label: '8', exchange: 'bitcoin' } },
        { layer: 1, id: '7', position: { x: 0, y: 100 }, data: { label: '9', exchange: 'Fetch.ai: Old FET Token' } },
    ],
    initialEdges: [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e3-7', source: '1', target: '3' },
        { id: 'e6-7', source: '7', target: '6' },
        { id: 'e1-5', source: '1', target: '5' },
        
    ]
}