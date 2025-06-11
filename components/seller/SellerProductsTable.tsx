"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
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
import Image from "next/image";
import { Product } from "@/types/product";
import { decodeProductIdForDisplay } from "@/utils/product-utils";
import { useRouter } from "next/navigation";

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
  sellerId,
}: SellerProductsTableProps) {
  const currentProductRegion = process.env.NEXT_PUBLIC_PRODUCTS_REGION;
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
    if (
      !isResizing.current ||
      currentColumnIndex.current === null ||
      !tableRef.current
    )
      return;

    const dx = e.clientX - startX.current;
    const newWidth = Math.max(50, startWidth.current + dx);

    setColumnWidths((prev) => ({
      ...prev,
      [currentColumnIndex.current!]: newWidth,
    }));

    const headerCells = Array.from(tableRef.current.querySelectorAll("th"));
    if (headerCells[currentColumnIndex.current]) {
      headerCells[currentColumnIndex.current].style.width = `${newWidth}px`;
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isResizing.current = false;
    currentColumnIndex.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  const getColumnWidth = (index: number) => {
    return columnWidths[index] ? { width: `${columnWidths[index]}px` } : {};
  };

  const handleEditRedirect = (product: Product) => {
    router.push(`/seller/upload?productId=${product.productId}`);
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow border border-default-100 bg-white dark:bg-default-50">
      {loading && products.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-lg">Loading products...</span>
        </div>
      ) : (
        <Table
          aria-label="Seller Products Table"
          isStriped
          removeWrapper
          className="min-w-[1200px]"
          ref={tableRef}
        >
          <TableHeader>
            <TableColumn className="w-12">
              <Checkbox
                isSelected={allProductsSelected}
                onValueChange={onSelectAllProducts}
                isDisabled={products.length === 0}
              />
            </TableColumn>
            <TableColumn className="w-24 relative" style={getColumnWidth(1)}>
              ID
              <div
                className="absolute top-0 right-0 w-2 h-full cursor-ew-resize hover:bg-blue-200"
                onMouseDown={(e) => handleMouseDown(e, 1)}
              />
            </TableColumn>
            <TableColumn className="relative" style={getColumnWidth(2)}>
              Product Name
              <div
                className="absolute top-0 right-0 w-2 h-full cursor-ew-resize hover:bg-blue-200"
                onMouseDown={(e) => handleMouseDown(e, 2)}
              />
            </TableColumn>
            <TableColumn className="relative" style={getColumnWidth(3)}>
              Description
              <div
                className="absolute top-0 right-0 w-2 h-full cursor-ew-resize hover:bg-blue-200"
                onMouseDown={(e) => handleMouseDown(e, 3)}
              />
            </TableColumn>
            <TableColumn className="w-20 relative" style={getColumnWidth(4)}>
              Price
              <div
                className="absolute top-0 right-0 w-2 h-full cursor-ew-resize hover:bg-blue-200"
                onMouseDown={(e) => handleMouseDown(e, 4)}
              />
            </TableColumn>
            <TableColumn className="w-20 relative" style={getColumnWidth(5)}>
              Quantity
              <div
                className="absolute top-0 right-0 w-2 h-full cursor-ew-resize hover:bg-blue-200"
                onMouseDown={(e) => handleMouseDown(e, 5)}
              />
            </TableColumn>
            <TableColumn className="w-24 relative" style={getColumnWidth(6)}>
              Category
              <div
                className="absolute top-0 right-0 w-2 h-full cursor-ew-resize hover:bg-blue-200"
                onMouseDown={(e) => handleMouseDown(e, 6)}
              />
            </TableColumn>
            <TableColumn className="relative" style={getColumnWidth(7)}>
              Tags
              <div
                className="absolute top-0 right-0 w-2 h-full cursor-ew-resize hover:bg-blue-200"
                onMouseDown={(e) => handleMouseDown(e, 7)}
              />
            </TableColumn>
            <TableColumn className="w-24 relative" style={getColumnWidth(8)}>
              Published
              <div
                className="absolute top-0 right-0 w-2 h-full cursor-ew-resize hover:bg-blue-200"
                onMouseDown={(e) => handleMouseDown(e, 8)}
              />
            </TableColumn>
            <TableColumn className="w-24 relative" style={getColumnWidth(9)}>
              Image
              <div
                className="absolute top-0 right-0 w-2 h-full cursor-ew-resize hover:bg-blue-200"
                onMouseDown={(e) => handleMouseDown(e, 9)}
              />
            </TableColumn>
            <TableColumn
              className="w-24 text-center relative"
              style={getColumnWidth(10)}
            >
              Actions
              <div
                className="absolute top-0 right-0 w-2 h-full cursor-ew-resize hover:bg-blue-200"
                onMouseDown={(e) => handleMouseDown(e, 10)}
              />
            </TableColumn>
          </TableHeader>
          <TableBody emptyContent="No products found.">
            {products.map((product) => {
              const isSelected = selectedProductIds.has(product.productId);
              const isEditDisabled = isSelected;
              const decodedId = decodeProductIdForDisplay(
                product.productId,
                sellerId,
                currentProductRegion
              );
              return (
                <TableRow
                  key={product.productId}
                  className={`cursor-pointer ${isSelected ? "bg-blue-50" : ""}`}
                >
                  <TableCell className="border-b border-r border-gray-200">
                    <Checkbox
                      isSelected={isSelected}
                      onValueChange={() =>
                        onToggleSelectProduct(product.productId)
                      }
                    />
                  </TableCell>
                  <TableCell
                    className="border-b border-r border-gray-200"
                    style={getColumnWidth(1)}
                  >
                    <Tooltip content={product.productId}>
                      <span className="font-mono text-xs cursor-help">
                        {decodedId.displayId}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell
                    className="border-b border-r border-gray-200"
                    style={getColumnWidth(2)}
                  >
                    {product.title}
                  </TableCell>
                  <TableCell
                    className="max-w-[200px] border-b border-r border-gray-200"
                    style={getColumnWidth(3)}
                  >
                    <Tooltip
                      content={
                        <div className="max-w-xs whitespace-normal">
                          {product.description}
                        </div>
                      }
                      delay={0}
                      closeDelay={0}
                    >
                      <span className="block w-full overflow-hidden text-ellipsis whitespace-nowrap cursor-help">
                        {product.description}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell
                    className="border-b border-r border-gray-200"
                    style={getColumnWidth(4)}
                  >
                    ${product.price}
                  </TableCell>
                  <TableCell
                    className="border-b border-r border-gray-200"
                    style={getColumnWidth(5)}
                  >
                    {product.quantity}
                  </TableCell>
                  <TableCell
                    className="border-b border-r border-gray-200"
                    style={getColumnWidth(6)}
                  >
                    {product.category}
                  </TableCell>
                  <TableCell
                    className="max-w-[150px] border-b border-r border-gray-200"
                    style={getColumnWidth(7)}
                  >
                    <Tooltip
                      content={
                        <div className="max-w-xs whitespace-normal">
                          {product.tags.join(", ")}
                        </div>
                      }
                      delay={0}
                      closeDelay={0}
                    >
                      <span className="block w-full overflow-hidden text-ellipsis whitespace-nowrap cursor-help">
                        {product.tags.join(", ")}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell
                    className="border-b border-r border-gray-200"
                    style={getColumnWidth(8)}
                  >
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
                  <TableCell
                    className="border-b border-r border-gray-200"
                    style={getColumnWidth(9)}
                  >
                    {product.images && product.images.length > 0 ? (
                      <Tooltip
                        content={
                          <div className="p-2 bg-white rounded-md shadow-lg">
                            <Image
                              src={product.images[0]}
                              alt={product.title}
                              width={200}
                              height={200}
                              objectFit="contain"
                            />
                          </div>
                        }
                        delay={0}
                        closeDelay={0}
                      >
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          width={48}
                          height={48}
                          className="object-cover rounded cursor-pointer"
                        />
                      </Tooltip>
                    ) : (
                      <div className="h-12 w-12 flex items-center justify-center bg-gray-100 rounded text-gray-400 text-xs">
                        No Img
                      </div>
                    )}
                  </TableCell>
                  <TableCell
                    className="border-b border-gray-200 text-center"
                    style={getColumnWidth(10)}
                  >
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        isIconOnly
                        color="default"
                        onPress={() => handleEditRedirect(product)}
                        isDisabled={isEditDisabled}
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
