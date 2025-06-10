// components/seller/SellerProductCard.tsx
"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { Product } from "@/types/product";
import { useRouter } from "next/navigation";
import { CDN } from "@/config/config";

export default function SellerProductCard({ product }: { product: Product }) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirm) return;

    const res = await fetch(
      `${CDN.sellerProductsApi}/seller/products/${product.productId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (res.ok) {
      window.location.reload(); // Or use optimistic update
    } else {
      alert("Failed to delete product");
    }
  };

  return (
    <Card
      className="w-full shadow-md border border-white/10 dark:border-white/20 bg-white/5 backdrop-blur-md"
      radius="lg"
      isHoverable
    >
      <CardBody className="relative h-40">
        <Image
          src={product.images?.[0] || "/placeholder.png"}
          alt={product.title}
          fill
          className="object-contain p-2"
        />
      </CardBody>
      <CardFooter className="flex flex-col items-start space-y-2 px-4 pb-4">
        <h2 className="font-semibold text-lg">{product.title}</h2>
        <p className="text-sm text-default-600 truncate">
          {product.description}
        </p>
        <div className="flex items-center justify-between w-full pt-2">
          <span className="font-bold text-green-500">${product.price}</span>
          <div className="flex gap-2">
            <Button
              isIconOnly
              size="sm"
              onPress={() =>
                router.push(`/seller/products/edit/${product.productId}`)
              }
            >
              <Pencil size={16} />
            </Button>
            <Button isIconOnly size="sm" color="danger" onPress={handleDelete}>
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
