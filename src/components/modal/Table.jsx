import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { useEffect, useState, useMemo, useCallback, useContext } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Button,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import SummaryModal from "./SummaryModal";

const sliceAddress = (address) => {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

const columns = [
  { name: "Hash", uid: "block_hash", sortable: false },
  { name: "From", uid: "from_address", sortable: false },
  { name: "To", uid: "to_address", sortable: false },
  { name: "Value", uid: "value", sortable: true },
  { name: "Time", uid: "block_timestamp", sortable: false },
];

const INITIAL_VISIBLE_COLUMNS = [
  "block_hash",
  "from_address",
  "to_address",
  "value",
  "block_timestamp",
];

const TransactionTable = ({ WalletAddress, chain, setCsvData }) => {
  const [filterValue, setFilterValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [tableKey, setTableKey] = useState(0);

  let list = useAsyncList({
    async load({ cursor, signal }) {
      try {
        
      
      if (cursor) {
        setPage((prev) => prev + 1);
      }
      let response = await fetch(
        `https://onchainanalysis.vercel.app/api/${chain.toLowerCase()}/address/${WalletAddress}`,
        // `http://localhost:8000/api/${chain.toLowerCase()}/address/${WalletAddress}`,
        { signal }
      );
      let json = await response.json();
      if (!cursor) {
        setIsLoading(false);
        setCsvData(json.results.transactions);
      }

      return {
        items: json.results.transactions,
        cursor: json.next,
      };
    } catch (error) {
        console.error("Error fetching data: ", error);
        setIsLoading(false);
    return { items: [], cursor: null };
    }
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          let first = a[sortDescriptor.column];
          let second = b[sortDescriptor.column];
          if (sortDescriptor.column === "value") {
            first = parseFloat(first) || 0;
            second = parseFloat(second) || 0;
          }
          let cmp = first < second ? -1 : 1;
          if (sortDescriptor.direction === "descending") cmp *= -1;
          return cmp;
        }),
      };
    },
  });

  useEffect(() => {
    setIsLoading(true);
    list.reload();
    setFilterValue("");
    setPage(1);
    setTableKey((prev) => prev + 1);
  }, [WalletAddress]);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filtered = [...list.items];

    if (hasSearchFilter) {
      filtered = filtered.filter(
        (item) =>
          item.block_hash.toLowerCase().includes(filterValue.toLowerCase()) ||
          item.from_address.toLowerCase().includes(filterValue.toLowerCase()) ||
          item.to_address.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filtered;
  }, [list.items, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const renderCell = useCallback((item, columnKey) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "value":
        return `${((cellValue)).toFixed(4)} ${chain}`;
      case "block_timestamp":
        return new Date(cellValue).toLocaleString();
      default:
        return sliceAddress(cellValue);
    }
  }, []);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by hash or address..."
            startContent={<div>🔍</div>}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<div>⬇️</div>} variant="flat">
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
                className="text-black"
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {filteredItems.length} transactions
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="30">30</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    onRowsPerPageChange,
    filteredItems.length,
    onSearchChange,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [page, pages, onPreviousPage, onNextPage]);

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      key={tableKey}
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[520px]",
        table: "min-h-[420px]",
        text: "text-sm",
      }}
      isStriped
      removeWrapper
      sortDescriptor={list.sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSortChange={list.sort}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={items}
        loadingContent={<Spinner label="Loading..." />}
        loadingState={isLoading ? "loading" : "idle"}
      >
       {(item) => (
          <TableRow key={item.block_hash}>
            {(columnKey) => (
              <TableCell key={`${item.block_hash}-${columnKey}`}>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TransactionTable;
