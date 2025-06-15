import { cookies } from "next/headers";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import SellerProductUploadForm from "@/components/seller/SellerProductUploadForm";
import { CDN } from "@/config/config";
import type { Product } from "@/types/product";

export default async function UploadPage({
  searchParams,
}: {
  searchParams?: { productId?: string };
}) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("token");
  const token = sessionCookie?.value || "";

  if (!token) {
    return (
      <ProtectedLayout redirectPath="/auth/signin?redirect=/seller/upload">
        <div className="text-center text-danger mt-10">Unauthorized access</div>
      </ProtectedLayout>
    );
  }

  const productId = Array.isArray(searchParams?.productId)
    ? searchParams?.productId[0]
    : searchParams?.productId;

  console.log("PRODUCT ID : ", productId);

  let productToEdit: Product | null = null;

  if (productId) {
    try {
      const response = await fetch(
        `${CDN.sellerProductsApi}/seller/products/${productId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      if (response.ok) {
        const product = await response.json();
        productToEdit = product;
        console.log("PRODUCT TO EDIT : ", productToEdit);
      } else {
        console.warn("Product fetch failed:", await response.text());
      }
    } catch (err) {
      console.error("Error fetching product:", err);
    }
  }

  return (
    <ProtectedLayout redirectPath="/auth/signin?redirect=/seller/upload">
      <SellerProductUploadForm initialProduct={productToEdit} />
    </ProtectedLayout>
  );
}
