// app/seller-products-upload/page.tsx
"use client";

import ProductForm from "@/components/ProductForm";

export default function SellerProductUploadPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Upload a Product</h1>
      <ProductForm />
    </div>
  );
}
