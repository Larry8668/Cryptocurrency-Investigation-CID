import {useContext} from "react"; 
import { Handle, Position } from "reactflow";
import { toast } from "sonner";
import { GlobalContext } from "../context/GlobalContext";
import getImageByExchange from "../utils/ImageIconMap";

const CustomNode = ({ data }) => {
  const { setSideModalOpen, setSelectedNode } = useContext(GlobalContext);
  return (
    <div
      onClick={() => {
        setSideModalOpen(true);
        setSelectedNode(data);
        toast.info(`Seeing ${data.label} on ${data.exchange}`)
      }}
      className="p-1 flex items-center gap-4 bg-white border-2 border-red-700 rounded-full border-dashed"
    >
      <span className="rounded-full bg-slate-600">
        <img
          src={getImageByExchange(data.exchange)}
          className="rounded-full"
          width="20"
          height="20"
        />
      </span>
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{ borderRadius: 0 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{ borderRadius: 0 }}
      />
    </div>
  );
};

export default CustomNode;
