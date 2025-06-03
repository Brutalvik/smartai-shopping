import { canadianAreaCodes } from "@/data/canadianAreaCodes";

export const getFlagFromPhone = (phone: string): string => {
  const areaCode = phone.replace(/\D/g, "").slice(0, 3);
  return canadianAreaCodes.includes(areaCode) ? "🇨🇦" : "🇺🇸";
};
