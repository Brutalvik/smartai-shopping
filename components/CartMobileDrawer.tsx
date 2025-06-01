// components/CartMobileDrawer.tsx
"use client";

import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

interface CartMobileDrawerProps {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currencySymbol?: string;
}

const CartMobileDrawer: React.FC<CartMobileDrawerProps> = ({
  subtotal,
  shipping,
  tax,
  total,
  currencySymbol = "$",
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className="lg:hidden w-full">
      <Button onPress={onOpen} className="w-full sticky bottom-4 z-50">
        View Summary
      </Button>

      <Drawer isOpen={isOpen} size="full" onClose={onClose} placement="bottom">
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex justify-between items-center">
                <span className="text-lg font-semibold">Order Summary</span>
                <Button size="sm" variant="light" onPress={onClose}>
                  Close
                </Button>
              </DrawerHeader>
              <DrawerBody className="space-y-4 text-sm text-default-700">
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
                <hr className="border-default-200" />
                <div className="flex justify-between font-semibold text-default-900 text-base">
                  <span>Total</span>
                  <span>
                    {currencySymbol}
                    {total.toFixed(2)}
                  </span>
                </div>
              </DrawerBody>
              <DrawerFooter>
                <Button color="primary" className="w-full" onPress={onClose}>
                  Proceed to Checkout
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default CartMobileDrawer;
