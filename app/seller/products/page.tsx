import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/utils/helper";
import { CDN } from "@/config/config";
import { Product } from "@/types/product";
import SellerDashboardClientPage from "@/components/seller/SellerDashboardClientPage";

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );
    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        (result as any).error ||
          (result as any).message ||
          "Failed to fetch products"
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
