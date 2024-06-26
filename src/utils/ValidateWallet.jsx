const checkChain = (setValidWallet, setSearchChain, searchInput, setSearch, setSelectedChain) => {
  if (searchInput.length != 42) {
    toast.error("Invalid Wallet Address!");
    return;
  }
  setSearchChain(true);
  setValidWallet(false);
  if (searchInput.startsWith("0x")) {
    setSelectedChain(new Set(["ETH"]));
    setValidWallet(true);
    setSearch(searchInput);
    toast.success("Ethereum Wallet Detected!");
  } else if (searchInput.startsWith("b")) {
    setSelectedChain(new Set(["BTC"]));
    setValidWallet(true);
    setSearch(searchInput);
    toast.success("Bitcoin Wallet Detected!");
  } else {
    toast.error("No Valid Wallet Found!");
  }
  setSearchChain(false);
};

const handleClick = (validWallet, setValidWallet, setSearchChain, searchInput, setSearch, setSelectedChain, handleSearch) => {
  if (validWallet) {
    handleSearch();
  } else {
    checkChain(setValidWallet, setSearchChain, searchInput, setSearch, setSelectedChain);
  }
};

export { checkChain, handleClick };
