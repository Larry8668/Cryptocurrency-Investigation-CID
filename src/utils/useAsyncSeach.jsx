import React, { useState, useEffect } from "react";
import { toast } from "sonner";

export function useAsyncSearch({ fetchDelay = 0, initialQuery = "" }) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState(initialQuery);

  const loadItems = async (query) => {
    if (query.length < 34 || query.length > 42) return; 
    setIsLoading(true);

    try {
      // Simulate network delay
      if (fetchDelay > 0) {
        await new Promise((resolve) => setTimeout(resolve, fetchDelay));
      }

      let newItems = [];
      if (query.length === 34) {
        newItems = [{ icon: "bitcoin", address: query }];
      } else if (query.length === 42) {
        if (query.startsWith("0x")) {
          newItems = [{ icon: "ethereum", address: query }];
        } else if (query.startsWith("b")) {
          newItems = [{ icon: "bitcoin", address: query }];
        } else {
          throw new Error("Invalid Wallet Address!");
        }
      } else {
        throw new Error("Invalid Wallet Address!");
      }

      setItems(newItems);

      //   // Replace the URL with your actual API endpoint
      //   let res = await fetch(
      //     `https://pokeapi.co/api/v2/pokemon?offset=${currentOffset}&limit=${limit}&search=${query}`
      //   );

      //   if (!res.ok) {
      //     throw new Error("Network response was not ok");
      //   }

      //   let json = await res.json();

      //   setHasMore(json.next !== null);
      //   setItems((prevItems) => [...prevItems, ...json.results]);
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
    };
  
    return {
      items,
      isLoading,
      resetSearch,
    };
  } 
