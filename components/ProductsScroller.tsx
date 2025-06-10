"use client";

import React, { useRef } from "react";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Image from "next/image";
import clsx from "clsx";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
}

interface ProductScrollerProps {
  products: Product[];
  className?: string;
}

const ProductScroller: React.FC<ProductScrollerProps> = ({
  products,
  className = "",
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    const isAtStart = el.scrollLeft <= 0;
    const isAtEnd = el.scrollLeft >= maxScrollLeft - 1;

    if (
      (direction === "left" && isAtStart) ||
      (direction === "right" && isAtEnd)
    ) {
      el.classList.add(
        direction === "left" ? "animate-bounce-right" : "animate-bounce-left"
      );
      setTimeout(() => {
        el.classList.remove("animate-bounce-left", "animate-bounce-right");
      }, 300);
    } else {
      el.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={clsx("relative w-full py-4 px-4 z-20 mt-0", className)}>
      {/* Left Chevron */}
      <button
        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
        onClick={() => scroll("left")}
      >
        <ChevronLeft size={24} />
      </button>

      {/* Right Chevron */}
      <button
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
        onClick={() => scroll("right")}
      >
        <ChevronRight size={24} />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto overflow-y-hidden px-8 scroll-smooth scrollbar-hide"
      >
        {products.map((product) => (
          <Card
            key={product.id}
            radius="lg"
            isHoverable
            shadow="lg"
            className="relative cursor-pointer w-[65vw] sm:w-[40vw] md:w-[28vw] lg:w-[18vw] h-[20vh] shrink-0 bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/30"
            classNames={{
              base: "transition-transform hover:scale-[1.03] shadow-lg hover:shadow-2xl",
              body: "relative flex items-center justify-center h-full",
              footer:
                "absolute bottom-2 left-0 right-0 flex justify-between items-center px-3",
            }}
          >
            <CardBody>
              <div className="w-full h-full p-[3px]">
                <Image
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                  width={500}
                  height={500}
                />
              </div>
            </CardBody>
            <CardFooter>
              <span className="text-white font-semibold text-sm bg-black/70 px-2 py-1 rounded-md">
                {product.price}
              </span>
              <button className="bg-green-500 text-white p-1 rounded-full hover:bg-green-600">
                <Plus size={16} />
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductScroller;
