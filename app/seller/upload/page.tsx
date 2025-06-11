// app/seller/upload/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/utils/helper";
import SellerProductUploadForm from "@/components/seller/SellerProductUploadForm";
import { UserProviderFromSSR } from "@/components/UserProviderFromSSR";
import { CDN } from "@/config/config";
import { Product } from "@/types/product";

export default async function UploadPage({}: {}) {
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
  const productIdRaw = 123;
  const productId = Array.isArray(productIdRaw)
    ? productIdRaw[0]
    : productIdRaw;
  console.log("PRODUCT ID : ", productId);
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
      console.log("  RESPONSE   ", response);
      if (response.ok) {
        const product = await response.json();
        productToEdit = product;
      }
    } catch (err) {
      console.error("Error fetching product:", err);
    }
  }

  return (
    <UserProviderFromSSR user={userData}>
      <SellerProductUploadForm initialProduct={productToEdit} />
    </UserProviderFromSSR>
  );
}
