import { canadianAreaCodes } from "@/data/canadianAreaCodes";
import { createHmac } from "crypto";
import jwt from "jsonwebtoken"

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

export function calculateSecretHash(
  username: string,
  clientId: string,
  clientSecret: string
) {
  return createHmac("sha256", clientSecret)
    .update(username + clientId)
    .digest("base64");
}



export function verifyToken(token: string | undefined) {
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (err) {
    return null;
  }
}
