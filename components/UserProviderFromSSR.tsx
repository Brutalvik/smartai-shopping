"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks/hooks";
import { setUser } from "@/store/slices/userSlice";
import type { UserState as User } from "@/types/store";

export function UserProviderFromSSR({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  return (
    <>
      <UserBootstrap user={user} />
      {children}
    </>
  );
}

function UserBootstrap({ user }: { user: User }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user && user.email) {
      dispatch(setUser(user));
    }
  }, [user, dispatch]);

  return null;
}
