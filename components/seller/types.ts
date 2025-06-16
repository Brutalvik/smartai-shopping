export type Filters = {
  status?: string;
  isReturnable?: boolean;
  minAmount?: number;
  maxAmount?: number;
  startDate?: string;
  endDate?: string;
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

export interface Sale {
  saleId: string;
  productTitle: string;
  buyerEmail: string;
  amount: number;
  quantity: number;
  status: "Delivered" | "Returned" | "Pending";
  orderDate: string;
  returnDeadline: string;
  isReturnable: boolean;
  purchaseDate: string;
  shippingMethod: "Standard" | "Express" | "Same-Day";
  paymentMethod: "Credit Card" | "PayPal" | "Apple Pay" | "Google Pay";
  total: number;
  shippingCost: number;
  discount: number;
  tax: number;
}

export type MapKey =
  | "saleId"
  | "productTitle"
  | "quantity"
  | "amount"
  | "purchaseDate"
  | "status"
  | "orderDate"
  | "shippingMethod"
  | "paymentMethod"
  | "total"
  | "buyerEmail"
  | "returnDeadline"
  | "isReturnable"
  | "shippingCost"
  | "discount"
  | "tax";
