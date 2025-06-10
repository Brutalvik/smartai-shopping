"use client";

import { Input } from "@heroui/input";
import React from "react";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Search...",
  className = "",
  ariaLabel = "Search",
}) => {
  return (
    <Input
      aria-label={ariaLabel}
      className={className}
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      labelPlacement="outside"
      placeholder={placeholder}
      type="search"
    />
  );
};

export default SearchInput;
