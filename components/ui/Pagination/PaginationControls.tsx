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
  pageSizes?: number[]; // optional
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

  return (
    <div className="flex flex-wrap justify-between items-center gap-4 border border-default-200 px-4 py-3 rounded-lg bg-white dark:bg-default-50 w-full">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="light"
          isDisabled={page === 1}
          onPress={() => setPage(page - 1)}
        >
          Previous
        </Button>
        <Button
          size="sm"
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

      <div className="flex items-center gap-3">
        <Select
          size="sm"
          label="Rows per page"
          selectedKeys={new Set([String(rowsPerPage)])}
          onSelectionChange={(keys) => {
            const selected = parseInt(String(Array.from(keys)[0]), 10);
            setRowsPerPage(selected);
            setPage(1); // reset to first page
          }}
          className="w-28"
        >
          {pageSizes.map((count) => (
            <SelectItem key={count}>{count}</SelectItem>
          ))}
        </Select>

        <Input
          size="sm"
          type="number"
          label="Go to page"
          value={goTo}
          onChange={(e) => setGoTo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGoTo()}
          className="w-24"
        />
        <Button size="sm" variant="flat" onPress={handleGoTo}>
          Go
        </Button>
      </div>
    </div>
  );
}
