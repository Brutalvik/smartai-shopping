"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Button, Chip, Tooltip, useDisclosure } from "@heroui/react";
import { SquarePlus, Trash2 } from "lucide-react";
import { CDN } from "@/config/config";
import { Product } from "@/types/product";
import { addToast } from "@heroui/react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
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
  Sale,
  SalesFiltersType,
  tabs,
} from "@/components/seller/types";
import { dummySales } from "@/data/dummySales";
import { motion } from "framer-motion";

import CustomizableColumnButton from "@/components/ui/CustomizableColumnButton/CustomizableColumnButton";
import { allColumns } from "@/components/seller/utils";
import ExportButton from "@/components/ui/ExportButton/ExportButton";
import { selectUser } from "@/store/selectors";
import { useAppSelector } from "@/store/hooks/hooks";

interface SellerDashboardClientPageProps {
  initialProducts: Product[];
  initialLastEvaluatedKey: Record<string, any> | undefined;
  initialHasMore: boolean;
  sellerId: string;
  initialTab: string;
}

export default function SellerDashboardClientPage({
  initialProducts,
  initialLastEvaluatedKey,
  initialHasMore,
  sellerId,
  initialTab,
}: SellerDashboardClientPageProps) {
  useAutoLogout();
  const { given_name, family_name, email, business_name, phone, id } =
    useAppSelector(selectUser);

  const { isOpen, onClose } = useDisclosure();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const productId = searchParams?.get("productId");
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const tabParam = searchParams?.get("tab") as keyof ProductTabsMap;
  const [activeTab, setActiveTab] = useState<keyof ProductTabsMap>(
    tabParam || (productId ? "upload" : "products")
  );
  const [productToEdit, setProductToEdit] = useState<Product>();

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState<
    Record<string, any> | undefined
  >(initialLastEvaluatedKey);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState(
    allColumns.filter((c) => c.mandatory).map((c) => c.key)
  );

  const [filters, setFilters] = useState<Filters>({
    category: searchParams?.get("category") || "",
    isActive: searchParams?.get("isActive") === "true" ? true : undefined,
    minPrice: searchParams?.get("minPrice")
      ? parseFloat(searchParams.get("minPrice")!)
      : undefined,
    maxPrice: searchParams?.get("maxPrice")
      ? parseFloat(searchParams.get("maxPrice")!)
      : undefined,
    searchKeyword: searchParams?.get("search") || "",
  });

  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(
    new Set()
  );
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

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
  const [salesChips, setSalesChips] = useState<
    { label: string; onRemove: () => void }[]
  >([]);
  const [productChips, setProductChips] = useState<
    { label: string; onRemove: () => void }[]
  >([]);
  const [columnOrder, setColumnOrder] = useState<string[]>(
    allColumns.filter((c) => c.mandatory).map((c) => c.key)
  );

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
    const params = new URLSearchParams(searchParams?.toString());
    params.set("tab", "upload");
    params.set("productId", product.productId);
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
    const params = new URLSearchParams(searchParams?.toString());
    params.set("page", salesPage.toString());
    params.set("limit", salesRowsPerPage.toString());
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [salesPage, salesRowsPerPage]);

  useEffect(() => {
    const applyProductFilters = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (filters.category) query.set("category", filters.category);
        if (filters.isActive !== undefined)
          query.set("isActive", filters.isActive.toString());
        if (filters.minPrice !== undefined)
          query.set("minPrice", filters.minPrice.toString());
        if (filters.maxPrice !== undefined)
          query.set("maxPrice", filters.maxPrice.toString());
        if (filters.searchKeyword) query.set("search", filters.searchKeyword);

        const url = `${CDN.sellerProductsApi}/seller/products?${query.toString()}`;
        const res = await fetch(url, { credentials: "include" });
        const data = await res.json();
        setProducts(data.products);
        setHasMore(data.hasMore);
        setLastEvaluatedKey(data.lastEvaluatedKey);
      } catch (err) {
        console.error("Error applying product filters:", err);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "products") {
      applyProductFilters();
    }
  }, [filters]);

  const filteredSales: Sale[] = useMemo(() => {
    return dummySales
      .map((sale) => ({
        ...sale,
        status: sale.status as "Delivered" | "Returned" | "Pending",
        shippingMethod: sale.shippingMethod as
          | "Express"
          | "Standard"
          | "Same-Day",
        paymentMethod: sale.paymentMethod as
          | "Credit Card"
          | "Apple Pay"
          | "PayPal"
          | "Google Pay",
      }))
      .filter((sale) => {
        const {
          status,
          isReturnable,
          minAmount,
          maxAmount,
          startDate,
          endDate,
        } = salesFilters;

        const saleDate = new Date(sale.orderDate);
        const matchesStatus =
          !status || sale.status.toLowerCase() === status.toLowerCase();
        const matchesReturnable =
          isReturnable === undefined || sale.isReturnable === isReturnable;
        const matchesMinAmount =
          minAmount === undefined || sale.amount >= minAmount;
        const matchesMaxAmount =
          maxAmount === undefined || sale.amount <= maxAmount;
        const matchesStartDate = !startDate || saleDate >= new Date(startDate);
        const matchesEndDate = !endDate || saleDate <= new Date(endDate);

        return (
          matchesStatus &&
          matchesReturnable &&
          matchesMinAmount &&
          matchesMaxAmount &&
          matchesStartDate &&
          matchesEndDate
        );
      });
  }, [salesFilters]);

  const countStart = (salesPage - 1) * salesRowsPerPage + 1;
  const countEnd = Math.min(salesPage * salesRowsPerPage, filteredSales.length);

  const paginatedSales = useMemo(() => {
    const start = (salesPage - 1) * salesRowsPerPage;
    const end = start + salesRowsPerPage;
    return filteredSales.slice(start, end);
  }, [filteredSales, salesPage, salesRowsPerPage]);

  return (
    <div className="flex" id="main-content">
      <div className="flex-1 transition-all duration-300">
        <div className="p-4">
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold capitalize">{activeTab}</h1>
              {activeTab === tabs.products && productChips.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {productChips.map((chip) => (
                    <Chip
                      key={chip.label}
                      onClose={chip.onRemove}
                      variant="flat"
                      color="primary"
                      size="sm"
                      className="text-sm"
                    >
                      {chip.label}
                    </Chip>
                  ))}
                </div>
              )}
              {activeTab === tabs.sales && salesChips.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {salesChips.map((chip) => (
                    <motion.div
                      key={chip.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div key={chip.label}>
                        <Chip
                          onClose={chip.onRemove}
                          variant="flat"
                          color="primary"
                          size="sm"
                          className="text-sm"
                        >
                          {chip.label}
                        </Chip>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {activeTab === tabs.sales && (
              <div className="text-sm text-gray-500">
                Showing {countStart}–{countEnd} of {filteredSales.length} sales
              </div>
            )}

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
              {activeTab === tabs.sales && (
                <div className="flex">
                  <CustomizableColumnButton
                    className="cursor-pointer text-default-500 hover:text-primary"
                    onOpen={() => setIsModalOpen(true)}
                  />
                </div>
              )}
              <Tooltip content="Add new product">
                <SquarePlus
                  size={26}
                  className="cursor-pointer text-default-500 hover:text-primary"
                  strokeWidth={1.75}
                  onClick={() => setActiveTab("upload")}
                />
              </Tooltip>
              {activeTab === tabs.products ? (
                <ProductFilters
                  onFiltersChange={(newFilters) => setFilters(newFilters)}
                  initialFilters={filters}
                  setActiveChips={setProductChips}
                />
              ) : activeTab === tabs.sales ? (
                <div className="flex flex-row gap-4">
                  <ExportButton
                    sellerName={given_name}
                    sellerId={id}
                    businessName={business_name}
                    sellerFirstName={given_name}
                    sellerLastName={family_name}
                    sellerPhone={phone}
                    sellerEmail={email}
                    data={paginatedSales}
                    allData={filteredSales}
                    columns={columnOrder}
                  />
                  <SalesFilters
                    onFiltersChange={(newSalesFilters) =>
                      setSalesFilters(newSalesFilters)
                    }
                    initialFilters={salesFilters}
                    setActiveChips={setSalesChips}
                  />
                </div>
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
                totalItems={filteredSales.length}
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
            filteredSales={filteredSales}
            isModalOpen={isModalOpen}
            setIsModalOpen={() => setIsModalOpen(!setIsModalOpen)}
            selectedColumns={selectedColumns}
            setSelectedColumns={setSelectedColumns}
            columnOrder={columnOrder}
            setColumnOrder={setColumnOrder}
          />

          {!loading && products.length === 0 && activeTab === tabs.products && (
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
