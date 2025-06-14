import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks/hooks";
import { clearUser } from "@/store/slices/userSlice";
import { usePathname, useRouter } from "next/navigation";
import { selectAccessTokenExpiresAt, selectIsSeller } from "@/store/selectors";

export const useAutoLogout = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const tokenExpiry = useAppSelector(selectAccessTokenExpiresAt);
  const isSeller = useAppSelector(selectIsSeller);

  useEffect(() => {
    if (!tokenExpiry || !isSeller) return;

    const now = Date.now();
    const timeUntilExpiry = tokenExpiry - now;

    if (timeUntilExpiry <= 0) {
      dispatch(clearUser());
      router.push("/signin");
    } else {
      const timer = setTimeout(() => {
        dispatch(clearUser());
        router.push("/signin");
      }, timeUntilExpiry);

      return () => clearTimeout(timer);
    }
  }, [tokenExpiry, pathname]);
};
