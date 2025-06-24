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

type UUIDEncodingResult = {
  encoded: string;
  positions: number[];
  cases: number[];
};

export const encodeUUID = (uuid: string): UUIDEncodingResult => {
  const positions: number[] = [];
  const cases: number[] = [];
  let encoded = "";

  for (let i = 0; i < uuid.length; i++) {
    const char = uuid[i];
    if (char === "-") {
      positions.push(i);
    } else {
      cases.push(char === char.toUpperCase() ? 1 : 0);
      encoded += char.toUpperCase();
    }
  }

  return { encoded, positions, cases };
};

export const decodeUUID = (
  encoded: string,
  positions: number[],
  cases: number[]
): string => {
  let decoded = "";
  let j = 0;

  for (let i = 0; i < encoded.length + positions.length; i++) {
    if (positions.includes(i)) {
      decoded += "-";
    } else {
      const char = encoded[j];
      decoded += cases[j] === 1 ? char : char.toLowerCase();
      j++;
    }
  }

  return decoded;
};

export const formatPhoneNumber = (raw?: string): string => {
  const digits = raw?.replace(/\D/g, "") ?? "";
  if (digits.length === 11 && digits.startsWith("1")) {
    const parts = digits.slice(1).match(/(\d{3})(\d{3})(\d{4})/);
    if (parts) return `+1 (${parts[1]}) ${parts[2]} ${parts[3]}`;
  }
  return raw ?? "";
};
