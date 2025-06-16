"use client";

import React, { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/react";

interface PaginationControlsProps {
  page: number;
  setPage: (page: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (limit: number) => void;
  totalItems: number;
  pageSizes?: number[];
}

export default function PaginationControls({
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  totalItems,
  pageSizes = [10, 20, 50],
}: PaginationControlsProps) {
  const totalPages = Math.max(Math.ceil(totalItems / rowsPerPage), 1);
  const [goTo, setGoTo] = useState("");

  const handleGoTo = () => {
    const parsed = parseInt(goTo, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= totalPages) {
      setPage(parsed);
    }
    setGoTo("");
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-wrap justify-between items-center gap-3 border border-default-200  bg-default/50 rounded-md bg-default-50 w-full">
      <div className="flex items-center gap-2">
        <Button
          className="h-5 w-5 hover:color-primary"
          variant="light"
          isDisabled={page === 1}
          onPress={() => setPage(page - 1)}
        >
          Previous
        </Button>
        <Button
          className="h-5 w-5"
          variant="light"
          isDisabled={page === totalPages}
          onPress={() => setPage(page + 1)}
        >
          Next
        </Button>
        <span className="text-sm text-default-500">
          Page {page} of {totalPages}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-row gap-4 items-center justify-center">
          <label>Rows</label>
          <Select
            selectedKeys={new Set([String(rowsPerPage)])}
            onSelectionChange={(keys) => {
              const selected = parseInt(String(Array.from(keys)[0]), 10);
              if (!isNaN(selected)) {
                setRowsPerPage(selected);
                setPage(1); // reset page
              }
            }}
            className="h-10 w-24"
          >
            {pageSizes.map((count) => (
              <SelectItem key={count} textValue={count.toString()}>
                {count}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className="flex flex-row gap-4 items-center justify-center">
          <label>Go to page</label>
          <Input
            type="number"
            min={1}
            max={totalPages}
            value={goTo}
            onChange={(e) => setGoTo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGoTo()}
            className="h-10 w-24"
          />
        </div>
        <Button
          size="sm"
          variant="flat"
          onPress={handleGoTo}
          isDisabled={
            !goTo ||
            isNaN(Number(goTo)) ||
            Number(goTo) < 1 ||
            Number(goTo) > totalPages
          }
        >
          Go
        </Button>
      </div>
    </div>
  );
}
