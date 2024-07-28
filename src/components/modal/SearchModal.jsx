import React, { useEffect, useState, useMemo, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FiExternalLink } from "react-icons/fi";
import { IoMdSearch } from "react-icons/io";
import { LuInfo } from "react-icons/lu";
import AutocompleteBar from "../../utils/AutocompleteBar";
import { handleClick } from "../../utils/ValidateWallet";
import ChainDropdown from "../../utils/ChainDropdown";
import { GlobalContext } from "../../context/GlobalContext";

const SearchModal = ({ isModalOpen, setIsModalOpen }) => {
  const { selectedChain,  setChain, chain, detectedChain} =
    useContext(GlobalContext);

  const [search, setSearch] = useState("");
  const [searchChain, setSearchChain] = useState(false);
  const [validWallet, setValidWallet] = useState(false);

  useEffect(() => {
    // if (detectedChain.length && selectedChain == detectedChain[0].key) {
    if (detectedChain.length) {
      setValidWallet(true);
      setSearchChain(false);
      setSearch(detectedChain[0].address);
      return;
    }
    setSearchChain(false);
    setValidWallet(false);
  }, [chain]);

  useEffect(() => {
    setSearchChain(false);
    setValidWallet(false);
  }, [search]);


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
            <ChainDropdown selectedChain={selectedChain} setChain={setChain} />
            <AutocompleteBar
              searchInput={search}
              setSearchInput={setSearch}
              setValidWallet={setValidWallet}
              setSearchChain={setSearchChain}
              size="md"
              customStyles="bg-transparent hover:bg-slate-200/60 rounded-xl text-black "
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
                  setChain,
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
