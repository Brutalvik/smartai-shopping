"use client";

import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
} from "@heroui/react";
import { useCart } from "@/context/CartContext";

interface CartMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartMobileDrawer({
  isOpen,
  onClose,
}: CartMobileDrawerProps) {
  const { subtotal, shipping, tax, total } = useCart();

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="md">
      <DrawerContent>
        {(onCloseInternal) => (
          <>
            <DrawerHeader className="text-lg font-bold">
              Order Summary
            </DrawerHeader>
            <DrawerBody>
              <div className="space-y-3 text-sm text-default-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-success font-semibold uppercase">
                        FREE
                      </span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <hr className="my-2 border-default-200" />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </DrawerBody>
            <DrawerFooter>
              <Button fullWidth color="primary" onPress={onClose}>
                Proceed to Checkout
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
