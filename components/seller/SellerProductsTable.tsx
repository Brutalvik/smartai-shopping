"use client";

import React, { useState, useRef, useCallback } from "react";
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
import { Trash2, Pencil, Loader2 } from "lucide-react";
import { Product } from "@/types/product";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [columnWidths, setColumnWidths] = useState<{ [key: number]: number }>(
    {}
  );
  const tableRef = useRef<HTMLTableElement>(null);
  const isResizing = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);
  const currentColumnIndex = useRef<number | null>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, index: number) => {
      isResizing.current = true;
      startX.current = e.clientX;
      const th = (e.target as HTMLElement).closest("th");
      if (th) {
        startWidth.current = th.offsetWidth;
        currentColumnIndex.current = index;
      }
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    []
  );

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current || currentColumnIndex.current === null) return;
    const dx = e.clientX - startX.current;
    const newWidth = Math.max(50, startWidth.current + dx);
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

  const getColumnWidth = (index: number) =>
    columnWidths[index] ? { width: `${columnWidths[index]}px` } : {};

  return (
    <div className="overflow-x-auto rounded-lg border border-default-100 bg-white dark:bg-default-50 max-w-full">
      {loading && products.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-lg">Loading products...</span>
        </div>
      ) : (
        <Table
          aria-label="Seller Products Table"
          removeWrapper
          ref={tableRef}
          className="min-w-[1100px] [&>thead]:sticky [&>thead]:top-0 [&>thead]:bg-white dark:[&>thead]:bg-default-50"
        >
          <TableHeader>
            <TableColumn className="w-12 min-w-[48px]">
              <Checkbox
                isSelected={allProductsSelected}
                onValueChange={onSelectAllProducts}
              />
            </TableColumn>
            <>
              {tableColumn.map((label, i) => (
                <TableColumn
                  key={label}
                  className="relative whitespace-nowrap text-sm font-semibold"
                  style={getColumnWidth(i)}
                >
                  {label}
                  <div
                    className="absolute top-0 right-0 h-full w-2 resize-column-cursor"
                    onMouseDown={(e) => handleMouseDown(e, i)}
                  />
                </TableColumn>
              ))}
            </>
          </TableHeader>

          <TableBody emptyContent="No products found.">
            {products.map((product) => {
              const isSelected = selectedProductIds.has(product.productId);
              return (
                <TableRow key={product.productId} className="text-sm h-[48px]">
                  <TableCell>
                    <Checkbox
                      isSelected={isSelected}
                      onValueChange={() =>
                        onToggleSelectProduct(product.productId)
                      }
                    />
                  </TableCell>
                  <TableCell>{product.title}</TableCell>
                  <TableCell>
                    <Tooltip content={product.description}>
                      <span className="block truncate max-w-[200px] cursor-help">
                        {product.description}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <Tooltip content={product.tags.join(", ")}>
                      <span className="block truncate max-w-[150px] cursor-help">
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
                  <TableCell className="text-center">
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
