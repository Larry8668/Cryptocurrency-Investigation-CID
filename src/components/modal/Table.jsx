import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  getKeyValue,
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import copyClipboard from "../../utils/copyClipboard";

const sliceAddress = (address) => {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

const columns = [
  { name: "Hash", uid: "hash", allowsSorting: false },
  { name: "From", uid: "from_address", allowsSorting: false },
  { name: "To", uid: "to_address", allowsSorting: false },
  { name: "Value (ETH)", uid: "value", allowsSorting: true },
  { name: "Time", uid: "block_timestamp", allowsSorting: false },
];

const TransactionTable = ({ addresswallet }) => {
  let list = useAsyncList({
    async load({ signal }) {
      let response = await fetch(
        `https://onchainanalysis.vercel.app/api/eth/0x1/${addresswallet}`,
        { signal }
      );
      let json = await response.json();
      return {
        items: json.result,
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          let first = parseFloat(a[sortDescriptor.column]) || 0;
          let second = parseFloat(b[sortDescriptor.column]) || 0;
          let cmp = first < second ? -1 : 1;
          if (sortDescriptor.direction === "descending") cmp *= -1;
          return cmp;
        }),
      };
    },
  });

  return (
    <Table
      isHeaderSticky
      aria-label="Example table with transaction details"
      removeWrapper
      isStriped
      sortDescriptor={list.sortDescriptor}
      onSortChange={list.sort}
      selectedKeys={list.selectedKeys}
      onSelectionChange={list.setSelectedKeys}
      className="text-sm"
    >
      <TableHeader>
        {columns.map((column) => (
          <TableColumn key={column.uid} allowsSorting={column.allowsSorting}>
            {column.name}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody items={list.items} loadingState={list.loadingState}>
        {(item) => (
          <TableRow key={item.hash}>
            {(columnKey) => (
              <TableCell>
                {columnKey === "value"
                  ? `${(
                      parseFloat(getKeyValue(item, columnKey)) / 1e18
                    ).toFixed(4)} ETH`
                  : columnKey === "block_timestamp"
                  ? new Date(getKeyValue(item, columnKey)).toLocaleString()
                  : sliceAddress(getKeyValue(item, columnKey))}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TransactionTable;
