// context/CartContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, delta: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  const TAX_RATE = 0.075;

  const addItem = (item: CartItem) => {
    setCartItems((prev) => [...prev, item]);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
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
    setTotal(subtotalCalc + taxCalc);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        subtotal,
        tax,
        total,
        addItem,
        updateQuantity,
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
