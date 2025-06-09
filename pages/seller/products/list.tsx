// pages/seller/products/list.tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Select, SelectItem, Switch } from "@heroui/react";
import { addToast } from "@heroui/react";
import { CDN } from "@/config/config";
import { categories } from "@/data/categories";
import { Loader2 } from "lucide-react";

interface Product {
  productId: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  tags: string[];
  images: string[];
  isActive: boolean;
  createdAt: string;
}

interface FetchProductsResponse {
  products: Product[];
  lastEvaluatedKey?: Record<string, any>;
}

export default function SellerProductsListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState<
    Record<string, any> | undefined
  >(undefined);
  const [initialLoad, setInitialLoad] = useState(true);

  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>(
    undefined
  );
  const [minPriceFilter, setMinPriceFilter] = useState<number | undefined>(
    undefined
  );
  const [maxPriceFilter, setMaxPriceFilter] = useState<number | undefined>(
    undefined
  );
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchProducts = useCallback(
    async (
      loadMore: boolean = false,
      newFiltersApplied: boolean = false,
      currentLastEvaluatedKey: Record<string, any> | undefined = undefined
    ) => {
      setLoading(true);

      if (newFiltersApplied) {
        setProducts([]);
        setLastEvaluatedKey(undefined);
        setHasMore(true);
        currentLastEvaluatedKey = undefined;
      }

      const queryParams = new URLSearchParams();
      if (loadMore && currentLastEvaluatedKey) {
        queryParams.append(
          "lastEvaluatedKey",
          JSON.stringify(currentLastEvaluatedKey)
        );
      }
      queryParams.append("limit", "10");

      if (categoryFilter) {
        queryParams.append("category", categoryFilter);
      }
      if (isActiveFilter !== undefined) {
        queryParams.append("isActive", String(isActiveFilter));
      }
      if (minPriceFilter !== undefined && !isNaN(minPriceFilter)) {
        queryParams.append("minPrice", String(minPriceFilter));
      }
      if (maxPriceFilter !== undefined && !isNaN(maxPriceFilter)) {
        queryParams.append("maxPrice", String(maxPriceFilter));
      }
      if (searchKeyword) {
        queryParams.append("q", searchKeyword);
      }

      try {
        const response = await fetch(
          `${CDN.sellerProductsApi}/seller/products?${queryParams.toString()}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const result: FetchProductsResponse = await response.json();

        if (!response.ok) {
          throw new Error(
            (result as any).error ||
              (result as any).message ||
              "Failed to fetch products"
          );
        }

        setProducts((prevProducts) =>
          loadMore ? [...prevProducts, ...result.products] : result.products
        );
        setLastEvaluatedKey(result.lastEvaluatedKey);
        setHasMore(!!result.lastEvaluatedKey);
      } catch (error: any) {
        addToast({
          description: `Error fetching products: ${error.message}`,
          color: "danger",
          timeout: 5000,
        });
        console.error("Error fetching products:", error);
        setHasMore(false);
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    },
    [
      categoryFilter,
      isActiveFilter,
      minPriceFilter,
      maxPriceFilter,
      searchKeyword,
    ]
  );

  useEffect(() => {
    fetchProducts(false, true);
  }, [fetchProducts]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchProducts(true, false, lastEvaluatedKey);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchKeyword(value);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      fetchProducts(false, true);
    }, 500);
  };

  useEffect(() => {
    if (!initialLoad) {
      fetchProducts(false, true);
    }
  }, [
    categoryFilter,
    isActiveFilter,
    minPriceFilter,
    maxPriceFilter,
    initialLoad,
    fetchProducts,
  ]);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Your Products</h1>

      <Card className="mb-8 p-6 flex flex-wrap gap-4 items-end justify-center">
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

        <div className="flex gap-4 items-end">
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
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={isActiveFilter === true}
            onChange={(e) =>
              setIsActiveFilter(e.target.checked ? true : undefined)
            }
          />
          <label className="text-sm">Active Only</label>
        </div>

        <Button
          onClick={() => {
            setCategoryFilter("");
            setIsActiveFilter(undefined);
            setMinPriceFilter(undefined);
            setMaxPriceFilter(undefined);
            setSearchKeyword("");
            if (searchTimeoutRef.current)
              clearTimeout(searchTimeoutRef.current);
            fetchProducts(false, true);
          }}
          variant="ghost"
        >
          Clear Filters
        </Button>
      </Card>

      {loading && products.length === 0 && (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-lg">Loading products...</span>
        </div>
      )}

      {!loading && products.length === 0 && !initialLoad && (
        <div className="text-center text-gray-600 text-lg mt-10">
          No products found for this seller with the current filters.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.productId} className="flex flex-col h-full">
            <CardHeader className="relative h-48 w-full overflow-hidden rounded-t-lg">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500 text-sm">
                  No Image
                </div>
              )}
            </CardHeader>
            <CardBody className="flex-grow p-4">
              <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                {product.title}
              </h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-3">
                {product.description}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xl font-bold text-blue-600">
                  ${product.price.toFixed(2)}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    product.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {product.isActive ? "Active" : "Draft"}
                </span>
              </div>
            </CardBody>
            <CardFooter className="p-4 pt-0">
              <Button variant="ghost" className="w-full">
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-8">
          <Button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-6 py-3"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading
                More...
              </>
            ) : (
              "Load More Products"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
