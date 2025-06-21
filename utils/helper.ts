import { CDN } from "@/config/config";
import { canadianAreaCodes } from "@/data/canadianAreaCodes";
import { createHmac } from "crypto";
import jwt from "jsonwebtoken";

export const getFlagFromPhone = (phone: string): string => {
  const areaCode = phone.replace(/\D/g, "").slice(0, 3);
  return canadianAreaCodes.includes(areaCode) ? "🇨🇦" : "🇺🇸";
};

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
    return jwt.verify(token, CDN.jwtSecret!);
  } catch (err) {
    return null;
  }
}

export const getInitial = (name: string = "") =>
  name?.charAt(0).toUpperCase() || "";

export const getFirstNameCapitalized = (fullName: string): string => {
  const firstWord = fullName?.trim().split(" ")[0];
  return firstWord?.charAt(0).toUpperCase() + firstWord?.slice(1).toLowerCase();
};

export const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
