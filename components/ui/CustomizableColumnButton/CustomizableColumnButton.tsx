"use client";

import { Button, Tooltip } from "@heroui/react";
import { Columns3, Columns3Cog } from "lucide-react";

interface CustomizableColumnButtonProps {
  onOpen: () => void;
  className?: string;
}

export default function CustomizableColumnButton({
  onOpen,
  className = "",
}: CustomizableColumnButtonProps) {
  return (
    <Tooltip content="Customize Columns">
      <Button
        variant="light"
        onPress={onOpen}
        startContent={<Columns3Cog size={16} />}
        className={className}
      />
    </Tooltip>
  );
}
