"use client";

import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  Checkbox,
  Tooltip,
} from "@heroui/react";
import {
  Trash2,
  Pencil,
  Loader2,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";
import { Product } from "@/types/product";
import { initialColumnWidths } from "@/utils/product-utils";

const tableColumn = [
  "Product Name",
  "Description",
  "Price",
  "Quantity",
  "Category",
  "Tags",
  "Published",
  "Created At",
  "Actions",
];

interface SellerProductsTableProps {
  products: Product[];
  selectedProductIds: Set<string>;
  onToggleSelectProduct: (productId: string) => void;
  onSelectAllProducts: (isSelected: boolean) => void;
  allProductsSelected: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  loading: boolean;
  sellerId: string;
}

export default function SellerProductsTable({
  products,
  selectedProductIds,
  onToggleSelectProduct,
  onSelectAllProducts,
  allProductsSelected,
  onEdit,
  onDelete,
  loading,
}: SellerProductsTableProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columnWidths, setColumnWidths] = useState<{ [key: number]: number }>(
    initialColumnWidths
  );

  const [sortColumn, setSortColumn] = useState<number>(7); // default to Created At
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

  const getValue = (product: Product, key: string): any => {
    switch (key) {
      case "Product Name":
        return product.title;
      case "Description":
        return product.description;
      case "Price":
        return product.price;
      case "Quantity":
        return product.quantity;
      case "Category":
        return product.category;
      case "Tags":
        return product.tags.join(", ");
      case "Published":
        return product.isActive ? "Published" : "Draft";
      case "Created At":
        return new Date(product.createdAt).getTime();
      default:
        return "";
    }
  };

  const sortedProducts = useMemo(() => {
    const key = tableColumn[sortColumn];

    return [...products].sort((a, b) => {
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
  }, [products, sortColumn, sortDirection]);

  const toggleSort = (index: number) => {
    if (index === 8) return;
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
    const staticColumns = 1 + 1; // checkbox + actions column (fixed)
    const dynamicColumns = tableColumn.length - staticColumns;

    // Subtract fixed widths: checkbox (~48) + actions (~120)
    const remainingWidth = totalWidth - 48 - 120;
    const avgWidth = Math.floor(remainingWidth / dynamicColumns);

    const initialWidths: { [key: number]: number } = {};

    tableColumn.forEach((_, index) => {
      if (index === 0) {
        initialWidths[index] = avgWidth + 20;
      } else if (index === 8) {
        initialWidths[index] = 120;
      } else {
        initialWidths[index] = avgWidth;
      }
    });

    setColumnWidths(initialWidths);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative overflow-x-auto border border-default-100 bg-white dark:bg-default-50 max-w-full rounded-lg"
    >
      {loading && products.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-lg">Loading products...</span>
        </div>
      ) : (
        <Table
          aria-label="Seller Products Table"
          removeWrapper
          className="min-w-full [&>thead]:sticky [&>thead]:top-0 [&>thead]:bg-white dark:[&>thead]:bg-default-50"
        >
          <TableHeader>
            <>
              <TableColumn className="w-12 min-w-[48px]">
                <Checkbox
                  isSelected={allProductsSelected}
                  onValueChange={onSelectAllProducts}
                />
              </TableColumn>
              {tableColumn.map((label, i) => (
                <TableColumn
                  key={label}
                  className="relative whitespace-nowrap text-sm font-semibold border-r select-none cursor-pointer"
                  style={getColumnStyle(i)}
                  onClick={() => toggleSort(i)}
                >
                  <div className="flex items-center gap-1">
                    <span>{label}</span>
                    {i !== 8 &&
                      (sortColumn === i ? (
                        sortDirection === "asc" ? (
                          <ArrowUp size={14} />
                        ) : (
                          <ArrowDown size={14} />
                        )
                      ) : (
                        <ArrowUpDown size={14} className="text-default-400" />
                      ))}
                  </div>
                  {i !== 8 && (
                    <div
                      className="absolute top-0 -right-1 h-full w-1.5"
                      style={{ cursor: "ew-resize" }}
                      onMouseDown={(e) => handleMouseDown(e, i)}
                    />
                  )}
                </TableColumn>
              ))}
            </>
          </TableHeader>

          <TableBody emptyContent="No products found.">
            {sortedProducts.map((product) => {
              const isSelected = selectedProductIds.has(product.productId);
              return (
                <TableRow
                  key={product.productId}
                  className="text-sm h-[44px] hover:cursor-pointer"
                >
                  <TableCell>
                    <Checkbox
                      isSelected={isSelected}
                      onValueChange={() =>
                        onToggleSelectProduct(product.productId)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip content={product.title}>
                      <span
                        className="block truncate cursor-help"
                        style={{ maxWidth: columnWidths[0] - 16 }}
                      >
                        {product.title}
                      </span>
                    </Tooltip>
                  </TableCell>

                  <TableCell>
                    <Tooltip content={product.description}>
                      <span
                        className="block truncate cursor-help"
                        style={{ maxWidth: columnWidths[1] - 16 }}
                      >
                        {product.description}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <Tooltip content={product.tags.join(", ")}>
                      <span
                        className="block truncate cursor-help"
                        style={{ maxWidth: columnWidths[5] - 16 }}
                      >
                        {product.tags.join(", ")}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        product.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {product.isActive ? "Published" : "Draft"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(product.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        isIconOnly
                        color="default"
                        onPress={() => onEdit(product)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        size="sm"
                        isIconOnly
                        color="danger"
                        variant="solid"
                        onPress={() => onDelete(product)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
