// components/seller/SortableHeader.tsx
"use client"; // If this component is used in a client-side environment like Next.js App Router

import React, { CSSProperties } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS as DndCSS } from "@dnd-kit/utilities";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { Column } from "@/components/seller/types"; // Make sure this path is correct

interface SortableHeaderProps {
  column: Column;
  index: number;
  sortColumn: number;
  sortDirection: "asc" | "desc";
  toggleSort: (index: number) => void;
  getColumnStyle: (index: number) => CSSProperties;
  onMouseDown: (e: React.MouseEvent, index: number) => void;
}

export const SortableHeader: React.FC<SortableHeaderProps> = ({
  column,
  index,
  sortColumn,
  sortDirection,
  toggleSort,
  getColumnStyle,
  onMouseDown,
}) => {
  // useSortable is called here, within a stable component
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.key });

  const mergedStyle: CSSProperties = {
    ...getColumnStyle(index),
    transform: DndCSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    position: "relative",
    boxSizing: "border-box",
    padding: "1rem",
    textAlign: "left",
    fontWeight: 600,
    fontSize: "0.875rem",
    whiteSpace: "nowrap",
    userSelect: "none",
    cursor: "pointer",
    borderRight: "1px solid var(--default-100, #e0e0e0)",
  };

  return (
    <th
      key={column.key}
      ref={setNodeRef}
      style={mergedStyle}
      {...attributes}
      {...listeners}
      onClick={() => toggleSort(index)}
      className="bg-default/50"
    >
      <div className="flex items-center gap-1">
        <span>{column.label}</span>
        {sortColumn === index ? (
          sortDirection === "asc" ? (
            <ArrowUp size={14} />
          ) : (
            <ArrowDown size={14} />
          )
        ) : (
          <ArrowUpDown size={14} className="text-default-400" />
        )}
      </div>
      <div
        className="absolute top-0 -right-1 h-full w-1.5 bg-transparent"
        style={{ cursor: "ew-resize" }}
        onMouseDown={(e) => onMouseDown(e, index)}
        onClick={(e) => e.stopPropagation()}
        onDragStart={(e) => e.preventDefault()}
      />
    </th>
  );
};
