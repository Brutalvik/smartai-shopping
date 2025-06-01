// components/CartContainer.tsx
"use client";

import React from "react";

interface CartContainerProps {
  leftContent: React.ReactNode;
  rightContent?: React.ReactNode;
  hasItems?: boolean;
}

const CartContainer: React.FC<CartContainerProps> = ({
  leftContent,
  rightContent,
  hasItems = false,
}) => {
  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen gap-4 p-4">
      {/* Left side - cart items or main content */}
      <div className={hasItems ? "w-full lg:w-[80%]" : "w-full lg:w-[70%]"}>
        {leftContent}
      </div>

      {/* Right side - summary or additional info */}
      {rightContent && (
        <div className="hidden lg:block w-full lg:w-[30%]">{rightContent}</div>
      )}
    </div>
  );
};

export default CartContainer;
