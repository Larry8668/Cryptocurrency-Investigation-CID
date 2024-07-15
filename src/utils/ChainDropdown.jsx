import React from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { FaChevronDown } from "react-icons/fa6";
import { chainList } from "../utils/ChainList";

const ChainDropdown = ({ selectedChain, setChain }) => {
  return (
    <Dropdown className="border-black">
      <DropdownTrigger>
        <Button variant="bordered" className="capitalize">
          {selectedChain}
          <FaChevronDown />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Single selection example"
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selectedChain}
        onSelectionChange={setChain}
        className="h-40 overflow-y-auto"
      >
        {chainList.map((chain) => (
          <DropdownItem
            key={chain.key}
            className="text-black"
            startContent={<img src={chain.image} className="w-6 h-6" alt={chain.name} />}
          >
            {chain.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default ChainDropdown;
