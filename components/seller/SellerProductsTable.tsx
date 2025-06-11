"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  Tooltip,
} from "@heroui/react";
import { Trash2, Pencil, Loader2 } from "lucide-react";
import Image from "next/image";
import { Product } from "@/types/product";
import { decodeProductIdForDisplay } from "@/utils/product-utils";

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
        >
          <TableHeader>
            <TableColumn className="w-12">
              <Checkbox
                isSelected={allProductsSelected}
                onValueChange={onSelectAllProducts}
                isDisabled={products.length === 0}
              />
            </TableColumn>
            <TableColumn className="w-24">ID</TableColumn>
            <TableColumn>Product Name</TableColumn>
            <TableColumn>Description</TableColumn>
            <TableColumn className="w-20">Price</TableColumn>
            <TableColumn className="w-20">Quantity</TableColumn>
            <TableColumn className="w-24">Category</TableColumn>
            <TableColumn>Tags</TableColumn>
            <TableColumn className="w-24">Published</TableColumn>
            <TableColumn className="w-24">Image</TableColumn>
            <TableColumn className="w-24 text-center">Actions</TableColumn>
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
                  className={isSelected ? "bg-blue-50" : ""}
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
                    <Tooltip content={product.productId}>
                      <span className="font-mono text-xs cursor-help">
                        {decodedId.displayId}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{product.title}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    <Tooltip
                      content={
                        <div className="max-w-xs whitespace-normal">
                          {product.description}
                        </div>
                      }
                      delay={0}
                      closeDelay={0}
                    >
                      <span className="cursor-help">{product.description}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="max-w-[150px] truncate">
                    <Tooltip
                      content={
                        <div className="max-w-xs whitespace-normal">
                          {product.tags.join(", ")}
                        </div>
                      }
                      delay={0}
                      closeDelay={0}
                    >
                      <span className="cursor-help">
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
                  <TableCell className="text-center">
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        isIconOnly
                        color="default"
                        onPress={() => onEdit(product)}
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
