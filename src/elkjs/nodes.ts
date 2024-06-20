import { Node } from 'reactflow';

export type ElkNodeData = {
  label: string;
  sourceHandles: { id: string }[];
  targetHandles: { id: string }[];
};

export type ElkNode = Node<ElkNodeData, 'elk'>;

export const nodes: ElkNode[] = [
 
  {
    id: 'a',
    data: {
      label: 'A',
      sourceHandles: [{ id: 'a-s-a' }, { id: 'a-s-b' }, { id: 'a-s-c' }],
      targetHandles: [],
    },
    position: { x: 0, y: 0 },
    type: 'elk',
  },
  
];
