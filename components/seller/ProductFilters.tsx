"use client";

import React, { useState, useEffect } from "react";
import {
  Input,
  Select,
  SelectItem,
  Switch,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { categories } from "@/data/categories";
import { useRouter, usePathname } from "next/navigation";
import { ListFilterPlus } from "lucide-react";

interface ProductFiltersProps {
  onFiltersChange: (filters: {
    category?: string;
    isActive?: boolean;
    minPrice?: number;
    maxPrice?: number;
    searchKeyword?: string;
  }) => void;
  initialFilters: {
    category?: string;
    isActive?: boolean;
    minPrice?: number;
    maxPrice?: number;
    searchKeyword?: string;
  };
}

export default function ProductFilters({
  onFiltersChange,
  initialFilters,
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [categoryFilter, setCategoryFilter] = useState(
    initialFilters.category || ""
  );
  const [isActiveFilter, setIsActiveFilter] = useState(initialFilters.isActive);
  const [minPriceFilter, setMinPriceFilter] = useState(initialFilters.minPrice);
  const [maxPriceFilter, setMaxPriceFilter] = useState(initialFilters.maxPrice);
  const [searchKeyword, setSearchKeyword] = useState(
    initialFilters.searchKeyword || ""
  );

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
    onOpenChange();
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
    <>
      <ListFilterPlus className="cursor-pointer" onClick={() => onOpen()} />
      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-default text-lg font-semibold">
                Filters
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="flex items-center gap-2 mt-4">
                  <Switch
                    size="sm"
                    checked={isActiveFilter === true}
                    onChange={(e) =>
                      setIsActiveFilter(e.target.checked ? true : undefined)
                    }
                  />
                  <label className="text-sm text-default">Active Only</label>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  size="sm"
                  variant="ghost"
                  onPress={handleClearFilters}
                >
                  Clear
                </Button>
                <Button
                  color="primary"
                  size="sm"
                  variant="solid"
                  onPress={handleFilterApply}
                >
                  Apply
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
