"use client";

import { Button } from "@heroui/button";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import clsx from "clsx";

const categories = [
  "Xyvo Elite",
  "Best Sellers",
  "Electronics",
  "Deals Store",
  "New Releases",
  "Home",
  "Books",
  "Fashion",
  "Sports & Outdoors",
  "Home Improvement",
  "Toys & Games",
  "Music",
  "Health & Household",
  "Discover Canada Showcase",
];

export default function SubNavbar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [visibleItems, setVisibleItems] = useState<string[]>([]);
  const [overflowItems, setOverflowItems] = useState<string[]>([]);

  const calculate = () => {
    const container = containerRef.current;
    if (!container) return;

    // Temporarily show all items to measure widths
    for (const category of categories) {
      const el = itemRefs.current[category];
      if (el) el.style.display = "inline-flex";
    }

    const containerWidth = container.offsetWidth;
    let totalWidth = 0;
    const newVisible: string[] = [];
    const newOverflow: string[] = [];

    for (const category of categories) {
      const el = itemRefs.current[category];
      if (!el) continue;

      const itemWidth = el.offsetWidth + 12; // include margin
      if (totalWidth + itemWidth + 120 < containerWidth) {
        totalWidth += itemWidth;
        newVisible.push(category);
      } else {
        newOverflow.push(category);
      }
    }

    // Now re-hide overflow items
    for (const category of categories) {
      const el = itemRefs.current[category];
      if (el)
        el.style.display = newOverflow.includes(category)
          ? "none"
          : "inline-flex";
    }

    setVisibleItems(newVisible);
    setOverflowItems(newOverflow);
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        setTimeout(calculate, 0); // ensures layout settles
      });
    });

    const handleWindowResize = () => {
      requestAnimationFrame(() => {
        setTimeout(calculate, 0);
      });
    };

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", handleWindowResize);
    setTimeout(calculate, 100); // initial render after layout

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <div className="w-full z-40 backdrop-blur-sm text-default-7 00 text-sm border-b border-white/10">
      <div className="w-full">
        <div
          ref={containerRef}
          className="flex items-center gap-3 py-2 pl-2 pr-6 w-full flex-nowrap"
        >
          {/* ALL Button */}
          <Button
            variant="ghost"
            size="sm"
            onPress={() => {
              // TODO: Drawer trigger
              console.log("Open drawer");
            }}
            className="flex items-center gap-1 font-semibold shrink-0"
          >
            <span className="text-xl">☰</span> All
          </Button>

          {/* Nav Items */}
          {categories.map((category) => {
            const isElite = category === "Xyvo Elite";
            const isHidden = overflowItems.includes(category);

            return (
              <button
                key={category}
                ref={(el) => {
                  itemRefs.current[category] = el;
                }}
                className={clsx(
                  "nav-item whitespace-nowrap px-2 py-1 font-medium transition duration-200 shrink-0",
                  isHidden && "hidden",
                  isElite
                    ? "text-yellow-300 font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent drop-shadow hover:scale-105"
                    : "hover:text-yellow-200"
                )}
              >
                {category}
                {isElite && <span className="ml-1">✨</span>}
                {isElite && (
                  <ChevronDown className="inline w-4 h-4 ml-1 text-yellow-400" />
                )}
              </button>
            );
          })}

          {/* More Dropdown */}
          {overflowItems.length > 0 && (
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 text-default-500 font-medium hover:text-blue-200 shrink-0"
                >
                  More <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="More categories"
                className="text-left text-default-500"
              >
                {overflowItems.map((item) => (
                  <DropdownItem
                    key={item}
                    className="text-left text-default-500 text-sm"
                  >
                    {item}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
      </div>
    </div>
  );
}
