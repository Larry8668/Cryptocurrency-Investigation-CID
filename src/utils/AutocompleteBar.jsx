import React, { useEffect, useState, useContext } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useAsyncSearch } from "./useAsyncSeach";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import getImageByExchange from "./ImageIconMap";
import { GlobalContext } from "../context/GlobalContext";
import { toast } from "sonner";

const AutocompleteBar = ({
  searchInput,
  setSearchInput,
  setValidWallet,
  setSearchChain,
  customStyles = "",
  size = "lg",
}) => {
  const { handleChainChange, selectedChain, chain, setChain } = useContext(GlobalContext);
  const { items, isLoading, resetSearch } = useAsyncSearch({
    fetchDelay: 1500,
    initialQuery: searchInput,
  });

  const [, scrollerRef] = useInfiniteScroll({
    isEnabled: true,
    shouldUseLoader: false,
  });

  useEffect(() => {
    setSearchChain(true);
  }, [isLoading]);

  useEffect(() => {
    // if (items.length === 1 && items[0].address === selectedChain) {
    if (items.length === 1) {
      setValidWallet(true);
      setSearchChain(false);
    } else {
      toast.error("Select correct Chain!");
      setValidWallet(false);
    }
  }, [items]);

  return (
    <Autocomplete
      allowsCustomValue
      size={size}
      label="Enter Wallet Address"
      variant="bordered"
      disabledKeys={["loading"]}
      className={`w-[500px] rounded-xl bg-[#f2eafa] hover:bg-[#e9dcf6] text-[#9251d2] ${customStyles}`}
      onInput={(e) => {
        setSearchInput(e.target.value);
        resetSearch(e.target.value);
      }}
      scrollRef={scrollerRef}
    >
      {isLoading && items.length === 0 ? (
        <AutocompleteItem
          className="text-black dark:text-white"
          key={"loading"}
        >
          Loading...
        </AutocompleteItem>
      ) : (
        items.map((item) => (
          <AutocompleteItem
            key={item.address}
            className="text-black dark:text-white"
            // startContent={
            //   <img src={getImageByExchange(item.icon)} width={25} />
            // }
          >
            {item.address}
          </AutocompleteItem>
        ))
      )}
    </Autocomplete>
  );
};

export default AutocompleteBar;
