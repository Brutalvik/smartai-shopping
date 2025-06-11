// app/seller/upload/page.tsx
// NO "use client" here, this remains a Server Component.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/utils/helper";
import SellerProductUploadForm from "@/components/seller/SellerProductUploadForm";
import { UserProviderFromSSR } from "@/components/UserProviderFromSSR";
import { CDN } from "@/config/config";
import { Product } from "@/types/product";

interface UploadPageProps {
  // Corrected type for searchParams
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function UploadPage({ searchParams }: UploadPageProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const user = verifyToken(token);

  if (!user || typeof user === "string") {
    redirect(`/auth/signin?redirect=/seller/upload`);
  }

  const userData = {
    id: user.sub || user.id,
    email: (user as any)?.email,
    name: (user as any)?.name || "",
  };

  let productToEdit: Product | null = null;
  // Access productId safely, as it could be an array if repeated, but we expect a single string
  const productId = Array.isArray(searchParams.productId)
    ? searchParams.productId[0] // Take the first if it's an array
    : searchParams.productId; // Otherwise, use it directly

  if (productId) {
    try {
      const response = await fetch(
        `${CDN.sellerProductsApi}/seller/products/${productId}`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      if (response.ok) {
        const product = await response.json();
        productToEdit = product;
      } else {
        console.error(
          `Failed to fetch product ${productId} for editing:`,
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error(`Error fetching product ${productId} for editing:`, error);
    }
  }

  return (
    <UserProviderFromSSR user={userData}>
      <SellerProductUploadForm initialProduct={productToEdit} />
    </UserProviderFromSSR>
  );
}
