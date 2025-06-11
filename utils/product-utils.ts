import { ReadonlyURLSearchParams } from "next/navigation";

interface DecodedProductId {
  displayId: string;
  sellerShortId: string;
  regionShortCode: string;
  productShortId: string;
}

const REGION_MAP: { [key: string]: string } = {
  "us-east-2": "US2",
  "us-east-1": "US1",
  "us-west-1": "USW",
};

const getProductRegionCode = (regionKey: string | undefined): string => {
  if (!regionKey) {
    return "UNK";
  }
  return REGION_MAP[regionKey] || "UNK";
};

export const decodeProductIdForDisplay = (
  fullProductId: string,
  sellerId: string,
  currentProductRegion: string | undefined
): DecodedProductId => {
  if (!fullProductId || fullProductId.length < 4) {
    return {
      displayId: fullProductId,
      sellerShortId: "",
      regionShortCode: "",
      productShortId: fullProductId,
    };
  }

  const sellerShortId = sellerId.substring(0, 4).toUpperCase();
  const productShortId = fullProductId.slice(-6).toUpperCase();
  const regionShortCode = getProductRegionCode(currentProductRegion);

  const displayId = `${sellerShortId}-${regionShortCode}-${productShortId}`;

  return {
    displayId,
    sellerShortId,
    regionShortCode,
    productShortId,
  };
};
