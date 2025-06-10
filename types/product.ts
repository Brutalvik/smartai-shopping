// types/product.ts
export interface Product {
  productId: string;
  sellerId: string;
  title: string;
  description: string;
  price: string;
  quantity: number;
  category: string;
  tags: string[];
  images: string[];
  isActive: boolean;
  createdAt: string;
}
