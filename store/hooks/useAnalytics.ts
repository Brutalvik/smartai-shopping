import { useCallback } from "react";
import { trackEvent } from "@/components/seller/utils/analytics";

export const useAnalytics = () => {
  const logEvent = useCallback((event: string, params?: any) => {
    trackEvent(event, params);
  }, []);

  return { logEvent };
};
