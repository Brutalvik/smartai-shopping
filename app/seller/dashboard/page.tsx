import { cookies } from "next/headers";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import SellerDashboardClientPage from "@/components/seller/SellerDashboardClientPage";
import { CDN } from "@/config/config";
import type { Product } from "@/types/product";

export default async function SellerDashboardPage(props: any) {
  const cookieStore = await cookies(); // ✅ required for your setup
  const sessionCookie = cookieStore.get("x-token");
  const token = sessionCookie?.value || "";

  let products: Product[] = [];
  let lastEvaluatedKey: Record<string, any> | undefined = undefined;
  let hasMore: boolean = false;

  if (!token) {
    console.warn("No session token found in cookies.");
    return (
      <ProtectedLayout redirectPath="/auth/signin?redirect=/seller/dashboard">
        <div className="text-center text-danger mt-10">Unauthorized access</div>
      </ProtectedLayout>
    );
  }

  try {
    const queryParams = new URLSearchParams();
    queryParams?.append("limit", "10");

    const response = await fetch(
      `${CDN.sellerProductsApi}/seller/products?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
    console.error("Error fetching products:", error);
  }

  const tabParam = props?.searchParams?.tab;
  const initialTab =
    tabParam === "upload" || tabParam === "sales" ? tabParam : "products";

  return (
    <ProtectedLayout redirectPath="/auth/signin?redirect=/seller/dashboard">
      <SellerDashboardClientPage
        initialProducts={products}
        initialLastEvaluatedKey={lastEvaluatedKey}
        initialHasMore={hasMore}
        sellerId={products[0]?.sellerId || ""}
        initialTab={initialTab}
      />
    </ProtectedLayout>
  );
}
