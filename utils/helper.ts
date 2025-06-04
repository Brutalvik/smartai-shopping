import { canadianAreaCodes } from "@/data/canadianAreaCodes";

export const getFlagFromPhone = (phone: string): string => {
  const areaCode = phone.replace(/\D/g, "").slice(0, 3);
  return canadianAreaCodes.includes(areaCode) ? "🇨🇦" : "🇺🇸";
};

export const getFirstNameCapitalized = (fullName: string): string => {
  const firstWord = fullName.trim().split(" ")[0];
  return firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();
};

export function getColorByName(
  name: string,
  avatarColors: { bg: string; fg: string }[]
) {
  const code = [...name.toLowerCase()].reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0
  );
  return avatarColors[code % avatarColors.length];
}
