import React from "react";
import CartContainer from "@/components/CartContainer";
import CartSidebarSummary from "@/components/CartSidebarSummary";
import CartMobileDrawer from "@/components/CartMobileDrawer";
import { dummyCartItems } from "@/data/dummyItems";
import CartCard from "@/components/CartCard";
import EmptyCart from "@/components/EmptyCart";

export default function CartPage() {
  // Mock cart items data (you can replace this with real cart state from Redux, context, etc.)
  const hasItems = false; // change this to false to test empty state

  return (
    <CartContainer
      hasItems={hasItems}
      leftContent={
        hasItems ? (
          dummyCartItems.map((item) => (
            <CartCard key={item.productId} {...item} />
          ))
        ) : (
          <EmptyCart />
        )
      }
      rightContent={
        hasItems && (
          <>
            <CartSidebarSummary
              subtotal={1499}
              shipping={0}
              tax={112.43}
              total={1611.43}
              currencySymbol="$"
            />
            <CartMobileDrawer
              subtotal={1499}
              shipping={0}
              tax={112.43}
              total={1611.43}
              currencySymbol="$"
            />
          </>
        )
      }
    />
  );
}
