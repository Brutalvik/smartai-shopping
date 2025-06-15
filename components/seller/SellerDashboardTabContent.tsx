"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

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
    return (
      <div className="relative overflow-x-auto border border-default-100 bg-white dark:bg-default-50 max-w-full rounded-lg">
        <SellerSalesTable sales={dummySales as any} />
      </div>
    );
  }

  if (resolvedTab === tabs.upload) {
    return <SellerProductUploadForm initialProduct={productToEdit} />;
  }

  return null;
}
