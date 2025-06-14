// layouts/ProtectedLayout.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/utils/helper";
import { UserProviderFromSSR } from "@/components/UserProviderFromSSR";
import type { User } from "@/context/UserContext";

interface ProtectedLayoutProps {
  children: React.ReactNode;
  redirectPath?: string;
  requireSeller?: boolean;
}

export default async function ProtectedLayout({
  children,
  redirectPath = "/auth/signin",
  requireSeller = false,
}: ProtectedLayoutProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const user = verifyToken(token);

  if (!user || typeof user === "string") {
    redirect(`${redirectPath}?redirect=${encodeURIComponent(redirectPath)}`);
  }

  if (requireSeller && user.group?.toLowerCase() !== "sellers") {
    redirect("/");
  }

  const userData: User = {
    id: user.sub || user.id,
    email: user.email,
    name: user.name || "",
    avatarUrl: user.avatarUrl,
    phone: user.phone,
    given_name: user.given_name,
    family_name: user.family_name,
    business_name: user.business_name,
    group: user.group,
  };

  return <UserProviderFromSSR user={userData}>{children}</UserProviderFromSSR>;
}
