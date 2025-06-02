// context/CartContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface CartItem {
  productId: number;
  imageUrl: string;
  name: string;
  description: string;
  inStock: boolean;
  seller: string;
  freeShipping: boolean;
  variant: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  totalItems: number;
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, delta: number) => void;
  setShipping: (value: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  const TAX_RATE = 0.075;

  const addItem = (item: CartItem) => {
    setCartItems((prev) => [...prev, item]);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems(
      (prevItems) =>
        prevItems
          .map((item) =>
            item.productId.toString() === productId
              ? { ...item, quantity: item.quantity + delta }
              : item
          )
          .filter((item) => item.quantity > 0) //remove item if quantity hits 0
    );
  };

  useEffect(() => {
    const subtotalCalc = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const taxCalc = subtotalCalc * TAX_RATE;
    setSubtotal(subtotalCalc);
    setTax(taxCalc);
    setTotal(subtotalCalc + taxCalc + shipping);
  }, [cartItems, shipping]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        subtotal,
        shipping,
        tax,
        total,
        addItem,
        updateQuantity,
        setShipping,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
