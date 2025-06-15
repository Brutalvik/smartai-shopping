import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks/hooks";
import { clearUser } from "@/store/slices/userSlice";
import { usePathname, useRouter } from "next/navigation";
import { selectAccessTokenExpiresAt, selectIsSeller } from "@/store/selectors";

export const useAutoLogout = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const tokenExpiry = useAppSelector(selectAccessTokenExpiresAt); // in seconds
  const isSeller = useAppSelector(selectIsSeller);

  useEffect(() => {
    if (!tokenExpiry || !isSeller) return;

    const now = Date.now(); // ms
    const expiry = tokenExpiry * 1000; // convert to ms
    const timeUntilExpiry = expiry - now;

    if (timeUntilExpiry <= 0) {
      dispatch(clearUser());
      if (pathname !== "/auth/signin") {
        router.push("/auth/signin");
      }
    } else {
      const timer = setTimeout(() => {
        dispatch(clearUser());
        if (pathname !== "/auth/signin") {
          router.push("/auth/signin");
        }
      }, timeUntilExpiry);

      return () => clearTimeout(timer);
    }
  }, [tokenExpiry, pathname]);
};
