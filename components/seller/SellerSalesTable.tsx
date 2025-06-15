"use client";

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Tooltip,
  Badge,
} from "@heroui/react";
import { Loader2, ArrowUp, ArrowDown, ArrowUpDown, Info } from "lucide-react";

interface Sale {
  saleId: string;
  productTitle: string;
  buyerEmail: string;
  amount: number;
  quantity: number;
  status: "Delivered" | "Returned" | "Pending";
  orderDate: string;
  returnDeadline: string;
  isReturnable: boolean;
}

interface SellerSalesTableProps {
  sales: Sale[];
  loading: boolean;
}

const salesColumns = [
  "Product",
  "Buyer",
  "Amount",
  "Quantity",
  "Status",
  "Order Date",
  "Return Deadline",
  "Returnable",
];

export default function SellerSalesTable({
  sales,
  loading,
}: SellerSalesTableProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columnWidths, setColumnWidths] = useState<{ [key: number]: number }>(
    {}
  );
  const [sortColumn, setSortColumn] = useState<number>(5);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const isResizing = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);
  const currentColumnIndex = useRef<number | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent, index: number) => {
    isResizing.current = true;
    startX.current = e.clientX;
    const th = (e.target as HTMLElement).closest("th");
    if (th) {
      startWidth.current = th.offsetWidth;
      currentColumnIndex.current = index;
    }
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current || currentColumnIndex.current === null) return;
    const dx = e.clientX - startX.current;
    const newWidth = Math.max(60, startWidth.current + dx);
    setColumnWidths((prev) => ({
      ...prev,
      [currentColumnIndex.current!]: newWidth,
    }));
  }, []);

  const handleMouseUp = useCallback(() => {
    isResizing.current = false;
    currentColumnIndex.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  const getColumnStyle = (index: number) =>
    columnWidths[index] ? { width: `${columnWidths[index]}px` } : {};

  const getValue = (sale: Sale, key: string): any => {
    switch (key) {
      case "Product":
        return sale.productTitle;
      case "Buyer":
        return sale.buyerEmail;
      case "Amount":
        return sale.amount;
      case "Quantity":
        return sale.quantity;
      case "Status":
        return sale.status;
      case "Order Date":
        return new Date(sale.orderDate).getTime();
      case "Return Deadline":
        return new Date(sale.returnDeadline).getTime();
      case "Returnable":
        return sale.isReturnable ? 1 : 0;
      default:
        return "";
    }
  };

  const sortedSales = useMemo(() => {
    const key = salesColumns[sortColumn];
    return [...sales].sort((a, b) => {
      const valA = getValue(a, key);
      const valB = getValue(b, key);
      if (typeof valA === "number" && typeof valB === "number") {
        return sortDirection === "asc" ? valA - valB : valB - valA;
      } else if (typeof valA === "string" && typeof valB === "string") {
        return sortDirection === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        return 0;
      }
    });
  }, [sales, sortColumn, sortDirection]);

  const toggleSort = (index: number) => {
    if (sortColumn === index) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(index);
      setSortDirection("asc");
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const totalWidth = containerRef.current.offsetWidth;
    const avgWidth = Math.floor(totalWidth / salesColumns.length);
    const initialWidths: { [key: number]: number } = {};
    salesColumns.forEach((_, i) => (initialWidths[i] = avgWidth));
    setColumnWidths(initialWidths);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative border border-default-100 bg-white dark:bg-default-50 w-screen rounded-lg"
    >
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-lg">Loading sales...</span>
        </div>
      ) : (
        <Table
          aria-label="Seller Sales Table"
          removeWrapper
          className="min-w-full [&>thead]:sticky [&>thead]:top-0 [&>thead]:bg-white dark:[&>thead]:bg-default-50"
        >
          <TableHeader>
            {salesColumns.map((label, i) => (
              <TableColumn
                key={label}
                className="relative whitespace-nowrap text-sm font-semibold border-r select-none cursor-pointer"
                style={getColumnStyle(i)}
                onClick={() => toggleSort(i)}
              >
                <div className="flex items-center gap-1">
                  <span>{label}</span>
                  {sortColumn === i ? (
                    sortDirection === "asc" ? (
                      <ArrowUp size={14} />
                    ) : (
                      <ArrowDown size={14} />
                    )
                  ) : (
                    <ArrowUpDown size={14} className="text-default-400" />
                  )}
                </div>
                <div
                  className="absolute top-0 -right-1 h-full w-1.5"
                  style={{ cursor: "ew-resize" }}
                  onMouseDown={(e) => handleMouseDown(e, i)}
                />
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody emptyContent="No sales found.">
            {sortedSales.map((sale) => (
              <TableRow key={sale.saleId} className="text-sm h-[44px]">
                <TableCell>{sale.productTitle}</TableCell>
                <TableCell>{sale.buyerEmail}</TableCell>
                <TableCell>${sale.amount}</TableCell>
                <TableCell>{sale.quantity}</TableCell>
                <TableCell>
                  <Badge
                    color={
                      sale.status === "Delivered"
                        ? "success"
                        : sale.status === "Returned"
                          ? "danger"
                          : "warning"
                    }
                    variant="solid"
                  >
                    {sale.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {sale.orderDate
                    ? new Date(sale.orderDate).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>
                  {sale.returnDeadline
                    ? new Date(sale.returnDeadline).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>
                  {sale.isReturnable ? (
                    <span className="text-green-600">Yes</span>
                  ) : (
                    <span className="text-gray-400">No</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
