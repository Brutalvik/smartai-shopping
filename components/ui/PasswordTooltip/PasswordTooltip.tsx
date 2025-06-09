import { Tooltip } from "@heroui/react";
import React from "react";
import { FcInfo } from "react-icons/fc";

const PasswordTooltip = () => {
  return (
    <div className="flex items-center gap-1 text-xs">
      <span>Password instructions</span>
      <Tooltip
        content={
          <div className="px-2 py-1 text-xs">
            <ul className="list-disc pl-4">
              <li>Min 8 characters</li>
              <li>1 uppercase</li>
              <li>1 lowercase</li>
              <li>1 number</li>
            </ul>
          </div>
        }
      >
        <FcInfo size={17} className="cursor-pointer" />
      </Tooltip>
    </div>
  );
};

export default PasswordTooltip;
