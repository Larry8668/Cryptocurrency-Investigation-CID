import React, { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { toast } from "sonner";

export function useAsyncSearch({ fetchDelay = 0, initialQuery = "" }) {
  const {
    handleChainChange,
    selectedChain,
    chain,
    setChain,
    detectedChain,
    setDetectedChain,
  } = useContext(GlobalContext);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState(initialQuery);

  const loadItems = async (query) => {
    if (query.length < 34 || query.length > 64) return;
    setIsLoading(true);

    try {
      if (fetchDelay > 0) {
        await new Promise((resolve) => setTimeout(resolve, fetchDelay));
      }

      // let newItems = [];
      // if (query.length === 34) {
      //   newItems = [{ icon: "bitcoin", address: query, key: "BTC" }];
      // } else if (query.length === 42) {
      //   if (query.startsWith("0x")) {
      //     newItems = [{ icon: "ethereum", address: query, key: "ETH" }];
      //   } else if (query.startsWith("b")) {
      //     newItems = [{ icon: "bitcoin", address: query, key: "BTC" }];
      //   } else {
      //     throw new Error("Invalid Wallet Address!");
      //   }
      // } else if (query.length == 62) {
      //   newItems = [{ icon: "bitcoin", address: query, key: "BTC" }];
      // } else {
      //   throw new Error("Invalid Wallet Address!");
      // }
      // if (newItems.length)
      //   setDetectedChain([{ address: query, key: newItems[0].key }]);
      // setItems(newItems);

      const newItems = [{ address: query }];

      setDetectedChain(newItems);
      setItems(newItems);

    } catch (error) {
      toast.error("There was an error with the fetch operation");
      console.error(error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadItems(query);
  }, [query]);

  const resetSearch = (newQuery) => {
    setQuery(newQuery);
    setItems([]);
    setDetectedChain([]);
    handleChainChange([]);
  };

  return {
    items,
    isLoading,
    resetSearch,
  };
}
