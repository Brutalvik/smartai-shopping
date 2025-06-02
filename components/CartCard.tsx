// components/CartCard.tsx
"use client";

import React from "react";
import { Checkbox } from "@heroui/checkbox";
import { Button } from "@heroui/button";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

interface CartCardProps {
  imageUrl: string;
  name: string;
  description: string;
  inStock: boolean;
  seller: string;
  freeShipping: boolean;
  variant: string;
  quantity: number;
  price: number;
  productId: number;
  index?: number;
}

const CartCard: React.FC<CartCardProps> = ({
  imageUrl,
  name,
  description,
  inStock,
  seller,
  freeShipping,
  variant,
  quantity: initialQuantity,
  price,
  productId,
  index = 0,
}) => {
  const { updateQuantity, cartItems } = useCart();
  const item = cartItems.find((i) => i.productId === productId.toString());
  const quantity = item?.quantity ?? initialQuantity;

  const isDecrementDisabled = !inStock || quantity <= 1;
  const isIncrementDisabled = !inStock;

  const handleDecrement = () => {
    if (!isDecrementDisabled) updateQuantity(productId.toString(), -1);
  };

  const handleIncrement = () => {
    if (!isIncrementDisabled) updateQuantity(productId.toString(), 1);
  };

  return (
    <div
      style={{ animationDelay: `${index * 100}ms` }}
      className="animate-staggerFadeIn flex flex-col sm:flex-row w-full min-h-[20vh] p-4 shadow rounded-none border-b border-default-200 mb-4 transition-transform duration-300 ease-in-out"
    >
      {/* Left - Image */}
      <div className="w-full sm:w-[20%] flex items-center justify-center mb-4 sm:mb-0">
        <img
          src={imageUrl}
          alt={name}
          className="object-contain h-full w-auto rounded"
        />
      </div>

      {/* Middle - Info */}
      <div className="w-full sm:w-[65%] px-0 sm:px-4 flex flex-col justify-between">
        <div>
          <p className="text-lg font-semibold mb-1 line-clamp-1">{name}</p>
          <p className="text-sm text-default-600 line-clamp-2 leading-tight mb-1">
            {description}
          </p>
          <p
            className={
              inStock
                ? "text-success text-sm font-medium"
                : "text-danger text-sm font-medium"
            }
          >
            {inStock ? "In stock" : "Out of stock"}
          </p>
          <p className="text-sm text-default-600">Sold by {seller}</p>
          <p className="text-sm">
            {freeShipping ? (
              <span className="text-success">
                Eligible for <span className="uppercase font-medium">FREE</span>{" "}
                Shipping
              </span>
            ) : (
              "Shipping costs calculated at checkout"
            )}
          </p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Checkbox size="sm" className="mt-0.5" />
            <span className="text-sm text-default-600">
              This will be a gift.{" "}
              <Link href="#" className="text-primary underline text-sm">
                Learn more
              </Link>
            </span>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <p className="text-sm text-default-700">
            <span className="font-medium">Variant:</span> {variant}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <div
              className={`flex items-center border border-default-300 rounded ${quantity <= 0 && "bg-default-300"}`}
            >
              <Button
                size="sm"
                variant="light"
                className="px-3"
                onPress={handleDecrement}
                isDisabled={isDecrementDisabled}
              >
                -
              </Button>
              <span className="px-2 text-sm font-medium">{quantity}</span>
              <Button
                size="sm"
                variant="light"
                className="px-3"
                onPress={handleIncrement}
                isDisabled={isIncrementDisabled}
              >
                +
              </Button>
            </div>
            <div className="text-sm text-primary flex gap-2 flex-wrap">
              <Link href="#">Delete</Link>
              <span>|</span>
              <Link href="#">Save for later</Link>
              <span>|</span>
              <Link href="#">Share</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Price */}
      <div className="w-full sm:w-[15%] flex items-start justify-end text-xl font-bold text-foreground mt-4 sm:mt-0">
        ${price.toFixed(2)}
      </div>
    </div>
  );
};

export default CartCard;
