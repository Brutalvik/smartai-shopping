import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useMotionTemplate,
} from "framer-motion";
import { useEffect } from "react";

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

const AnimatedCounter = ({
  value,
  prefix = "",
  suffix = "",
  className = "",
}: AnimatedCounterProps) => {
  const motionValue = useMotionValue(0);

  const formatted = useTransform(motionValue, (latest) =>
    prefix === "$" ? latest.toFixed(2) : Math.round(latest).toString()
  );

  const output = useMotionTemplate`${prefix}${formatted}${suffix}`;

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 1.2,
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [value]);

  return (
    <motion.span className={`text-xl font-semibold ${className}`}>
      {output}
    </motion.span>
  );
};

export default AnimatedCounter;
