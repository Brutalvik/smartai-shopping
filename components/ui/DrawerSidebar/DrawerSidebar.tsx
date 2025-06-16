"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Button,
} from "@heroui/react";
import { Menu, PanelsTopLeft, ChartNoAxesCombined, Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductTabsMap } from "@/components/seller/types";
import classNames from "classnames";
import { useEffect } from "react";

const drawerMenuItems = [
  {
    label: "Dashboard",
    icon: <PanelsTopLeft size={20} />,
    tabKey: "products" as keyof ProductTabsMap,
  },
  {
    label: "Sales",
    icon: <ChartNoAxesCombined size={20} />,
    tabKey: "sales" as keyof ProductTabsMap,
  },
  {
    label: "Add Product",
    icon: <Plus size={20} />,
    tabKey: "upload" as keyof ProductTabsMap,
  },
];

export default function DrawerSidebar({
  activeTab,
  onTabChange,
}: {
  activeTab: keyof ProductTabsMap;
  onTabChange: (tab: keyof ProductTabsMap) => void;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabClick = (tabKey: keyof ProductTabsMap) => {
    const newParams = new URLSearchParams(searchParams?.toString());
    newParams.set("tab", tabKey);
    router.push(`/seller/dashboard?${newParams.toString()}`);
    onTabChange(tabKey);
    onOpenChange();
  };

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isOpen]);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-4 right-4 z-50 md:hidden">
        <Button
          isIconOnly
          variant="shadow"
          className="rounded-full bg-white text-black shadow-lg"
          onPress={onOpen}
        >
          <Menu size={24} />
        </Button>
      </div>

      {/* Drawer Content */}
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} placement="left">
        <DrawerContent className="w-[250px] bg-background">
          <DrawerHeader className="text-lg font-bold">Menu</DrawerHeader>
          <DrawerBody>
            <ul className="flex flex-col gap-1 px-2">
              {drawerMenuItems.map((item) => {
                const isActive = activeTab === item.tabKey;
                const itemClass = classNames(
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
                      className={itemClass}
                    >
                      <span>{item.icon}</span>
                      <span className="whitespace-nowrap text-sm">
                        {item.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
