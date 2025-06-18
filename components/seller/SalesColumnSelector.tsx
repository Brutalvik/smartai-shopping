"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
} from "@heroui/react";
import { allColumns } from "@/components/seller/utils/utils";

interface SalesColumnSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedColumns: string[];
  setSelectedColumns: (columns: string[]) => void;
}

export default function SalesColumnSelector({
  isOpen,
  onClose,
  selectedColumns,
  setSelectedColumns,
}: SalesColumnSelectorProps) {
  const [tempSelection, setTempSelection] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setTempSelection(selectedColumns);
    }
  }, [isOpen, selectedColumns]);

  const handleCheckboxChange = (key: string) => {
    if (tempSelection.includes(key)) {
      setTempSelection(tempSelection.filter((k) => k !== key));
    } else {
      setTempSelection([...tempSelection, key]);
    }
  };

  const handleApply = () => {
    setSelectedColumns(tempSelection);
    onClose();
  };

  const handleResetColumns = () => {
    const mandatoryKeys = allColumns
      .filter((c) => c.mandatory)
      .map((c) => c.key);
    setSelectedColumns(mandatoryKeys);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      isDismissable={false}
      hideCloseButton
    >
      <ModalContent>
        <ModalHeader className="text-lg font-semibold">
          Select Visible Columns
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-2 gap-2">
            {allColumns.map(({ key, label, mandatory }) => (
              <Checkbox
                key={key}
                isSelected={tempSelection.includes(key)}
                isDisabled={mandatory}
                onChange={() => handleCheckboxChange(key)}
              >
                {label}
              </Checkbox>
            ))}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button variant="light" onPress={handleResetColumns}>
            Reset
          </Button>
          <Button color="primary" onPress={handleApply}>
            Apply
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
