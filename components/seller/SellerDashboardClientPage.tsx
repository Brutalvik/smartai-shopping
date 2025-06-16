"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Button, Tooltip, useDisclosure } from "@heroui/react";
import { Loader2, SquarePlus, Trash2 } from "lucide-react";
import { CDN } from "@/config/config";
import { Product } from "@/types/product";
import { addToast } from "@heroui/react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { isEmptyArray } from "formik";
import CollapsibleSidebar from "@/components/ui/CollapsibleSidebar/CollapsibleSidebar";
import classNames from "classnames";
import ProductFilters from "@/components/seller/ProductFilters";
import SalesFilters from "./SalesFilters";
import DashboardTabContent from "./SellerDashboardTabContent";
import PaginationControls from "@/components/ui/Pagination/PaginationControls";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useAutoLogout } from "@/store/hooks/useAutoLogout";
import {
  Filters,
  ProductTabsMap,
  SalesFiltersType,
  tabs,
} from "@/components/seller/types";
import { dummySales } from "@/data/dummySales";

interface SellerDashboardClientPageProps {
  initialProducts: Product[];
  initialLastEvaluatedKey: Record<string, any> | undefined;
  initialHasMore: boolean;
  sellerId: string;
  initialTab?: "products" | "sales" | "upload";
}

export default function SellerDashboardClientPage({
  initialProducts,
  initialLastEvaluatedKey,
  initialHasMore,
  sellerId,
  initialTab,
}: SellerDashboardClientPageProps) {
  useAutoLogout();
  const { isOpen, onClose } = useDisclosure();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const productId = searchParams?.get("productId");

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const tabParam = searchParams?.get("tab") as keyof ProductTabsMap;
  const [activeTab, setActiveTab] = useState<keyof ProductTabsMap>(
    tabParam || (productId ? "upload" : "products")
  );
  const [productToEdit, setProductToEdit] = useState<Product>();

  const [salesFilters, setSalesFilters] = useState<SalesFiltersType>({
    status: "",
    isReturnable: undefined,
    minAmount: undefined,
    maxAmount: undefined,
    startDate: "",
    endDate: "",
  });

  const defaultPage = parseInt(searchParams?.get("page") || "1", 10);
  const defaultRowsPerPage = parseInt(searchParams?.get("limit") || "10", 10);
  const [salesPage, setSalesPage] = useState(defaultPage);
  const [salesRowsPerPage, setSalesRowsPerPage] = useState(defaultRowsPerPage);

  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set("page", salesPage.toString());
    params.set("limit", salesRowsPerPage.toString());
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [salesPage, salesRowsPerPage]);

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

  const [filters, setFilters] = useState<Filters>({
    category: "",
    isActive: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    searchKeyword: "",
  });

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchProductToEdit = async () => {
    if (activeTab === "upload" && productId && !productToEdit) {
      try {
        const res = await fetch(
          `${CDN.sellerProductsApi}/seller/products/${productId}`,
          {
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error("Failed to load product for editing");
        const data = await res.json();
        setProductToEdit(data);
      } catch (err) {
        console.error("Error fetching product for edit:", err);
        addToast({
          description: "Failed to load product for editing",
          color: "danger",
          timeout: 4000,
        });
      }
    }
  };

  useEffect(() => {
    fetchProductToEdit();
  }, [activeTab, productId, productToEdit]);

  useEffect(() => {
    const tabFromUrl = searchParams?.get("tab") as keyof ProductTabsMap;
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

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

  const handleRedirectToEdit = (product: Product) => {
    const params = new URLSearchParams({
      tab: "upload",
      productId: product.productId,
    });
    router.push(`/seller/dashboard?${params.toString()}`);
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
            onTabChange={(tab) => setActiveTab(tab as keyof ProductTabsMap)}
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
              <Tooltip content="Add new product">
                <SquarePlus
                  size={28}
                  className="cursor-pointer text-default-500 hover:text-primary"
                  strokeWidth={1.75}
                  onClick={() => setActiveTab("upload")}
                />
              </Tooltip>
              {activeTab === tabs.products ? (
                <ProductFilters
                  onFiltersChange={(newFilters) => setFilters(newFilters)}
                  initialFilters={filters}
                />
              ) : activeTab === tabs.sales ? (
                <SalesFilters
                  onFiltersChange={(newSalesFilters) =>
                    setSalesFilters(newSalesFilters)
                  }
                  initialFilters={salesFilters}
                />
              ) : null}
            </div>
          </div>

          {activeTab === tabs.sales && (
            <div className="mb-6">
              <PaginationControls
                page={salesPage}
                setPage={setSalesPage}
                rowsPerPage={salesRowsPerPage}
                setRowsPerPage={setSalesRowsPerPage}
                totalItems={dummySales.length} // Replace with real sales count later
              />
            </div>
          )}

          <DashboardTabContent
            activeTab={activeTab}
            products={products}
            selectedProductIds={selectedProductIds}
            onToggleSelectProduct={handleToggleSelectProduct}
            onSelectAllProducts={handleSelectAllProducts}
            allProductsSelected={allProductsSelected}
            setDeletingProductId={setDeletingProductId}
            setIsDeleteConfirmModalOpen={setIsDeleteConfirmModalOpen}
            sellerId={sellerId}
            onEdit={handleRedirectToEdit}
            productToEdit={productToEdit}
            salesFilters={salesFilters}
            salesPage={salesPage}
            salesRowsPerPage={salesRowsPerPage}
          />

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
