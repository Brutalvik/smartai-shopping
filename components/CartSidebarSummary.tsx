// components/CartSidebarSummary.tsx
"use client";

import React from "react";
import { Button } from "@heroui/button";

interface CartSidebarSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currencySymbol?: string;
}

const CartSidebarSummary: React.FC<CartSidebarSummaryProps> = ({
  subtotal,
  shipping,
  tax,
  total,
  currencySymbol = "$",
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 p-6 shadow-lg rounded-xl w-full space-y-4 sticky top-[80px] lg:block hidden">
      <h2 className="text-xl font-semibold mb-4">Summary</h2>

      <div className="space-y-2 text-sm text-default-700">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>
            {currencySymbol}
            {subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>
            {shipping === 0 ? (
              <span className="text-success font-medium">FREE</span>
            ) : (
              `${currencySymbol}${shipping.toFixed(2)}`
            )}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Estimated Tax</span>
          <span>
            {currencySymbol}
            {tax.toFixed(2)}
          </span>
        </div>
        <hr className="my-2 border-default-200" />
        <div className="flex justify-between font-semibold text-default-900 text-base">
          <span>Total</span>
          <span>
            {currencySymbol}
            {total.toFixed(2)}
          </span>
        </div>
      </div>

      <Button color="primary" className="w-full mt-4">
        Proceed to Checkout
      </Button>
    </div>
  );
};

export default CartSidebarSummary;
