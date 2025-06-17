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
  Tooltip,
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
  setActiveChips?: (chips: { label: string; onRemove: () => void }[]) => void; // 👈 add this
}

export default function ProductFilters({
  onFiltersChange,
  initialFilters,
  setActiveChips,
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

  const handleFilterApply = () => {
    const params = new URLSearchParams();
    if (categoryFilter) params.set("category", categoryFilter);
    if (isActiveFilter !== undefined)
      params.set("isActive", String(isActiveFilter));
    if (minPriceFilter !== undefined)
      params.set("minPrice", String(minPriceFilter));
    if (maxPriceFilter !== undefined)
      params.set("maxPrice", String(maxPriceFilter));
    if (searchKeyword) params.set("search", searchKeyword);

    router.replace(`${pathname}?${params.toString()}`);

    onFiltersChange({
      category: categoryFilter,
      isActive: isActiveFilter,
      minPrice: minPriceFilter,
      maxPrice: maxPriceFilter,
      searchKeyword,
    });

    const chips: { label: string; onRemove: () => void }[] = [];

    if (searchKeyword)
      chips.push({
        label: `Search: ${searchKeyword}`,
        onRemove: () => {
          setSearchKeyword("");
          onFiltersChange({ ...initialFilters, searchKeyword: "" });
        },
      });

    if (categoryFilter)
      chips.push({
        label: `Category: ${categoryFilter}`,
        onRemove: () => {
          setCategoryFilter("");
          onFiltersChange({ ...initialFilters, category: "" });
        },
      });

    if (minPriceFilter !== undefined)
      chips.push({
        label: `Min: $${minPriceFilter}`,
        onRemove: () => {
          setMinPriceFilter(undefined);
          onFiltersChange({ ...initialFilters, minPrice: undefined });
        },
      });

    if (maxPriceFilter !== undefined)
      chips.push({
        label: `Max: $${maxPriceFilter}`,
        onRemove: () => {
          setMaxPriceFilter(undefined);
          onFiltersChange({ ...initialFilters, maxPrice: undefined });
        },
      });

    if (isActiveFilter)
      chips.push({
        label: "Active Only",
        onRemove: () => {
          setIsActiveFilter(undefined);
          onFiltersChange({ ...initialFilters, isActive: undefined });
        },
      });

    setActiveChips?.(chips);

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
    onOpenChange();
  };

  useEffect(() => {
    const chips: { label: string; onRemove: () => void }[] = [];

    if (searchKeyword)
      chips.push({
        label: `Search: ${searchKeyword}`,
        onRemove: () => {
          setSearchKeyword("");
          onFiltersChange({
            ...initialFilters,
            searchKeyword: "",
          });
        },
      });

    if (categoryFilter)
      chips.push({
        label: `Category: ${categoryFilter}`,
        onRemove: () => {
          setCategoryFilter("");
          onFiltersChange({
            ...initialFilters,
            category: "",
          });
        },
      });

    if (minPriceFilter !== undefined)
      chips.push({
        label: `Min: $${minPriceFilter}`,
        onRemove: () => {
          setMinPriceFilter(undefined);
          onFiltersChange({
            ...initialFilters,
            minPrice: undefined,
          });
        },
      });

    if (maxPriceFilter !== undefined)
      chips.push({
        label: `Max: $${maxPriceFilter}`,
        onRemove: () => {
          setMaxPriceFilter(undefined);
          onFiltersChange({
            ...initialFilters,
            maxPrice: undefined,
          });
        },
      });

    if (isActiveFilter)
      chips.push({
        label: "Active Only",
        onRemove: () => {
          setIsActiveFilter(undefined);
          onFiltersChange({
            ...initialFilters,
            isActive: undefined,
          });
        },
      });

    if (setActiveChips) setActiveChips(chips);
  }, [
    categoryFilter,
    isActiveFilter,
    minPriceFilter,
    maxPriceFilter,
    searchKeyword,
  ]);

  return (
    <>
      <Tooltip content="Product filters">
        <ListFilterPlus
          className="cursor-pointer text-default-500 hover:text-primary"
          strokeWidth={1.75}
          onClick={() => onOpen()}
          size={26}
        />
      </Tooltip>
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
