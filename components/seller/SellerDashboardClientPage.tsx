"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { Loader2 } from "lucide-react";
import { CDN } from "@/config/config";
import { Product } from "@/types/product";
import { addToast } from "@heroui/react";
import DashboardHeader from "@/components/seller/DashboardHeader";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { isEmptyArray } from "formik";

const SellerProductsTable = dynamic(
  () => import("@/components/seller/SellerProductsTable"),
  {
    ssr: false,
    loading: () => <Spinner />,
  }
);

interface SellerDashboardClientPageProps {
  initialProducts: Product[];
  initialLastEvaluatedKey: Record<string, any> | undefined;
  initialHasMore: boolean;
  sellerId: string;
}

export default function SellerDashboardClientPage({
  initialProducts,
  initialLastEvaluatedKey,
  initialHasMore,
  sellerId,
}: SellerDashboardClientPageProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState<
    Record<string, any> | undefined
  >(initialLastEvaluatedKey);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(
    new Set()
  );

  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  type Filters = {
    category: string;
    isActive: boolean | undefined;
    minPrice: number | undefined;
    maxPrice: number | undefined;
    searchKeyword: string;
  };

  const [filters, setFilters] = useState<Filters>({
    category: "",
    isActive: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    searchKeyword: "",
  });

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchProducts = useCallback(
    async (
      loadMore: boolean = false,
      newFiltersApplied: boolean = false,
      currentLastEvaluatedKey: Record<string, any> | undefined = undefined
    ) => {
      setLoading(true);
      setSelectedProductIds(new Set());

      if (newFiltersApplied) {
        setLastEvaluatedKey(undefined);
        setHasMore(true);
        currentLastEvaluatedKey = undefined;
      }

      const queryParams = new URLSearchParams();
      if (loadMore && currentLastEvaluatedKey) {
        queryParams.append(
          "lastEvaluatedKey",
          JSON.stringify(currentLastEvaluatedKey)
        );
      }
      queryParams.append("limit", "10");

      if (filters.category) {
        queryParams.append("category", filters.category);
      }
      if (filters.isActive !== undefined) {
        queryParams.append("isActive", String(filters.isActive));
      }
      if (filters.minPrice !== undefined && !isNaN(filters.minPrice)) {
        queryParams.append("minPrice", String(filters.minPrice));
      }
      if (filters.maxPrice !== undefined && !isNaN(filters.maxPrice)) {
        queryParams.append("maxPrice", String(filters.maxPrice));
      }
      if (filters.searchKeyword) {
        queryParams.append("q", filters.searchKeyword);
      }

      try {
        const response = await fetch(
          `${CDN.sellerProductsApi}/seller/products?${queryParams.toString()}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const result = await response.json();

        if (!response.ok) throw new Error("Failed to fetch products");

        setProducts((prevProducts) =>
          loadMore ? [...prevProducts, ...result.products] : result.products
        );
        if (isEmptyArray(result.products)) {
          setLoading(false);
          return;
        }
        setLastEvaluatedKey(result.lastEvaluatedKey);
        setHasMore(!!result.lastEvaluatedKey);
      } catch (error: any) {
        addToast({
          description: `Error fetching products: ${error.message}`,
          color: "danger",
          timeout: 5000,
        });
        console.error("Error fetching products:", error);
        setHasMore(false);
        return;
      } finally {
        setLoading(false);
      }
    },
    [
      filters.category,
      filters.isActive,
      filters.minPrice,
      filters.maxPrice,
      filters.searchKeyword,
    ]
  );

  // Debounce searchKeyword separately
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      fetchProducts(false, true);
    }, 400); // tweak debounce delay as needed

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [filters.searchKeyword]);

  // Immediate fetch for other filters
  useEffect(() => {
    fetchProducts(false, true);
  }, [filters.category, filters.isActive, filters.minPrice, filters.maxPrice]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchProducts(true, false, lastEvaluatedKey);
    }
  };

  const handleToggleSelectProduct = (productId: string) => {
    setSelectedProductIds((prevSelected) => {
      const newSelection = new Set(prevSelected);
      if (newSelection.has(productId)) {
        newSelection.delete(productId);
      } else {
        newSelection.add(productId);
      }
      return newSelection;
    });
  };

  const handleSelectAllProducts = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedProductIds(new Set(products.map((p) => p.productId)));
    } else {
      setSelectedProductIds(new Set());
    }
  };

  const handleDeleteConfirmed = async () => {
    setDeleting(true);
    let idsToDelete: string[] = [];

    if (deletingProductId) {
      idsToDelete = [deletingProductId];
    } else if (selectedProductIds.size > 0) {
      idsToDelete = Array.from(selectedProductIds);
    } else {
      setDeleting(false);
      setIsDeleteConfirmModalOpen(false);
      return;
    }

    try {
      const responses = await Promise.all(
        idsToDelete.map((id) =>
          fetch(`${CDN.sellerProductsApi}/seller/products/${id}`, {
            method: "DELETE",
            credentials: "include",
          })
        )
      );

      const allSuccess = responses.every((res) => res.ok);

      if (allSuccess) {
        addToast({
          description: `Successfully deleted ${idsToDelete.length} product(s).`,
          color: "success",
          timeout: 3000,
        });
        fetchProducts(false, true);
        setSelectedProductIds(new Set());
      } else {
        const failedCount = responses.filter((res) => !res.ok).length;
        addToast({
          description: `Failed to delete ${failedCount} product(s). Please try again.`,
          color: "danger",
          timeout: 5000,
        });
        console.error("Some deletions failed:", responses);
      }
    } catch (error: any) {
      addToast({
        description: `Error during deletion: ${error.message}`,
        color: "danger",
        timeout: 5000,
      });
    } finally {
      setDeleting(false);
      setIsDeleteConfirmModalOpen(false);
    }
  };

  const handleFiltersChange = useCallback(
    (newFilters: {
      category?: string;
      isActive?: boolean;
      minPrice?: number;
      maxPrice?: number;
      searchKeyword?: string;
    }) => {
      setFilters((prev) => ({
        ...prev,
        ...newFilters,
      }));
    },
    []
  );

  const allProductsSelected =
    products.length > 0 && selectedProductIds.size === products.length;

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        onFiltersChange={handleFiltersChange}
        onBulkDelete={() => {
          setIsDeleteConfirmModalOpen(true);
          setDeletingProductId(null);
        }}
        showBulkDelete={selectedProductIds.size > 0}
        initialFilters={filters}
      />

      <div className="flex flex-grow">
        <div className="w-1/5 p-6 border-r border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Seller Tools</h2>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-blue-600 hover:underline">
                Overview
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline">
                Analytics
              </a>
            </li>
          </ul>
        </div>

        <div className="w-4/5 p-6 flex flex-col">
          <h1 className="text-2xl font-bold mb-6">My Products</h1>

          {loading && products.length === 0 ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-2 text-lg">Loading products...</span>
            </div>
          ) : (
            <>
              <SellerProductsTable
                products={products}
                selectedProductIds={selectedProductIds}
                onToggleSelectProduct={handleToggleSelectProduct}
                onSelectAllProducts={handleSelectAllProducts}
                allProductsSelected={allProductsSelected}
                onEdit={(product) => {
                  router.push(`/seller/upload?productId=${product.productId}`);
                }}
                onDelete={(product) => {
                  setDeletingProductId(product.productId);
                  setIsDeleteConfirmModalOpen(true);
                }}
                loading={loading}
                sellerId={sellerId}
              />
              {hasMore && !isEmptyArray(products) && (
                <div className="text-center mt-8">
                  <Button
                    onPress={handleLoadMore}
                    disabled={loading}
                    className="px-6 py-3"
                    color="primary"
                    variant="solid"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />{" "}
                        Loading More...
                      </>
                    ) : (
                      "Load More Products"
                    )}
                  </Button>
                </div>
              )}
              {!loading && products.length === 0 && (
                <div className="text-center text-gray-600 text-lg mt-10">
                  No products found with the current filters.
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Modal
        isOpen={isDeleteConfirmModalOpen}
        onOpenChange={() => setIsDeleteConfirmModalOpen(false)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Confirm Deleting Product(s)</ModalHeader>
              <ModalBody>
                {deletingProductId ? (
                  <>
                    Are you sure you want to delete the product{" "}
                    <strong>
                      {products.find((p) => p.productId === deletingProductId)
                        ?.title || "this product"}
                    </strong>
                    ?
                  </>
                ) : (
                  <>
                    Are you sure you want to delete{" "}
                    <strong>
                      {selectedProductIds.size} selected product(s)
                    </strong>
                    ?
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="solid"
                  color="primary"
                  onPress={onClose}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  variant="solid"
                  isLoading={deleting}
                  onPress={handleDeleteConfirmed}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
