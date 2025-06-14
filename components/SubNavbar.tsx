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
  "Electronics",
  "Deals Store",
  "Fashion",
  "Sports & Outdoors",
  "Home Improvement",
  "Toys & Games",
  "Music",
  "Health ",
  "Household",
  "Camping",
  "Discover",
];

export default function SubNavbar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [visibleItems, setVisibleItems] = useState<string[]>([]);
  const [overflowItems, setOverflowItems] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const calculate = () => {
    const container = containerRef.current;
    if (!container) return;

    for (const category of categories) {
      const el = itemRefs.current[category];
      if (el) el.style.display = "inline-flex";
    }

    if (isMobile) {
      const newVisible = categories.slice(0, 2);
      const newOverflow = categories.slice(2);

      for (const category of categories) {
        const el = itemRefs.current[category];
        if (el)
          el.style.display = newOverflow.includes(category)
            ? "none"
            : "inline-flex";
      }

      setVisibleItems(newVisible);
      setOverflowItems(newOverflow);
      return;
    }

    const containerWidth = container.offsetWidth;
    let totalWidth = 0;
    const newVisible: string[] = [];
    const newOverflow: string[] = [];

    let moreButtonWidth = 0;
    const moreButtonEl = container.querySelector(
      ".more-button-placeholder"
    ) as HTMLElement;
    if (moreButtonEl) {
      moreButtonWidth = moreButtonEl.offsetWidth + 12;
    } else {
      moreButtonWidth = 120;
    }

    const allButtonEl = container.querySelector(
      ".all-button-placeholder"
    ) as HTMLElement;
    let allButtonWidth = 0;
    if (allButtonEl) {
      allButtonWidth = allButtonEl.offsetWidth + 12;
    } else {
      allButtonWidth = 60;
    }

    totalWidth += allButtonWidth;

    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      const el = itemRefs.current[category];
      if (!el) continue;

      const itemWidth = el.offsetWidth + 12;

      const remainingContainerWidth = containerWidth - totalWidth;

      const willNeedMoreButtonSpace =
        newOverflow.length > 0 ||
        (i === categories.length - 1 &&
          remainingContainerWidth < itemWidth + moreButtonWidth) ||
        (i === categories.length - 2 &&
          remainingContainerWidth <
            itemWidth +
              (itemRefs.current[categories[i + 1]]?.offsetWidth || 0) +
              12 +
              moreButtonWidth);

      if (
        totalWidth +
          itemWidth +
          (willNeedMoreButtonSpace ? moreButtonWidth : 0) <=
        containerWidth
      ) {
        newVisible.push(category);
        totalWidth += itemWidth;
      } else {
        newOverflow.push(category);
      }
    }

    let itemsToForceIntoOverflow = isMobile ? 2 : 1;
    while (
      newVisible.length > 1 &&
      newOverflow.length < itemsToForceIntoOverflow
    ) {
      const lastVisibleCategory = newVisible.pop();
      if (lastVisibleCategory) {
        newOverflow.unshift(lastVisibleCategory);
      } else {
        break;
      }
    }

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
        setTimeout(calculate, 0);
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
    setTimeout(calculate, 100);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [isMobile]);

  return (
    <div className="w-full z-40 backdrop-blur-sm text-default-700 text-sm border-b border-white/10">
      <div className="w-full overflow-x-auto">
        <div
          ref={containerRef}
          className="flex items-center gap-3 py-2 px-5 w-full flex-nowrap whitespace-nowrap"
        >
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 font-semibold shrink-0 all-button-placeholder"
          >
            <span className="text-xl">☰</span> All
          </Button>

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
                    : "hover:text-blue-400"
                )}
              >
                {category}
                {isElite && (
                  <ChevronDown className="inline w-4 h-4 ml-1 text-yellow-400" />
                )}
              </button>
            );
          })}

          {overflowItems.length > 0 && (
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 text-default-500 font-medium hover:text-blue-200 shrink-0 more-button-placeholder"
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
