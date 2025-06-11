// app/seller/upload/page.tsx

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/utils/helper";
import SellerProductUploadForm from "@/components/seller/SellerProductUploadForm";
import { UserProviderFromSSR } from "@/components/UserProviderFromSSR";

export default async function UploadPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // 2. Verify the token
  const user = verifyToken(token);

  if (!user || typeof user === "string") {
    redirect(`/auth/signin?redirect=/seller/upload`);
  }

  const userData = {
    id: user.sub || user.id,
    email: (user as any)?.email,
    name: (user as any)?.name || "",
  };

  return (
    <UserProviderFromSSR user={userData}>
      <SellerProductUploadForm />
    </UserProviderFromSSR>
  );
}
