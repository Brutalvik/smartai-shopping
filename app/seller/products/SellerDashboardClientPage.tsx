// app/seller/upload/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/utils/helper";
import SellerProductUploadForm from "@/components/seller/SellerProductUploadForm";
import { UserProviderFromSSR } from "@/components/UserProviderFromSSR";
import { CDN } from "@/config/config";
import { Product } from "@/types/product";
import XyvoLoader from "@/components/ui/XyvoLoader/XyvoLoader";

export default async function UploadPage({ searchParams }: any) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const user = verifyToken(token);

  if (!user || typeof user === "string") {
    redirect(`/auth/signin?redirect=/seller/upload`);
  }

  const userData = {
    id: user.sub || user.id,
    email: user?.email,
    name: user?.name || "",
  };

  let productToEdit: Product | null = null;

  const productId = Array.isArray(searchParams?.productId)
    ? searchParams?.productId[0]
    : searchParams?.productId;

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
    } catch (err) {
      console.error("Error fetching product:", err);
    }
  }

  if (productId && !productToEdit) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <XyvoLoader />
      </div>
    );
  }

  return (
    <UserProviderFromSSR user={userData}>
      <SellerProductUploadForm initialProduct={productToEdit} />
    </UserProviderFromSSR>
  );
}
