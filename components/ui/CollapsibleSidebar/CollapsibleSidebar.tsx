"use client";

import React, { useState } from "react";
import classNames from "classnames";
import {
  ChartNoAxesCombined,
  ChevronLeft,
  Menu,
  PanelsTopLeft,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { tabs, ProductTabsMap } from "@/components/seller/types";
import { AnimatePresence, motion } from "framer-motion";

export default function CollapsibleSidebar({
  onToggle,
  onTabChange,
  activeTab,
}: {
  onToggle?: (collapsed: boolean) => void;
  onTabChange?: (tab: keyof ProductTabsMap) => void;
  activeTab?: keyof ProductTabsMap;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const { products, sales, upload } = tabs;

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    if (onToggle) onToggle(next);
  };

  const handleTabClick = (tabKey: keyof ProductTabsMap) => {
    onTabChange?.(tabKey);
    router.push(`/seller/dashboard?tab=${tabKey}`);
  };

  const sidebarItems = [
    {
      label: "Dashboard",
      icon: <PanelsTopLeft />,
      tabKey: "products" as keyof ProductTabsMap,
    },
    {
      label: "Sales",
      icon: <ChartNoAxesCombined />,
      tabKey: "sales" as keyof ProductTabsMap,
    },
    {
      label: "Add Product",
      icon: <Plus />,
      tabKey: "upload" as keyof ProductTabsMap,
    },
  ];

  return (
    <aside
      className={classNames(
        "bg-white/10 text-default-500 backdrop-blur-md backdrop-saturate-150 transition-all duration-300 shadow-lg rounded-xl border border-white/20",
        collapsed ? "w-[60px]" : "w-[250px]",
        "h-full"
      )}
    >
      <div className="flex items-center justify-between px-4 py-4">
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              key="overview-label"
              className="text-white text-sm"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
            >
              Overview
            </motion.span>
          )}
        </AnimatePresence>

        <button
          className="bg-white text-[#151A2D] p-1.5 rounded hover:bg-gray-200"
          onClick={toggleCollapsed}
        >
          {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <ul className="flex flex-col gap-1 px-2">
        {sidebarItems.map((item) => {
          const isActive = activeTab === item.tabKey;
          const className = classNames(
            "flex items-center gap-4 px-2 py-2 rounded-md transition-colors",
            {
              "hover:bg-white hover:text-[#151A2D]": !isActive,
              "bg-white text-[#151A2D]": isActive,
            }
          );

          return (
            <li key={item.label}>
              <button
                onClick={() => handleTabClick(item.tabKey)}
                className={className}
              >
                <span className="text-[20px]">{item.icon}</span>
                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <motion.span
                      key={item.label}
                      className="whitespace-nowrap text-sm"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.15 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
