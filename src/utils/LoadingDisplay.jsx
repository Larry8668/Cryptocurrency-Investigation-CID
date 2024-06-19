import React from "react";
import { MoonLoader } from "react-spinners";

const LoadingDisplay = ({loadingText = "Trying to get your data..."}) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-2">
      <MoonLoader color="#000" size={40} />
      <p className=" text-slate-500">{loadingText}</p>
    </div>
  );
};

export default LoadingDisplay;
