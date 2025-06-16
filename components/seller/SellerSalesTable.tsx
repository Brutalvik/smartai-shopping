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
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { Filters, MapKey, Sale } from "@/components/seller/types";
import SalesColumnSelector from "@/components/seller/SalesColumnSelector";
import { allColumns } from "@/components/seller/utils";

interface SellerSalesTableProps {
  sales: Sale[];
  filters?: Filters;
  page?: number;
  rowsPerPage?: number;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  selectedColumns: string[];
  setSelectedColumns: (columns: string[]) => void;
}

export default function SellerSalesTable({
  sales,
  filters,
  page = 1,
  rowsPerPage = 10,
  isModalOpen,
  setIsModalOpen,
  selectedColumns,
  setSelectedColumns,
}: SellerSalesTableProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columnWidths, setColumnWidths] = useState<{ [key: number]: number }>(
    {}
  );
  const [sortColumn, setSortColumn] = useState<number>(0);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

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

  const visibleColumns = allColumns.filter((c) =>
    selectedColumns.includes(c.key)
  );

  const getValue = (sale: Sale, key: string): any => {
    const map: Record<MapKey, any> = {
      saleId: sale.saleId,
      productTitle: sale.productTitle,
      quantity: sale.quantity,
      amount: `$${sale.amount?.toFixed(2)}`,
      purchaseDate: new Date(sale.purchaseDate).toLocaleDateString(),
      status: sale.status,
      orderDate: new Date(sale.orderDate).toLocaleDateString(),
      shippingMethod: sale.shippingMethod,
      paymentMethod: sale.paymentMethod,
      total: `$${sale.total?.toFixed(2)}`,
      buyerEmail: sale.buyerEmail,
      returnDeadline: sale.returnDeadline
        ? new Date(sale.returnDeadline).toLocaleDateString()
        : "-",
      isReturnable: sale.isReturnable ? "Yes" : "No",
      shippingCost: `$${sale.shippingCost?.toFixed(2)}`,
      discount: `$${sale.discount?.toFixed(2)}`,
      tax: `$${sale.tax?.toFixed(2)}`,
    };
    return map[key as MapKey] ?? "";
  };

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      if (
        filters?.status &&
        sale.status.toLowerCase() !== filters.status.toLowerCase()
      )
        return false;
      if (
        filters?.isReturnable !== undefined &&
        sale.isReturnable !== filters.isReturnable
      )
        return false;
      if (filters?.minAmount !== undefined && sale.amount < filters.minAmount)
        return false;
      if (filters?.maxAmount !== undefined && sale.amount > filters.maxAmount)
        return false;
      if (
        filters?.startDate &&
        new Date(sale.orderDate) < new Date(filters.startDate)
      )
        return false;
      if (
        filters?.endDate &&
        new Date(sale.orderDate) > new Date(filters.endDate)
      )
        return false;
      return true;
    });
  }, [sales, filters]);

  const sortedSales = useMemo(() => {
    const key = visibleColumns[sortColumn]?.key;
    return [...filteredSales].sort((a, b) => {
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
  }, [filteredSales, sortColumn, sortDirection, visibleColumns]);

  const paginatedSales = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedSales.slice(start, end);
  }, [sortedSales, page, rowsPerPage]);

  const toggleSort = (index: number) => {
    if (sortColumn === index) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(index);
      setSortDirection("asc");
    }
  };

  useEffect(() => {
    if (!containerRef.current || visibleColumns.length === 0) return;
    const totalWidth = containerRef.current.offsetWidth;
    const avgWidth = Math.floor(totalWidth / visibleColumns.length);
    if (Object.keys(columnWidths).length === visibleColumns.length) return;
    const initialWidths: { [key: number]: number } = {};
    visibleColumns.forEach((_, i) => {
      initialWidths[i] = avgWidth;
    });
    setColumnWidths(initialWidths);
  }, [visibleColumns, Object.keys(columnWidths).length]);

  return (
    <div
      ref={containerRef}
      className="relative border border-default-100 bg-white dark:bg-default-50 w-screen rounded-lg"
    >
      <Table
        aria-label="Seller Sales Table"
        removeWrapper
        className="min-w-full [&>thead]:sticky [&>thead]:top-0 [&>thead]:bg-white dark:[&>thead]:bg-default-50"
      >
        <TableHeader>
          {visibleColumns.map(({ label }, i) => (
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
          {paginatedSales.map((sale) => (
            <TableRow key={sale.saleId} className="text-sm h-[44px]">
              {visibleColumns.map(({ key }) => (
                <TableCell key={key}>{getValue(sale, key)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Column Selector Modal (controlled externally) */}
      <SalesColumnSelector
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedColumns={selectedColumns}
        setSelectedColumns={setSelectedColumns}
      />
    </div>
  );
}
