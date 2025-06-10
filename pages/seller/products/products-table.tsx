"use client";

import React, { useState } from "react";
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
} from "@heroui/react";
import { Trash2, Pencil } from "lucide-react";
import { Product } from "@/types/product";
import { CDN } from "@/config/config";

interface SellerProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDeleted: () => void;
  loading: boolean;
}

export default function SellerProductTable({
  products,
  onEdit,
  onDeleted,
  loading,
}: SellerProductTableProps) {
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deleteProduct) return;

    setDeleting(true);
    const res = await fetch(
      `${CDN.sellerProductsApi}/seller/products/${deleteProduct.productId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    setDeleting(false);
    setDeleteProduct(null);

    if (res.ok) {
      onDeleted();
    } else {
      alert("Failed to delete product.");
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-lg shadow border border-default-100 bg-white dark:bg-default-50">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" />
          </div>
        ) : (
          <Table
            aria-label="Seller Products Table"
            isStriped
            removeWrapper
            className="min-w-[800px]"
          >
            <TableHeader>
              <TableColumn>Image</TableColumn>
              <TableColumn>Title</TableColumn>
              <TableColumn>Price</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No products found.">
              {products.map((product) => (
                <TableRow key={product.productId}>
                  <TableCell>
                    <img
                      src={product.images?.[0]}
                      alt={product.title}
                      className="h-12 w-12 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell>{product.title}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>
                    {product.isActive ? (
                      <span className="text-green-600 font-medium">Active</span>
                    ) : (
                      <span className="text-red-500 font-medium">Inactive</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
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
                        onPress={() => setDeleteProduct(product)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteProduct}
        onOpenChange={() => setDeleteProduct(null)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Confirm Deletion</ModalHeader>
              <ModalBody>
                Are you sure you want to delete the product{" "}
                <strong>{deleteProduct?.title}</strong>?
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  isLoading={deleting}
                  onPress={confirmDelete}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
