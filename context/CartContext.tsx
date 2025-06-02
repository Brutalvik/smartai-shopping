"use client";

import React, { createContext, useContext, useState } from "react";

interface CartContextType {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  setSubtotal: (val: number) => void;
  setShipping: (val: number) => void;
  setTax: (val: number) => void;
  setTotal: (val: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  return (
    <CartContext.Provider
      value={{
        subtotal,
        shipping,
        tax,
        total,
        setSubtotal,
        setShipping,
        setTax,
        setTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
