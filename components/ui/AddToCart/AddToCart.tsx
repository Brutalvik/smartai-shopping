// components/ui/AddToCartButton.tsx
"use client";

import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import clsx from "clsx";

interface AddToCartButtonProps {
  itemId?: string;
  onPress: (id: string) => void;
  color?: "yellow" | "blue" | "green" | "red";
}

const colorMap: Record<string, string> = {
  yellow: "bg-yellow-400 text-black",
  blue: "bg-blue-500 text-white",
  green: "bg-green-500 text-white",
  red: "bg-red-500 text-white",
};

export default function AddToCartButton({
  itemId,
  onPress,
  color = "yellow",
}: AddToCartButtonProps) {
  const buttonColor = colorMap[color];

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => onPress(itemId as string)}
      className={clsx(
        "w-36 h-10 rounded-xl border-none flex items-center justify-center cursor-pointer transition-all overflow-hidden shadow-md relative group",
        buttonColor
      )}
    >
      <span
        className={clsx(
          "absolute left-[-50px] w-[30px] h-[30px] flex items-center justify-center rounded-full transition-all duration-500 group-hover:translate-x-[58px]"
        )}
      >
        <ShoppingCart size={18} />
      </span>
      <span className="z-10 font-semibold text-sm transition-all duration-500 group-hover:translate-x-2">
        Add to Cart
      </span>
    </motion.button>
  );
}
