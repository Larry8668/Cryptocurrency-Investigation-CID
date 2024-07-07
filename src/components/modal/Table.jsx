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
  Button,
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
  const [page, setPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);
  let list = useAsyncList({
    async load({cursor, signal }) {
      if (cursor) {
        setPage((prev) => prev + 1);
      }
      let response = await fetch(
        `https://onchainanalysis.vercel.app/api/eth/0x1/${addresswallet}`,
        { signal }
      );
      let json = await response.json();
      if (!cursor) {
        setIsLoading(false);
      }
      return {
        items: json.result,
        cursor: json.next,
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
  const hasMore = page < 9;

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
      bottomContent={
        hasMore && !isLoading ? (
          <div className="flex w-full justify-center">
            <Button isDisabled={list.isLoading} variant="flat" onPress={list.loadMore}>
              {list.isLoading && <Spinner color="white" size="sm" />}
              Load More
            </Button>
          </div>
        ) : null
      }
      classNames={{
        base: "max-h-[520px] overflow-scroll",
        table: "min-h-[420px]",
        text:"text-sm"
      }}
    >
      <TableHeader>
        {columns.map((column) => (
          <TableColumn key={column.uid} allowsSorting={column.allowsSorting}>
            {column.name}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody items={list.items} loadingState={list.loadingState} isLoading={isLoading} loadingContent={<Spinner label="Loading..."/>} >
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
