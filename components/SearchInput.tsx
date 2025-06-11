"use client";

import { Input } from "@heroui/input";
import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
  autoFocus?: boolean;
  isMobile?: boolean; // optionally detect mobile
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Search...",
  className = "",
  ariaLabel = "Search",
  autoFocus = false,
  isMobile = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const shouldExpand = isFocused || value.length > 0 || autoFocus;

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const inputElement = (
    <Input
      ref={inputRef}
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
  );

  if (isMobile) {
    // Floating overlay-style input (right-to-left grow)
    return (
      <div className="relative w-0 transition-all duration-300 ease-in-out">
        <div
          className={clsx(
            "absolute right-0 transition-all duration-300 ease-in-out z-50",
            shouldExpand ? "w-[240px]" : "w-0 overflow-hidden"
          )}
        >
          {inputElement}
        </div>
      </div>
    );
  }

  // Default desktop inline behavior
  return (
    <div
      className={clsx(
        "transition-all duration-300 ease-in-out origin-right",
        "w-full",
        "lg:w-[300px]",
        shouldExpand && "lg:w-[440px]",
        className
      )}
      style={{ transformOrigin: "right" }}
    >
      {inputElement}
    </div>
  );
};

export default SearchInput;
