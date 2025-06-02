"use client";

import React, { useEffect, useRef } from "react";
import CartContainer from "@/components/CartContainer";
import CartSidebarSummary from "@/components/CartSidebarSummary";
import CartMobileDrawer from "@/components/CartMobileDrawer";
import { dummyCartItems } from "@/data/dummyItems";
import CartCard from "@/components/CartCard";
import EmptyCart from "@/components/EmptyCart";
import { useCart } from "@/context/CartContext";
import { Button, useDisclosure } from "@heroui/react";

export default function CartPage() {
  const { cartItems, addItem } = useCart();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const hasInitialized = useRef(false); // flag to prevent reloading

  useEffect(() => {
    if (!hasInitialized.current && cartItems.length === 0) {
      dummyCartItems.forEach((item) =>
        addItem({ ...item, productId: item.productId })
      );
      hasInitialized.current = true;
    }
  }, [cartItems, addItem]);

  const hasItems = cartItems.length > 0;

  return (
    <>
      <CartContainer
        hasItems={hasItems}
        leftContent={
          hasItems ? (
            cartItems
              .filter((item) => {
                const fullItem = dummyCartItems.find(
                  (d) => d.productId === item.productId
                );
                return fullItem?.inStock;
              })
              .map((item, index) => {
                const fullItem = dummyCartItems.find(
                  (d) => d.productId === item.productId
                );
                return fullItem ? (
                  <CartCard
                    key={item.productId}
                    index={index}
                    {...fullItem}
                    quantity={item.quantity}
                  />
                ) : null;
              })
          ) : (
            <EmptyCart />
          )
        }
        rightContent={
          hasItems && (
            <>
              <CartSidebarSummary />
              <CartMobileDrawer isOpen={isOpen} onClose={onClose} />
            </>
          )
        }
      />

      {/* 👇 View Summary Button (mobile only) */}
      {hasItems && (
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50 px-4">
          <Button onPress={onOpen} fullWidth>
            View Summary
          </Button>
        </div>
      )}
    </>
  );
}
