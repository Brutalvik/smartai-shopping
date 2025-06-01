// components/EmptyCart.tsx
"use client";

import Image from "next/image";
import { Button } from "@heroui/button";
import Link from "next/link";

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-white dark:bg-zinc-900 rounded-xl p-8 shadow-md w-full text-center">
      <div className="w-full max-w-md mb-6 animate-fadeIn">
        <Image
          src="/emptyCartImage.png"
          alt="Empty Cart"
          width={512}
          height={512}
          className="mx-auto animate-float"
        />
      </div>

      <h2 className="text-2xl font-bold mb-2 text-foreground">
        Your cart is empty
      </h2>
      <p className="text-default-500 mb-6">
        Looks like you haven’t added anything yet. Start exploring and add your
        favorite items to the cart.
      </p>

      <Link href="/shop">
        <Button color="primary" size="lg">
          Browse Products
        </Button>
      </Link>
    </div>
  );
};

export default EmptyCart;
