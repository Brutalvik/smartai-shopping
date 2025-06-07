// components/UserProviderFromSSR.tsx
"use client";

import { useEffect } from "react";
import { UserProvider, useUser, type User } from "@/context/UserContext";

export function UserProviderFromSSR({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <UserBootstrap user={user} />
      {children}
    </UserProvider>
  );
}

function UserBootstrap({ user }: { user: User }) {
  const { setUser } = useUser();

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return null;
}
