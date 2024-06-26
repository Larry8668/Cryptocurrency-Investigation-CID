import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FiExternalLink } from "react-icons/fi";
import { IoMdSearch } from "react-icons/io";
import { Tooltip as ReactTooltip } from "react-tooltip";

const SearchModal = ({ isModalOpen, setIsModalOpen }) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const handleSearch = () => {
    if (search.length === 0) return;
    navigate(`/elkjs/${search}`);
  };
  return (
    <div className="relative">
      {isModalOpen && (
        <div className="absolute top-10 left-5 p-2 bg-white border-2 border-slate-400 shadow-lg rounded-xl">
          <div className="flex justify-center items-center gap-4">
            <button
              className="p-1 border-2 border-slate-400 bg-transparent rounded-md text-red-600"
              onClick={() => setIsModalOpen(false)}
              data-tooltip-id={"Close Button"}
              data-tooltip-content={"Close"}
            >
              <IoCloseCircleOutline />
            </button>
            <input
              type="text"
              placeholder="Search"
              className="p-2 px-4 w-65 border-2 border-slate-400 rounded-full text-base bg-transparent"
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="p-2 bg-transparent border-2 border-slate-400 rounded-md"
              onClick={() => handleSearch()}
              data-tooltip-id={"Search Button"}
              data-tooltip-content={"Search"}
            >
              <IoMdSearch />
            </button>
            <Link
              className="p-2 bg-transparent text-black border-2 border-slate-400 rounded-md"
              to={`/elkjs/${search}`}
              target="_blank"
              data-tooltip-id={"Link Button"}
              data-tooltip-content={"Open in New Tab"}
            >
              <FiExternalLink />
            </Link>
            <ReactTooltip
              id={"Close Button"}
              place="bottom"
              effect="solid"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.85)",
                color: "#fff",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "12px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
              }}
            />
            <ReactTooltip
              id={"Search Button"}
              place="bottom"
              effect="solid"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.85)",
                color: "#fff",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "12px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
              }}
            />
            <ReactTooltip
              id={"Link Button"}
              place="bottom"
              effect="solid"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.85)",
                color: "#fff",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "12px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default SearchModal;
