declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const trackEvent = (
  event: string,
  params?: Record<string, any>
): void => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", event, params || {});
  }
};
