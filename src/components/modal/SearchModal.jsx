import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FiExternalLink } from "react-icons/fi";
import { IoMdSearch } from "react-icons/io";

const SearchModal = ({ isModalOpen, setIsModalOpen }) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const handleSearch = () => {
    if (search.length === 0) return;
    console.log("routing?")
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
            >
              <IoMdSearch />
            </button>
            <Link className="p-2 bg-transparent text-black border-2 border-slate-400 rounded-md" to={`/elkjs/${search}`} target="_blank">
              <FiExternalLink />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
export default SearchModal;
