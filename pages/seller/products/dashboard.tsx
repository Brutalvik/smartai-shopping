// app/seller/products/dashboard.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";
import { CDN } from "@/config/config";
import SellerProductCard from "@/components/seller/SellerProductCard";
import { Product } from "@/types/product";

export default function SellerDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${CDN.sellerProductsApi}/seller/products`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load products", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <SellerProductCard key={product.productId} product={product} />
        ))}
      </div>
    </div>
  );
}
