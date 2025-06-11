import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/utils/helper";
import SellerProductUploadForm from "@/components/seller/SellerProductUploadForm";
import { UserProviderFromSSR } from "@/components/UserProviderFromSSR";
import { CDN } from "@/config/config";
import { Product } from "@/types/product";

interface UploadPageProps {
  searchParams: { productId?: string };
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
  const productId = searchParams.productId;

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
      <SellerProductUploadForm />
    </UserProviderFromSSR>
  );
}
