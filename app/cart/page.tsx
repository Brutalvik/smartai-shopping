"use client";

import React, { useEffect } from "react";
import CartContainer from "@/components/CartContainer";
import CartSidebarSummary from "@/components/CartSidebarSummary";
import CartMobileDrawer from "@/components/CartMobileDrawer";
import { dummyCartItems } from "@/data/dummyItems";
import CartCard from "@/components/CartCard";
import EmptyCart from "@/components/EmptyCart";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cartItems, addItem } = useCart();

  // Add dummy items on first mount
  useEffect(() => {
    if (cartItems.length === 0) {
      dummyCartItems.forEach((item) => {
        addItem({ ...item, productId: item.productId });
      });
    }
  }, [cartItems.length, addItem]);

  const hasItems = cartItems.length > 0;

  return (
    <CartContainer
      hasItems={hasItems}
      leftContent={
        hasItems ? (
          cartItems.map((item, index) => (
            <CartCard key={index} index={index} {...item} />
          ))
        ) : (
          <EmptyCart />
        )
      }
      rightContent={
        hasItems && (
          <>
            <CartSidebarSummary />
            <CartMobileDrawer />
          </>
        )
      }
    />
  );
}
