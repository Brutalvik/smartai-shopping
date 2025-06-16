"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={cn("w-6 h-6", className)}
  >
    <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const CheckFilled = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={cn("w-6 h-6", className)}
  >
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
      clipRule="evenodd"
    />
  </svg>
);

type LoadingState = { text: string };

type MultiStepLoaderHandle = {
  start: () => void;
  stop: () => void;
  stepTo: (index: number) => void;
};

export const MultiStepLoader = forwardRef<
  MultiStepLoaderHandle,
  {
    loadingStates: LoadingState[];
    duration?: number;
  }
>(({ loadingStates, duration = 2000 }, ref) => {
  const [currentState, setCurrentState] = useState(0);
  const [loading, setLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    start: () => {
      setLoading(true);
      setCurrentState(0);
    },
    stop: () => {
      setLoading(false);
    },
    stepTo: (index: number) => {
      setCurrentState(index);
    },
  }));

  useEffect(() => {
    if (!loading) return;
    const timeout = setTimeout(() => {
      setCurrentState((prev) => Math.min(prev + 1, loadingStates.length - 1));
    }, duration);
    return () => clearTimeout(timeout);
  }, [currentState, loading, loadingStates.length, duration]);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full h-full fixed inset-0 z-[100] flex items-center justify-center bg-black/60 dark:bg-white/10 backdrop-blur-md"
        >
          <div className="h-96 relative">
            <div className="flex flex-col gap-4 max-w-xl mx-auto">
              {loadingStates.map((step, index) => {
                const isDone = index < currentState;
                const isActive = index === currentState;

                return (
                  <motion.div
                    key={index}
                    className="flex gap-2 items-start text-left"
                  >
                    <div>
                      {isDone ? (
                        <CheckFilled className="text-lime-500" />
                      ) : (
                        <CheckIcon
                          className={cn(
                            "text-default",
                            isActive && "text-lime-500"
                          )}
                        />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-sm",
                        isActive
                          ? "text-black dark:text-white font-semibold"
                          : "text-black/70 dark:text-white/70"
                      )}
                    >
                      {step.text}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
          <div className="bg-gradient-to-t inset-x-0 bottom-0 z-0 h-full absolute [mask-image:radial-gradient(900px_at_center,transparent_30%,white)]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
});
MultiStepLoader.displayName = "MultiStepLoader";
