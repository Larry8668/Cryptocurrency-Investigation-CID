import React, { useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import getImageByExchange from "../../utils/ImageIconMap";
import LineGraph from "../charts/Line";
import CircleGraph from "../charts/Circle";
import LoadingDisplay from "../../utils/LoadingDisplay";

const graphData = [
  { name: "Page A", uv: 400, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 300, pv: 2400, amt: 2400 },
  { name: "Page C", uv: 500, pv: 2400, amt: 2400 },
  { name: "Page D", uv: 200, pv: 2400, amt: 2400 },
];
const data01 = [
  {
    name: "Group A",
    value: 400,
  },
  {
    name: "Group B",
    value: 300,
  },
  {
    name: "Group C",
    value: 300,
  },
  {
    name: "Group D",
    value: 200,
  },
  {
    name: "Group E",
    value: 278,
  },
  {
    name: "Group F",
    value: 189,
  },
];
const data02 = [
  {
    name: "Group A",
    value: 2400,
  },
  {
    name: "Group B",
    value: 4567,
  },
  {
    name: "Group C",
    value: 1398,
  },
  {
    name: "Group D",
    value: 9800,
  },
  {
    name: "Group E",
    value: 3908,
  },
  {
    name: "Group F",
    value: 4800,
  },
];

const Modal = ({ props }) => {
  const { data, sideModalOpen, setSideModalOpen } = props;
  useEffect(() => {
    console.log("Modal data: ", data);
  }, [data]);

  return (
    <div
      className={`fixed top-0 right-0 bottom-0 h-[98%] w-[100%] md:w-[40vw] bg-white shadow-lg transform rounded-lg md:rounded-r-none my-2 border-2 md:border-r-0 border-black ${
        sideModalOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out z-50`}
    >
      <div className="p-4 h-full w-full overflow-hidden flex flex-col justify-start items-center">
        <div className="w-full flex justify-start items-center">
          <button
            onClick={() => setSideModalOpen(false)}
            className="bg-[#c095e4] border-2 border-black text-xl "
          >
            <AiOutlineClose />
          </button>
        </div>
        {data ? (
          <div className="w-full h-full flex flex-col justify-start items-center gap-10">
            <span className="flex justify-center items-center p-2 bg-slate-600 rounded-full">
              <img
                src={getImageByExchange(data?.exchange)}
                alt={data?.exchange}
                className="rounded-full"
                width="80"
                height="80"
              />
            </span>
            <div className="text-left">
              <h2 className="text-2xl font-semibold mt-2 mb-4">
                Wallet Id: {data?.label}
              </h2>
              <p className="text-lg">Exchange: {data?.exchange}</p>
            </div>
            <div className="w-full h-full border-t-2 border-b-2 border-black p-4 flex flex-col justify-start items-center gap-5 overflow-y-auto">
              <div className="w-[80%] p-2 border-2 rounded border-t-2 border-black flex flex-col justify-start items-center gap-2">
                <div className="w-full text-left">Transactions Frequency: </div>
                <LineGraph props={{ graphData }} />
              </div>
              <div className="w-[80%] p-2 border-2 rounded border-t-2 border-black flex flex-col justify-start items-center gap-2">
                <div className="w-full text-left">Transactions Values: </div>
                <CircleGraph props={{ data01, data02 }} />
              </div>
            </div>
          </div>
        ) : (
          <LoadingDisplay />
        )}
      </div>
    </div>
  );
};

export default Modal;
