"use client";

import React from "react";
import dynamic from "next/dynamic";

import { dummySales } from "@/data/dummySales";
import { tabs } from "@/components/seller/SellerDashboardClientPage";
import { Product } from "@/types/product";

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
  activeTab: string;
  products: Product[];
  selectedProductIds: Set<string>;
  onToggleSelectProduct: (productId: string) => void;
  onSelectAllProducts: (isSelected: boolean) => void;
  allProductsSelected: boolean;
  setDeletingProductId: (id: string | null) => void;
  setIsDeleteConfirmModalOpen: (open: boolean) => void;
  sellerId: string;
  onEdit: (product: Product) => void;
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
}: DashboardTabContentProps) {
  if (activeTab === tabs.products) {
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

  if (activeTab === tabs.sales) {
    return (
      <div className="relative overflow-x-auto border border-default-100 bg-white dark:bg-default-50 max-w-full rounded-lg">
        <SellerSalesTable sales={dummySales as any} />
      </div>
    );
  }

  if (activeTab === tabs.upload) {
    return <SellerProductUploadForm />;
  }

  return null;
}
