export type Filters = {
  category?: string;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  searchKeyword?: string;
};

export type SalesFiltersType = {
  status?: string;
  isReturnable?: boolean;
  minAmount?: number;
  maxAmount?: number;
  startDate?: string;
  endDate?: string;
};

export interface ProductTabsMap {
  products: "products";
  sales: "sales";
  upload: "upload";
}

export const tabs: ProductTabsMap = {
  products: "products",
  sales: "sales",
  upload: "upload",
};
