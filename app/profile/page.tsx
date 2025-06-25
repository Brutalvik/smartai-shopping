import { cookies } from "next/headers";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import BuyerProfilePage from "@/components/Profile";

export default async function Profile(props: any) {
  return <BuyerProfilePage />;
}
