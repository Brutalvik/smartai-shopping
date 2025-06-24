import { cookies } from "next/headers";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import BuyerProfilePage from "@/components/ProfilePage";
import { CDN } from "@/config/config";

export default async function SellerDashboardPage(props: any) {
  const cookieStore = await cookies(); // ✅ required for your setup
  const sessionCookie = cookieStore.get("x-token");
  const token = sessionCookie?.value || "";

  if (!token) {
    console.warn("No session token found in cookies.");
    return (
      <ProtectedLayout redirectPath="/auth/signin?redirect=/seller/dashboard">
        <div className="text-center text-danger mt-10">Unauthorized access</div>
      </ProtectedLayout>
    );
  }
  return (
    <ProtectedLayout redirectPath="/auth/signin?redirect=/profile">
      <BuyerProfilePage />
    </ProtectedLayout>
  );
}
