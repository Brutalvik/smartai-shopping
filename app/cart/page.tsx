import React from "react";
import CartContainer from "@/components/CartContainer";
import CartSidebarSummary from "@/components/CartSidebarSummary";

export default function CartPage() {
  // Mock cart items data (you can replace this with real cart state from Redux, context, etc.)
  const hasItems = true; // change this to false to test empty state

  return (
    <CartContainer
      hasItems={hasItems}
      leftContent={
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow">
          <h2 className="text-2xl font-semibold mb-4">
            {hasItems ? "Your Shopping Cart" : "Your Cart is Empty"}
          </h2>
          {hasItems ? (
            <ul className="space-y-4">
              <li className="p-4 border rounded">Item 1</li>
              <li className="p-4 border rounded">Item 2</li>
              <li className="p-4 border rounded">Item 3</li>
            </ul>
          ) : (
            <p className="text-gray-500">You haven’t added anything yet.</p>
          )}
        </div>
      }
      rightContent={
        hasItems && (
          <CartSidebarSummary
            subtotal={1499}
            shipping={0}
            tax={112.43}
            total={1611.43}
            currencySymbol="$"
          />
        )
      }
    />
  );
}
