"use client";

import { Input } from "@heroui/input";
import React, { useState } from "react";
import clsx from "clsx";

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
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");

  const shouldExpand = isFocused || value.length > 0;

  return (
    <div
      className={clsx(
        "transition-all duration-300 ease-in-out",
        "w-full",
        "lg:w-[200px]",
        shouldExpand && "lg:w-[340px]",
        className
      )}
    >
      <Input
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        classNames={{
          inputWrapper: "bg-default-100",
          input: "text-sm",
        }}
        labelPlacement="outside"
        placeholder={placeholder}
        type="search"
      />
    </div>
  );
};

export default SearchInput;
