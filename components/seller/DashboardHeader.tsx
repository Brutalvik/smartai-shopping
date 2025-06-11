"use client";

import React, { useState, useEffect } from "react";
import { Input, Select, SelectItem, Switch, Button } from "@heroui/react";
import { categories } from "@/data/categories";
import { Trash2, Plus } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const [categoryFilter, setCategoryFilter] = useState<string>(
    initialFilters.category || ""
  );
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>(
    initialFilters.isActive
  );
  const [minPriceFilter, setMinPriceFilter] = useState<number | undefined>(
    initialFilters.minPrice
  );
  const [maxPriceFilter, setMaxPriceFilter] = useState<number | undefined>(
    initialFilters.maxPrice
  );
  const [searchKeyword, setSearchKeyword] = useState<string>(
    initialFilters.searchKeyword || ""
  );

  useEffect(() => {
    setCategoryFilter(initialFilters.category || "");
    setIsActiveFilter(initialFilters.isActive);
    setMinPriceFilter(initialFilters.minPrice);
    setMaxPriceFilter(initialFilters.maxPrice);
    setSearchKeyword(initialFilters.searchKeyword || "");
  }, [initialFilters]);

  const handleFilterApply = () => {
    onFiltersChange({
      category: categoryFilter,
      isActive: isActiveFilter,
      minPrice: minPriceFilter,
      maxPrice: maxPriceFilter,
      searchKeyword: searchKeyword,
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchKeyword(value);
  };

  return (
    <div className="bg-white p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
      <h2 className="text-xl font-semibold">Product Management</h2>

      <div className="flex flex-wrap items-center gap-4">
        <Input
          label="Search Keyword"
          placeholder="Title or Description"
          value={searchKeyword}
          onChange={handleSearchChange}
          className="max-w-xs"
        />

        <Select
          label="Category"
          placeholder="All Categories"
          selectedKeys={
            categoryFilter ? new Set([categoryFilter]) : new Set([])
          }
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys).at(0);
            setCategoryFilter(selectedKey ? String(selectedKey) : "");
          }}
          className="max-w-xs"
        >
          {categories.map((cat) => (
            <SelectItem key={cat.label}>{cat.label}</SelectItem>
          ))}
        </Select>

        <Input
          label="Min Price"
          placeholder="e.g., 10.00"
          type="number"
          step="0.01"
          min="0"
          value={minPriceFilter !== undefined ? String(minPriceFilter) : ""}
          onChange={(e) =>
            setMinPriceFilter(parseFloat(e.target.value) || undefined)
          }
          className="w-32"
        />
        <Input
          label="Max Price"
          placeholder="e.g., 100.00"
          type="number"
          step="0.01"
          min="0"
          value={maxPriceFilter !== undefined ? String(maxPriceFilter) : ""}
          onChange={(e) =>
            setMaxPriceFilter(parseFloat(e.target.value) || undefined)
          }
          className="w-32"
        />

        <div className="flex items-center gap-2">
          <Switch
            checked={isActiveFilter === true}
            onChange={(e) =>
              setIsActiveFilter(e.target.checked ? true : undefined)
            }
          />
          <label className="text-sm">Active Only</label>
        </div>

        <Button onClick={handleFilterApply} color="primary" variant="solid">
          Apply Filters
        </Button>
        <Button onClick={handleClearFilters} variant="ghost">
          Clear Filters
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Button
          color="success"
          variant="solid"
          startContent={<Plus size={18} />}
          onPress={() => router.push("/seller/upload")}
        >
          Add New Product
        </Button>
        {showBulkDelete && (
          <Button
            color="danger"
            variant="solid"
            startContent={<Trash2 size={18} />}
            onPress={onBulkDelete}
          >
            Delete Selected
          </Button>
        )}
      </div>
    </div>
  );
}
