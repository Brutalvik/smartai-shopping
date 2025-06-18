"use client";

import React, {
  useRef,
  useEffect,
  useCallback,
  useMemo,
  CSSProperties,
} from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Filters, MapKey, Sale, Column } from "@/components/seller/types";
import SalesColumnSelector from "@/components/seller/SalesColumnSelector";
import { allColumns } from "@/components/seller/utils/utils";
import { SortableHeader } from "./SortableHeader";
import { Tooltip } from "@heroui/react";

interface SellerSalesTableProps {
  sales: Sale[];
  filters?: Filters;
  page?: number;
  rowsPerPage?: number;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  selectedColumns: string[];
  setSelectedColumns: (columns: string[]) => void;
  columnOrder: string[];
  setColumnOrder: (order: string[]) => void;
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
  columnOrder,
  setColumnOrder,
}: SellerSalesTableProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sensors = useSensors(useSensor(PointerSensor));
  const [columnWidths, setColumnWidths] = React.useState<{
    [key: number]: number;
  }>({});
  const [sortColumn, setSortColumn] = React.useState<number>(0);
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
    "asc"
  );
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

  const getColumnStyle = useCallback(
    (index: number): CSSProperties =>
      columnWidths[index]
        ? {
            width: `${columnWidths[index]}px`,
            minWidth: `${columnWidths[index]}px`,
            maxWidth: `${columnWidths[index]}px`,
          }
        : {},
    [columnWidths]
  );

  const getValue = useCallback((sale: Sale, key: string): any => {
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
  }, []);

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
    const key = columnOrder[sortColumn] ?? columnOrder[0] ?? "saleId";
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
  }, [filteredSales, sortColumn, sortDirection, columnOrder, getValue]);

  const toggleSort = useCallback(
    (index: number) => {
      if (sortColumn === index) {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortColumn(index);
        setSortDirection("asc");
      }
    },
    [sortColumn]
  );

  useEffect(() => {
    const updateWidths = () => {
      if (!containerRef.current || columnOrder.length === 0) return;
      const totalWidth = containerRef.current.offsetWidth;
      const baseWidth = Math.floor((totalWidth / columnOrder.length) * 0.25);
      const fixedColumnWidths: Record<string, number> = {
        quantity: 10,
        shippingCost: 20,
        status: 10,
        total: 10,
        paymentMethod: 10,
        shippingMethod: 10,
        orderDate: 10,
        amount: 10,
      };
      const newWidths: { [key: number]: number } = {};
      columnOrder.forEach((key, i) => {
        newWidths[i] = fixedColumnWidths[key] ?? baseWidth;
      });
      setColumnWidths(newWidths);
    };
    updateWidths();
    window.addEventListener("resize", updateWidths);
    return () => window.removeEventListener("resize", updateWidths);
  }, [columnOrder, rowsPerPage]);

  useEffect(() => {
    const mandatoryKeys = allColumns
      .filter((c) => c.mandatory)
      .map((c) => c.key);
    const optionalKeys = selectedColumns.filter(
      (key) => !mandatoryKeys.includes(key)
    );
    const newOrder = [
      ...columnOrder.filter(
        (key) => mandatoryKeys.includes(key) || optionalKeys.includes(key)
      ),
      ...optionalKeys.filter((key) => !columnOrder.includes(key)),
    ];
    if (JSON.stringify(newOrder) !== JSON.stringify(columnOrder)) {
      setColumnOrder(newOrder);
    }
  }, [selectedColumns, columnOrder, setColumnOrder]);

  const validColumnOrder = useMemo(
    () =>
      columnOrder.filter((key) => allColumns.some((col) => col.key === key)),
    [columnOrder]
  );

  return (
    <div className="w-full overflow-x-auto md:overflow-x-hidden">
      <div
        ref={containerRef}
        className="min-w-[768px] md:min-w-full relative border border-default-100 bg-white dark:bg-default-50 rounded-lg"
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={({ active, over }) => {
            if (!over || active.id === over.id) return;
            const oldIndex = columnOrder.indexOf(active.id as string);
            const newIndex = columnOrder.indexOf(over.id as string);
            setColumnOrder(arrayMove(columnOrder, oldIndex, newIndex));
          }}
        >
          <SortableContext
            items={validColumnOrder}
            strategy={verticalListSortingStrategy}
          >
            <table
              aria-label="Seller Sales Table"
              className="w-full table-fixed border-collapse"
            >
              <Tooltip content="Drag to rearrange">
                <thead className="sticky top-0 bg-grey-70 dark:bg-default-50 z-10">
                  <tr className="h-[56px]">
                    {validColumnOrder.map((key, index) => {
                      const col = allColumns.find((c) => c.key === key)!;
                      return (
                        <SortableHeader
                          key={col.key}
                          column={col}
                          index={index}
                          sortColumn={sortColumn}
                          sortDirection={sortDirection}
                          toggleSort={toggleSort}
                          getColumnStyle={getColumnStyle}
                          onMouseDown={handleMouseDown}
                        />
                      );
                    })}
                  </tr>
                </thead>
              </Tooltip>
              <tbody>
                {sortedSales.length === 0 ? (
                  <tr className="text-center">
                    <td
                      colSpan={validColumnOrder.length}
                      className="py-4 text-default-600"
                    >
                      No sales found.
                    </td>
                  </tr>
                ) : (
                  sortedSales.map((sale) => (
                    <tr
                      key={sale.saleId}
                      className="h-[44px] border-b border-default-100 last:border-b-0"
                    >
                      {validColumnOrder.map((key) => (
                        <td
                          key={key}
                          style={getColumnStyle(validColumnOrder.indexOf(key))}
                          className={
                            key === "quantity"
                              ? "px-1 py-0 text-xs text-left truncate"
                              : "p-2 text-sm whitespace-nowrap overflow-hidden text-ellipsis"
                          }
                        >
                          {getValue(sale, key)}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </SortableContext>
        </DndContext>
        <SalesColumnSelector
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedColumns={selectedColumns}
          setSelectedColumns={setSelectedColumns}
        />
      </div>
    </div>
  );
}
