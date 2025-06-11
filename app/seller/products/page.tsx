import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/utils/helper";
import { CDN } from "@/config/config";
import { Product } from "@/types/product";
import dynamic from "next/dynamic";
import XyvoLoader from "@/components/ui/XyvoLoader/XyvoLoader";

// Dynamically import the client page with suspense
const SellerDashboardClientPage = dynamic(
  () => import("@/app/seller/products/SellerDashboardClientPage"),
  {
    ssr: false,
    loading: () => <XyvoLoader />,
  }
);

export default async function SellerDashboardServerPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const user = verifyToken(token);

  if (!user || typeof user === "string") {
    redirect(`/auth/signin?redirect=/seller/dashboard`);
  }

  const userId = user.sub || user.id;

  let products: Product[] = [];
  let lastEvaluatedKey: Record<string, any> | undefined = undefined;
  let hasMore: boolean = false;

  try {
    const queryParams = new URLSearchParams();
    queryParams.append("limit", "10");

    const response = await fetch(
      `${CDN.sellerProductsApi}/seller/products?${queryParams.toString()}`,
      {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.error || result.message || "Failed to fetch products"
      );
    }

    products = result.products;
    lastEvaluatedKey = result.lastEvaluatedKey;
    hasMore = !!result.lastEvaluatedKey;
  } catch (error: any) {
    console.error("Error fetching products on server:", error);
  }

  return (
    <SellerDashboardClientPage
      initialProducts={products}
      initialLastEvaluatedKey={lastEvaluatedKey}
      initialHasMore={hasMore}
      sellerId={userId}
    />
  );
}
