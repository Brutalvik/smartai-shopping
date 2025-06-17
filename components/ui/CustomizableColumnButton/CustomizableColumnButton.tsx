"use client";

import { Button, Tooltip } from "@heroui/react";
import { Columns3Cog } from "lucide-react";

interface CustomizableColumnButtonProps {
  onOpen: () => void;
  size?: number;
  className?: string;
}

export default function CustomizableColumnButton({
  onOpen,
  size = 26,
  className = "",
}: CustomizableColumnButtonProps) {
  return (
    <Tooltip content="Customize Columns">
      <Columns3Cog
        size={size}
        onClick={onOpen}
        className={`cursor-pointer ${className}`}
      />
    </Tooltip>
  );
}
