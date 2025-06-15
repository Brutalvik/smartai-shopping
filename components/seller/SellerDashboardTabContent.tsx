"use client";

import { useRouter } from "next/navigation";
import SellerProductsTable from "@/components/seller/SellerProductsTable";
import SellerProductUploadForm from "@/components/seller/SellerProductUploadForm";
import { Product } from "@/types/product";
import React from "react";
import SellerSalesTable from "@/components/seller/SellerSalesTable";
import { dummySales } from "@/data/dummySales";
import { tabs } from "@/components/seller/SellerDashboardClientPage";

interface DashboardTabContentProps {
  activeTab: string;
  products: Product[];
  selectedProductIds: Set<string>;
  onToggleSelectProduct: (productId: string) => void;
  onSelectAllProducts: (isSelected: boolean) => void;
  allProductsSelected: boolean;
  setDeletingProductId: (id: string | null) => void;
  setIsDeleteConfirmModalOpen: (open: boolean) => void;
  loading: boolean;
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
  loading,
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
        loading={loading}
        sellerId={sellerId}
      />
    );
  }

  if (activeTab === tabs.sales) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Sales Table</h2>
        <div className="text-gray-400">
          <SellerSalesTable sales={dummySales as any} loading={false} />
        </div>
      </div>
    );
  }

  if (activeTab === tabs.upload) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Upload Product</h2>
        <SellerProductUploadForm />
      </div>
    );
  }

  return null;
}
