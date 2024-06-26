import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { Input } from "@nextui-org/react";

import { IoCloseCircleOutline } from "react-icons/io5";
import { FiExternalLink } from "react-icons/fi";
import { IoMdSearch } from "react-icons/io";
import { SiTicktick } from "react-icons/si";
import { LuInfo } from "react-icons/lu";

import { chainList } from "../../utils/ChainList";
import { handleClick } from "../../utils/ValidateWallet";

const SearchModal = ({ isModalOpen, setIsModalOpen }) => {
  const [search, setSearch] = useState("");
  const [searchChain, setSearchChain] = useState(false);
  const [validWallet, setValidWallet] = useState(false);
  const [selectedChain, setSelectedChain] = useState(new Set());

  useEffect(() => {
    setSearchChain(false);
    setValidWallet(false);
  }, [search]);

  const selectedValue = useMemo(
    () => Array.from(selectedChain).join(", ").replaceAll("_", " "),
    [selectedChain]
  );

  const navigate = useNavigate();
  const handleSearch = () => {
    if (search.length === 0) return;
    navigate(`/elkjs/${search}`);
  };
  return (
    <div className="relative">
      {isModalOpen && (
        <div className="absolute top-10 left-[-10px] p-2 bg-white border-2 border-slate-400 shadow-lg rounded-xl">
          <div className="flex justify-center items-center gap-4">
            <button
              className="p-1 border-2 border-slate-400 bg-transparent rounded-md text-red-600"
              onClick={() => setIsModalOpen(false)}
              data-tooltip-id={"Close Button"}
              data-tooltip-content={"Close"}
            >
              <IoCloseCircleOutline />
            </button>
            <Input
              type="text"
              placeholder="Search"
              className="w-[450px] border-2 border-slate-400 rounded-xl text-base bg-transparent"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleClick(
                    validWallet,
                    setValidWallet,
                    setSearchChain,
                    search,
                    setSearch,
                    setSelectedChain,
                    handleSearch
                  );
                }
              }}
              startContent={
                validWallet ? (
                  <div className="h-full mb-1 flex items-end justify-center text-base text-secondary">
                    {
                      <div className="h-full flex flex-col items-center justify-center">
                      <img
                      className="border-1 border-slate-600 rounded-full"
                        src={
                          chainList.filter((ele) => ele.key == selectedValue)[0]
                            .image
                        }
                        width={25}
                      /></div>
                    }
                  </div>
                ) : null
              }
              endContent={
                validWallet ? (
                  <div className="flex items-end justify-center text-base text-green-600">
                    <SiTicktick />
                  </div>
                ) : null
              }
            />
            <button
              className={`p-2 bg-transparent border-2 border-slate-400 rounded-md ${
                validWallet ? "text-black" : "text-red-600"
              }`}
              onClick={() =>
                handleClick(
                  validWallet,
                  setValidWallet,
                  setSearchChain,
                  search,
                  setSearch,
                  setSelectedChain,
                  handleSearch
                )
              }
              data-tooltip-id={"Search/Validate Button"}
              data-tooltip-content={validWallet ? "Search" : "Validate"}
            >
              {validWallet ? <IoMdSearch /> : <LuInfo />}
            </button>
            <Link
              className={`p-2 bg-transparent border-2 border-slate-400 rounded-md ${
                validWallet
                  ? "text-black"
                  : "pointer-events-none text-slate-400"
              }`}
              to={`/elkjs/${search}`}
              target="_blank"
              data-tooltip-id={"Link Button"}
              data-tooltip-content={
                validWallet ? "Open in New Tab" : "Validate to Proceed"
              }
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
              id={"Search/Validate Button"}
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
