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
import { Trash2, Pencil } from "lucide-react";
import { Product } from "@/types/product";
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
}: SellerProductsTableProps) {
  const router = useRouter();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow border border-default-100 bg-white dark:bg-default-50">
      <Table
        aria-label="Seller Products Table"
        removeWrapper
        className="min-w-[1100px]"
      >
        <TableHeader>
          <TableColumn className="w-12">
            <Checkbox
              isSelected={allProductsSelected}
              onValueChange={onSelectAllProducts}
              isDisabled={products.length === 0}
            />
          </TableColumn>
          <TableColumn className="w-28">Product ID</TableColumn>
          <TableColumn className="w-56">Name</TableColumn>
          <TableColumn className="w-72">Description</TableColumn>
          <TableColumn className="w-20">Price</TableColumn>
          <TableColumn className="w-20">Qty</TableColumn>
          <TableColumn className="w-28">Category</TableColumn>
          <TableColumn className="w-28">Tags</TableColumn>
          <TableColumn className="w-24">Status</TableColumn>
          <TableColumn className="w-44">Created</TableColumn>
          <TableColumn className="w-24 text-center">Actions</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No products found.">
          {products.map((product) => {
            const isSelected = selectedProductIds.has(product.productId);
            return (
              <TableRow
                key={product.productId}
                className={`text-sm ${isSelected ? "bg-blue-50" : ""}`}
              >
                <TableCell className="py-2">
                  <Checkbox
                    isSelected={isSelected}
                    onValueChange={() =>
                      onToggleSelectProduct(product.productId)
                    }
                  />
                </TableCell>
                <TableCell className="py-2 font-mono text-xs truncate max-w-[100px]">
                  {product.productId.slice(0, 6)}...
                </TableCell>
                <TableCell className="py-2 truncate">{product.title}</TableCell>
                <TableCell className="py-2 max-w-[220px] truncate whitespace-nowrap overflow-hidden text-ellipsis">
                  <Tooltip
                    content={
                      <div className="max-w-xs">{product.description}</div>
                    }
                    delay={0}
                    closeDelay={0}
                  >
                    <span className="cursor-help block w-full">
                      {product.description}
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell className="py-2">${product.price}</TableCell>
                <TableCell className="py-2">{product.quantity}</TableCell>
                <TableCell className="py-2 truncate">
                  {product.category}
                </TableCell>
                <TableCell className="py-2 truncate">
                  {product.tags.join(", ")}
                </TableCell>
                <TableCell className="py-2">
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
                <TableCell className="py-2 text-xs whitespace-nowrap">
                  {formatDate(product.createdAt)}
                </TableCell>
                <TableCell className="py-2">
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
    </div>
  );
}
