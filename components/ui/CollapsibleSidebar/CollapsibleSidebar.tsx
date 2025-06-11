"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import {
  ChartNoAxesCombined,
  ChevronLeft,
  Menu,
  PanelsTopLeft,
  Plus,
} from "lucide-react";
import Link from "next/link";

const sidebarItems = [
  { label: "Dashboard", icon: <PanelsTopLeft />, path: "/seller/products" },
  { label: "Analytics", icon: <ChartNoAxesCombined />, path: "/calendar" },
  { label: "Add Product", icon: <Plus />, path: "/seller/upload" },
];

export default function CollapsibleSidebar({
  onToggle,
}: {
  onToggle?: (collapsed: boolean) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    if (onToggle) onToggle(next);
  };
  const router = useRouter();

  return (
    <aside
      className={classNames(
        "bg-white/10 text-default-500 backdrop-blur-md backdrop-saturate-150 text-default transition-all duration-300 shadow-lg rounded-xl border border-white/20",
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
        {sidebarItems.map((item) => (
          <li key={item.label}>
            <Link
              href={item.path}
              className="flex items-center gap-4 px-4 py-2 hover:bg-white hover:text-[#151A2D] rounded-md transition-colors"
            >
              <span className="text-[20px]">{item.icon}</span>
              {!collapsed && (
                <span className="whitespace-nowrap text-sm">{item.label}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
