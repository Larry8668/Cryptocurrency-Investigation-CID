export const nodeData={
    initialNodes: [
        { layer: 1, id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
        { layer: 2, id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
        { layer: 3, id: '3', position: { x: 0, y: 100 }, data: { label: '3' } },
        { layer: 2, id: '4', position: { x: 0, y: 100 }, data: { label: '4' } },
        { layer: 3, id: '5', position: { x: 0, y: 100 }, data: { label: '5' } },
        { layer: 3, id: '9', position: { x: 0, y: 100 }, data: { label: '6' } },
        { layer: 2, id: '6', position: { x: 0, y: 100 }, data: { label: '7' } },
        { layer: 2, id: '8', position: { x: 0, y: 100 }, data: { label: '8' } },
        { layer: 1, id: '7', position: { x: 0, y: 100 }, data: { label: '9' } },
    ],
    initialEdges: [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e3-7', source: '3', target: '1' },
        { id: 'e6-7', source: '6', target: '7' },
        { id: 'e1-5', source: '1', target: '5' },
        
    ]
}