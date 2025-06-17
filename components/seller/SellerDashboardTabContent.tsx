"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Product } from "@/types/product";
import { Sale, SalesFiltersType, tabs } from "@/components/seller/types";
import XLoader from "@/components/ui/XLoader/XLoader";

const SellerProductsTable = dynamic(
  () => import("@/components/seller/SellerProductsTable"),
  {
    ssr: false,
    loading: () => <XLoader />,
  }
);

const SellerProductUploadForm = dynamic(
  () => import("@/components/seller/SellerProductUploadForm"),
  {
    ssr: false,
    loading: () => <XLoader />,
  }
);

const SellerSalesTable = dynamic(
  () => import("@/components/seller/SellerSalesTable"),
  {
    ssr: false,
    loading: () => <XLoader />,
  }
);

interface DashboardTabContentProps {
  activeTab?: string;
  products: Product[];
  selectedProductIds: Set<string>;
  onToggleSelectProduct: (productId: string) => void;
  onSelectAllProducts: (isSelected: boolean) => void;
  allProductsSelected: boolean;
  setDeletingProductId: (id: string | null) => void;
  setIsDeleteConfirmModalOpen: (open: boolean) => void;
  sellerId: string;
  onEdit: (product: Product) => void;
  productToEdit?: Product;
  salesFilters?: SalesFiltersType;
  salesPage: number;
  salesRowsPerPage: number;
  filteredSales: Sale[];
  isModalOpen: boolean;
  setIsModalOpen: () => void;
  selectedColumns: string[];
  setSelectedColumns: React.Dispatch<React.SetStateAction<string[]>>;
  columnOrder: string[];
  setColumnOrder: (order: string[]) => void;
}

export default function DashboardTabContent({
  activeTab,
  products,
  selectedProductIds,
  onToggleSelectProduct,
  onSelectAllProducts,
  allProductsSelected,
  setDeletingProductId,
  setIsDeleteConfirmModalOpen,
  sellerId,
  onEdit,
  productToEdit,
  salesFilters,
  salesPage,
  salesRowsPerPage,
  filteredSales,
  isModalOpen,
  setIsModalOpen,
  selectedColumns,
  setSelectedColumns,
  columnOrder,
  setColumnOrder,
}: DashboardTabContentProps) {
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams?.get("tab") as keyof typeof tabs | null;
  const resolvedTab =
    activeTab || (tabFromUrl && tabs[tabFromUrl]) || tabs.products;

  if (resolvedTab === tabs.products) {
    return (
      <SellerProductsTable
        products={products}
        selectedProductIds={selectedProductIds}
        onToggleSelectProduct={onToggleSelectProduct}
        onSelectAllProducts={onSelectAllProducts}
        allProductsSelected={allProductsSelected}
        onEdit={onEdit}
        onDelete={(product) => {
          setDeletingProductId(product.productId);
          setIsDeleteConfirmModalOpen(true);
        }}
        sellerId={sellerId}
      />
    );
  }

  if (resolvedTab === tabs.sales) {
    const paginatedSales: Sale[] = filteredSales
      .map((s) => ({
        ...s,
        status: s.status as "Delivered" | "Returned" | "Pending",
      }))
      .slice((salesPage - 1) * salesRowsPerPage, salesPage * salesRowsPerPage);
    return (
      <div className="relative overflow-x-auto border border-default-100 bg-white dark:bg-default-50 max-w-full rounded-lg">
        <SellerSalesTable
          sales={paginatedSales}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          selectedColumns={selectedColumns}
          setSelectedColumns={setSelectedColumns}
          columnOrder={columnOrder}
          setColumnOrder={setColumnOrder}
        />
      </div>
    );
  }

  if (resolvedTab === tabs.upload) {
    return <SellerProductUploadForm initialProduct={productToEdit} />;
  }

  return null;
}
