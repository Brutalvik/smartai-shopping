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
import {
  tabs,
  ProductTabsMap,
} from "@/components/seller/SellerDashboardClientPage";

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

  const sidebarItems = [
    {
      label: "Dashboard",
      icon: <PanelsTopLeft />,
      tabKey: "products",
      onClick: () => onTabChange?.(products),
    },
    {
      label: "Sales",
      icon: <ChartNoAxesCombined />,
      tabKey: "sales",
      onClick: () => onTabChange?.(sales),
    },
    {
      label: "Add Product",
      icon: <Plus />,
      tabKey: "upload",
      onClick: () => onTabChange?.(upload),
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
        {!collapsed && <span className="text-white">Overview</span>}
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
            "flex items-center gap-4 px-4 py-2 rounded-md transition-colors",
            {
              "hover:bg-white hover:text-[#151A2D]": !isActive,
              "bg-white text-[#151A2D]": isActive,
            }
          );

          return (
            <li key={item.label}>
              <button
                onClick={item.onClick}
                className={className}
                disabled={!item.onClick}
              >
                <span className="text-[20px]">{item.icon}</span>
                {!collapsed && (
                  <span className="whitespace-nowrap text-sm">
                    {item.label}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
