"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  Input,
  Switch,
  useDisclosure,
} from "@heroui/react";
import { Filter, RefreshCw } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { motion } from "framer-motion";

const statusOptions = ["All", "Delivered", "Pending", "Returned"];

interface SalesFiltersProps {
  onFiltersChange: (filters: {
    status?: string;
    isReturnable?: boolean;
    minAmount?: number;
    maxAmount?: number;
    startDate?: string;
    endDate?: string;
  }) => void;
  initialFilters: {
    status?: string;
    isReturnable?: boolean;
    minAmount?: number;
    maxAmount?: number;
    startDate?: string;
    endDate?: string;
  };
  setActiveChips?: (chips: { label: string; onRemove: () => void }[]) => void;
}

export default function SalesFilters({
  onFiltersChange,
  initialFilters,
  setActiveChips,
}: SalesFiltersProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [status, setStatus] = useState(initialFilters.status || "All");
  const [isReturnable, setIsReturnable] = useState<boolean | undefined>(
    initialFilters.isReturnable
  );
  const [minAmount, setMinAmount] = useState<number | undefined>(
    initialFilters.minAmount
  );
  const [maxAmount, setMaxAmount] = useState<number | undefined>(
    initialFilters.maxAmount
  );
  const [startDate, setStartDate] = useState<Date | null>(
    initialFilters.startDate ? new Date(initialFilters.startDate) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    initialFilters.endDate ? new Date(initialFilters.endDate) : null
  );

  const chips: { label: string; onRemove: () => void }[] = [];

  const handleApply = () => {
    const filters = {
      status: status !== "All" ? status : undefined,
      isReturnable,
      minAmount,
      maxAmount,
      startDate: startDate ? startDate.toISOString() : undefined,
      endDate: endDate ? endDate.toISOString() : undefined,
    };
    onFiltersChange(filters);
    onOpenChange();
  };

  const handleClear = () => {
    setStatus("All");
    setIsReturnable(undefined);
    setMinAmount(undefined);
    setMaxAmount(undefined);
    setStartDate(null);
    setEndDate(null);
    onFiltersChange({});
    onOpenChange();
  };

  const setQuickDates = (range: "week" | "month" | "7") => {
    if (range === "week") {
      setStartDate(startOfWeek(new Date()));
      setEndDate(endOfWeek(new Date()));
    } else if (range === "month") {
      setStartDate(startOfMonth(new Date()));
      setEndDate(endOfMonth(new Date()));
    } else {
      setStartDate(subDays(new Date(), 7));
      setEndDate(new Date());
    }
  };

  const filters = {
    status: status !== "All" ? status : undefined,
    isReturnable,
    minAmount,
    maxAmount,
    startDate: startDate ? startDate.toISOString() : undefined,
    endDate: endDate ? endDate.toISOString() : undefined,
  };

  const activeChips = useMemo(() => {
    const chips: { label: string; onRemove: () => void }[] = [];

    if (status && status !== "All")
      chips.push({
        label: `Status: ${status}`,
        onRemove: () => {
          setStatus("All");
          onFiltersChange({
            ...filters,
            status: undefined,
          });
        },
      });

    if (minAmount !== undefined)
      chips.push({
        label: `Min: $${minAmount}`,
        onRemove: () => {
          setMinAmount(undefined);
          onFiltersChange({
            ...filters,
            minAmount: undefined,
          });
        },
      });

    if (maxAmount !== undefined)
      chips.push({
        label: `Max: $${maxAmount}`,
        onRemove: () => {
          setMaxAmount(undefined);
          onFiltersChange({
            ...filters,
            maxAmount: undefined,
          });
        },
      });

    if (startDate)
      chips.push({
        label: `From: ${startDate.toLocaleDateString()}`,
        onRemove: () => {
          setStartDate(null);
          onFiltersChange({
            ...filters,
            startDate: undefined,
          });
        },
      });

    if (endDate)
      chips.push({
        label: `To: ${endDate.toLocaleDateString()}`,
        onRemove: () => {
          setEndDate(null);
          onFiltersChange({
            ...filters,
            endDate: undefined,
          });
        },
      });

    if (isReturnable)
      chips.push({
        label: "Returnable Only",
        onRemove: () => {
          setIsReturnable(undefined);
          onFiltersChange({
            ...filters,
            isReturnable: undefined,
          });
        },
      });

    return chips;
  }, [status, minAmount, maxAmount, startDate, endDate, isReturnable]);

  useEffect(() => {
    if (setActiveChips) setActiveChips(activeChips);
  }, [activeChips]);

  return (
    <>
      <div className="flex flex-wrap gap-2 items-center">
        <Button
          isIconOnly
          variant="flat"
          size="sm"
          onPress={() => onOpen()}
          aria-label="Filter Sales"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        backdrop="blur"
        size="md"
        className="max-w-[95vw] sm:max-w-[600px]"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
        >
          <ModalContent className="p-1">
            {(onClose) => (
              <>
                <ModalHeader className="text-default text-lg font-semibold">
                  <Filter className="inline mr-2 mb-1 h-4 w-4" />
                  Sales Filters
                </ModalHeader>

                <ModalBody className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-row items-center gap-4">
                      <label className="items-start">Status</label>
                      <Select
                        className="w-28 h-10"
                        selectedKeys={new Set([status])}
                        onSelectionChange={(keys) => {
                          const selected = String(Array.from(keys)[0] || "All");
                          setStatus(selected);
                        }}
                      >
                        {statusOptions.map((option) => (
                          <SelectItem key={option}>{option}</SelectItem>
                        ))}
                      </Select>
                    </div>

                    <div className="flex flex-col min-w-0">
                      <label className="text-sm text-default mb-1">
                        Start Date
                      </label>
                      <DatePicker
                        selected={startDate}
                        onChange={(date: Date | null) => setStartDate(date)}
                        placeholderText="Start date"
                        className="px-3 py-2 rounded-md border border-default-200  text-sm"
                      />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <label className="text-sm text-default mb-1">
                        End Date
                      </label>
                      <DatePicker
                        selected={endDate}
                        onChange={(date: Date | null) => setEndDate(date)}
                        placeholderText="End date"
                        className="px-3 py-2 rounded-md border border-default-200 bg-transparent text-sm"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button size="sm" onPress={() => setQuickDates("7")}>
                        Last 7 Days
                      </Button>
                      <Button size="sm" onPress={() => setQuickDates("week")}>
                        This Week
                      </Button>
                      <Button size="sm" onPress={() => setQuickDates("month")}>
                        This Month
                      </Button>
                    </div>

                    <Input
                      type="number"
                      label="Min Amount"
                      value={minAmount !== undefined ? String(minAmount) : ""}
                      onChange={(e) =>
                        setMinAmount(parseFloat(e.target.value) || undefined)
                      }
                    />
                    <Input
                      type="number"
                      label="Max Amount"
                      value={maxAmount !== undefined ? String(maxAmount) : ""}
                      onChange={(e) =>
                        setMaxAmount(parseFloat(e.target.value) || undefined)
                      }
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <Switch
                      size="sm"
                      checked={isReturnable === true}
                      onChange={(e) =>
                        setIsReturnable(e.target.checked ? true : undefined)
                      }
                    />
                    <label className="text-sm text-default">
                      Returnable Only
                    </label>
                  </div>
                </ModalBody>

                <ModalFooter className="pt-3">
                  <Button variant="ghost" onPress={handleClear}>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                  <Button color="primary" onPress={handleApply}>
                    Apply
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </motion.div>
      </Modal>
    </>
  );
}
