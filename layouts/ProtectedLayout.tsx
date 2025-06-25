import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/utils/helper";
import { UserProviderFromSSR } from "@/components/UserProviderFromSSR";
import type { UserState } from "@/types/store";

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
  const token = cookieStore.get("x-token")?.value;
  const user = verifyToken(token);

  // ⛔ Handle redirect *before* render path
  if (!user || typeof user === "string") {
    throw redirect(
      `${redirectPath}?redirect=${encodeURIComponent(redirectPath)}`
    );
  }

  if (requireSeller && user.group?.toLowerCase() !== "sellers") {
    throw redirect("/");
  }

  const userData: UserState = {
    id: user.id || "",
    sub: user.sub || "",
    email: user.email,
    name: user.name || "",
    phone: user.phone || "",
    given_name: user.given_name || "",
    family_name: user.family_name || "",
    business_name: user.business_name || "",
    preferredLocale: user.preferredLocale || "",
    group: user.group || "",
    accessTokenExpiresAt: user.accessTokenExpiresAt || undefined,
  };

  return <UserProviderFromSSR user={userData}>{children}</UserProviderFromSSR>;
}
