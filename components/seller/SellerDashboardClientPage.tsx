"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Button, useDisclosure } from "@heroui/react";
import { Loader2, SquarePlus, Trash2 } from "lucide-react";
import { CDN } from "@/config/config";
import { Product } from "@/types/product";
import { addToast } from "@heroui/react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { isEmptyArray } from "formik";
import CollapsibleSidebar from "@/components/ui/CollapsibleSidebar/CollapsibleSidebar";
import classNames from "classnames";
import ProductFilters from "@/components/seller/ProductFilters";
import DashboardTabContent from "./SellerDashboardTabContent";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useAutoLogout } from "@/store/hooks/useAutoLogout";

interface SellerDashboardClientPageProps {
  initialProducts: Product[];
  initialLastEvaluatedKey: Record<string, any> | undefined;
  initialHasMore: boolean;
  sellerId: string;
  initialTab?: "products" | "sales" | "upload";
}

export interface ProductTabsMap {
  products: "products";
  sales: "sales";
  upload: "upload";
}

export const tabs: ProductTabsMap = {
  products: "products",
  sales: "sales",
  upload: "upload",
};

export default function SellerDashboardClientPage({
  initialProducts,
  initialLastEvaluatedKey,
  initialHasMore,
  sellerId,
  initialTab,
}: SellerDashboardClientPageProps) {
  useAutoLogout();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const productId = searchParams?.get("productId");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<keyof ProductTabsMap>(
    initialTab || (productId ? "upload" : "products")
  );

  // keep ?tab=... in sync with activeTab
  useEffect(() => {
    const currentTab = searchParams?.get("tab");
    if (activeTab !== currentTab) {
      const newParams = new URLSearchParams(searchParams?.toString());
      newParams.set("tab", activeTab);
      router.replace(`${pathname}?${newParams.toString()}`);
    }
  }, [activeTab]);

  useEffect(() => {
    const updateWidth = () => setWindowWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    if (windowWidth >= 768 && isOpen) onClose();
  }, [windowWidth, isOpen, onClose]);

  const handleSidebarToggle = (collapsed: boolean) =>
    setSidebarCollapsed(collapsed);

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState<boolean>(false);
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
    category?: string;
    isActive?: boolean;
    minPrice?: number;
    maxPrice?: number;
    searchKeyword?: string;
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
      if (filters.category) queryParams.append("category", filters.category);
      if (filters.isActive !== undefined)
        queryParams.append("isActive", String(filters.isActive));
      if (filters.minPrice !== undefined && !isNaN(filters.minPrice))
        queryParams.append("minPrice", String(filters.minPrice));
      if (filters.maxPrice !== undefined && !isNaN(filters.maxPrice))
        queryParams.append("maxPrice", String(filters.maxPrice));
      if (filters.searchKeyword) queryParams.append("q", filters.searchKeyword);

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
        console.error("Error fetching products:", error);
        setHasMore(false);
        return;
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(
      () => fetchProducts(false, true),
      400
    );
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [filters.searchKeyword]);

  useEffect(() => {
    fetchProducts(false, true);
  }, [filters.category, filters.isActive, filters.minPrice, filters.maxPrice]);

  const handleLoadMore = () => {
    if (!loading && hasMore) fetchProducts(true, false, lastEvaluatedKey);
  };

  const handleToggleSelectProduct = (productId: string) => {
    setSelectedProductIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(productId) ? newSet.delete(productId) : newSet.add(productId);
      return newSet;
    });
  };

  const handleSelectAllProducts = (isSelected: boolean) => {
    setSelectedProductIds(
      isSelected ? new Set(products.map((p) => p.productId)) : new Set()
    );
  };

  const handleDeleteConfirmed = async () => {
    setDeleting(true);
    const idsToDelete = deletingProductId
      ? [deletingProductId]
      : Array.from(selectedProductIds);

    try {
      const responses = await Promise.all(
        idsToDelete.map((productId) =>
          fetch(`${CDN.sellerProductsApi}/seller/products/${productId}`, {
            method: "DELETE",
            credentials: "include",
          })
        )
      );

      const allSuccess = responses.every((res) => res.ok);

      addToast({
        description: allSuccess
          ? `Successfully deleted ${idsToDelete.length} product(s).`
          : `Failed to delete some product(s).`,
        color: allSuccess ? "success" : "danger",
        timeout: 4000,
      });

      fetchProducts(false, true);
      setSelectedProductIds(new Set());
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

  const allProductsSelected =
    products.length > 0 && selectedProductIds.size === products.length;

  return (
    <div className="flex h-[calc(100vh-10vh)]" id="main-content">
      {!loading && (
        <div
          className={classNames(
            "transition-all duration-300 hidden md:block",
            sidebarCollapsed ? "w-[60px]" : "w-[250px]"
          )}
        >
          <CollapsibleSidebar
            onToggle={handleSidebarToggle}
            onTabChange={(tab: keyof ProductTabsMap) => setActiveTab(tab)}
            activeTab={activeTab}
          />
        </div>
      )}

      <div className="flex-1 transition-all duration-300 overflow-auto">
        <div className="p-4">
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
            <h1 className="text-2xl font-bold capitalize">{activeTab}</h1>
            <div className="flex items-center gap-4">
              {selectedProductIds.size > 0 && (
                <Trash2
                  size={25}
                  color="#c70000"
                  className="cursor-pointer"
                  onClick={() => {
                    setIsDeleteConfirmModalOpen(true);
                    setDeletingProductId(null);
                  }}
                />
              )}
              <SquarePlus
                size={28}
                className="cursor-pointer text-default-500 hover:text-primary"
                strokeWidth={1.75}
                onClick={() => setActiveTab("upload")}
              />
              <ProductFilters
                onFiltersChange={(newFilters) => setFilters(newFilters)}
                initialFilters={filters}
              />
            </div>
          </div>

          <DashboardTabContent
            activeTab={activeTab}
            products={products}
            selectedProductIds={selectedProductIds}
            onToggleSelectProduct={handleToggleSelectProduct}
            onSelectAllProducts={handleSelectAllProducts}
            allProductsSelected={allProductsSelected}
            setDeletingProductId={setDeletingProductId}
            setIsDeleteConfirmModalOpen={setIsDeleteConfirmModalOpen}
            onConfirmDelete={handleDeleteConfirmed}
            sellerId={sellerId}
            onEdit={(product) =>
              router.push(`/seller/upload?productId=${product.productId}`)
            }
          />

          {hasMore && !isEmptyArray(products) && !loading && (
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
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
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
        </div>
      </div>

      {isDeleteConfirmModalOpen && (
        <Modal
          isOpen={isDeleteConfirmModalOpen}
          onOpenChange={(open) => setIsDeleteConfirmModalOpen(open)}
          hideCloseButton
          placement="center"
        >
          <ModalContent>
            <ModalHeader>Confirm Delete</ModalHeader>
            <ModalBody>
              Are you sure you want to delete the selected product(s)?
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={() => setIsDeleteConfirmModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                color="danger"
                onPress={handleDeleteConfirmed}
                isLoading={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
