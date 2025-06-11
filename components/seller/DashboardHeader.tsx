"use client";

import React, { useState, useEffect } from "react";
import {
  Input,
  Select,
  SelectItem,
  Switch,
  Button,
  Accordion,
  AccordionItem,
} from "@heroui/react";
import { categories } from "@/data/categories";
import { Trash2, Plus } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface DashboardHeaderProps {
  onFiltersChange: (filters: {
    category?: string;
    isActive?: boolean;
    minPrice?: number;
    maxPrice?: number;
    searchKeyword?: string;
  }) => void;
  onBulkDelete: () => void;
  showBulkDelete: boolean;
  initialFilters: {
    category?: string;
    isActive?: boolean;
    minPrice?: number;
    maxPrice?: number;
    searchKeyword?: string;
  };
}

export default function DashboardHeader({
  onFiltersChange,
  onBulkDelete,
  showBulkDelete,
  initialFilters,
}: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [categoryFilter, setCategoryFilter] = useState(
    initialFilters.category || ""
  );
  const [isActiveFilter, setIsActiveFilter] = useState(initialFilters.isActive);
  const [minPriceFilter, setMinPriceFilter] = useState(initialFilters.minPrice);
  const [maxPriceFilter, setMaxPriceFilter] = useState(initialFilters.maxPrice);
  const [searchKeyword, setSearchKeyword] = useState(
    initialFilters.searchKeyword || ""
  );
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  useEffect(() => {
    const isActive =
      categoryFilter ||
      isActiveFilter !== undefined ||
      minPriceFilter !== undefined ||
      maxPriceFilter !== undefined ||
      searchKeyword;
    setFiltersExpanded(!!isActive);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (categoryFilter) params.set("category", categoryFilter);
    if (isActiveFilter !== undefined)
      params.set("isActive", String(isActiveFilter));
    if (minPriceFilter !== undefined)
      params.set("minPrice", String(minPriceFilter));
    if (maxPriceFilter !== undefined)
      params.set("maxPrice", String(maxPriceFilter));
    if (searchKeyword) params.set("q", searchKeyword);
    router.replace(`${pathname}?${params.toString()}`);
  }, [
    categoryFilter,
    isActiveFilter,
    minPriceFilter,
    maxPriceFilter,
    searchKeyword,
  ]);

  const handleFilterApply = () => {
    onFiltersChange({
      category: categoryFilter,
      isActive: isActiveFilter,
      minPrice: minPriceFilter,
      maxPrice: maxPriceFilter,
      searchKeyword,
    });
  };

  const handleClearFilters = () => {
    setCategoryFilter("");
    setIsActiveFilter(undefined);
    setMinPriceFilter(undefined);
    setMaxPriceFilter(undefined);
    setSearchKeyword("");
    onFiltersChange({
      category: "",
      isActive: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      searchKeyword: "",
    });
  };

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
        <h2 className="text-lg font-semibold">Product Management</h2>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
        <div className="flex gap-2 ">
          <Button
            color="success"
            variant="solid"
            startContent={<Plus size={18} />}
            onPress={() => router.push("/seller/upload")}
            className="h-[38px] px-4"
          >
            Add Product
          </Button>
          {showBulkDelete && (
            <Trash2 size={32} color="#c01c28" onClick={onBulkDelete} />
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mb-2">
        <h3
          className="text-md font-medium cursor-pointer select-none"
          onClick={() => setFiltersExpanded((prev) => !prev)}
        >
          {filtersExpanded ? "Hide Filters ▲" : "Show Filters ▼"}
        </h3>
      </div>

      <AnimatePresence initial={false}>
        {filtersExpanded && (
          <motion.div
            key="filters"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                size="sm"
                label="Search"
                labelPlacement="outside"
                placeholder="Title or description"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              <Select
                size="sm"
                label="Category"
                labelPlacement="outside"
                placeholder="All"
                selectedKeys={
                  categoryFilter ? new Set([categoryFilter]) : new Set([])
                }
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys).at(0);
                  setCategoryFilter(selectedKey ? String(selectedKey) : "");
                }}
              >
                {categories.map((cat) => (
                  <SelectItem key={cat.label}>{cat.label}</SelectItem>
                ))}
              </Select>
              <Input
                size="sm"
                label="Min Price"
                labelPlacement="outside"
                type="number"
                inputMode="decimal"
                placeholder="0.00"
                min="0"
                value={
                  minPriceFilter !== undefined ? String(minPriceFilter) : ""
                }
                onChange={(e) =>
                  setMinPriceFilter(parseFloat(e.target.value) || undefined)
                }
              />
              <Input
                size="sm"
                label="Max Price"
                labelPlacement="outside"
                type="number"
                inputMode="decimal"
                placeholder="0.00"
                min="0"
                value={
                  maxPriceFilter !== undefined ? String(maxPriceFilter) : ""
                }
                onChange={(e) =>
                  setMaxPriceFilter(parseFloat(e.target.value) || undefined)
                }
              />
            </div>

            <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  size="sm"
                  checked={isActiveFilter === true}
                  onChange={(e) =>
                    setIsActiveFilter(e.target.checked ? true : undefined)
                  }
                />
                <label className="text-sm">Active Only</label>
              </div>
              <div className="flex gap-2">
                <Button
                  onPress={handleFilterApply}
                  size="sm"
                  variant="solid"
                  color="primary"
                >
                  Apply
                </Button>
                <Button onPress={handleClearFilters} size="sm" variant="ghost">
                  Clear
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
