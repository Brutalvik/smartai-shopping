import { cookies } from "next/headers";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import BuyerProfilePage from "@/components/ProfilePage";
import { CDN } from "@/config/config";

export default async function Profile(props: any) {
  return <BuyerProfilePage />;
}
