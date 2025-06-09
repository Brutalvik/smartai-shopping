import { Tooltip } from "@heroui/react";
import React from "react";
import { FcInfo } from "react-icons/fc";

const ForwardedFcInfo = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>((props, ref) => (
  <span {...props} ref={ref}>
    <FcInfo className="text-lg text-default-400 cursor-pointer" />
  </span>
));

const PasswordTooltip = () => {
  return (
    <div className="flex items-center gap-1 text-xs">
      <span>Password instructions</span>
      <Tooltip
        content={
          <div className="px-2 py-1 text-xs">
            <ul className="list-disc pl-4">
              <li>Min 8 characters</li>
              <li>1 special character</li>
              <li>1 uppercase</li>
              <li>1 lowercase</li>
              <li>1 number</li>
            </ul>
          </div>
        }
      >
        <ForwardedFcInfo />
      </Tooltip>
    </div>
  );
};

export default PasswordTooltip;
