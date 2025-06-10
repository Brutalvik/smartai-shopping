"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageBannerProps {
  images: string[];
  interval?: number; // milliseconds
  className?: string;
}

const ImageBanner: React.FC<ImageBannerProps> = ({
  images,
  interval = 10000,
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Start timer on mount and whenever currentIndex changes
  useEffect(() => {
    if (images.length <= 1) return;

    resetTimer();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex]); // ✅ only this dependency — NOT `interval`

  return (
    <div
      className={clsx(
        "w-full h-[55vh] relative overflow-hidden group",
        className
      )}
    >
      {images.map((src, idx) => (
        <Image
          key={idx}
          src={src}
          alt={`banner-${idx}`}
          fill
          priority={idx === currentIndex}
          className={clsx(
            "object-cover absolute transition-opacity duration-1000 ease-in-out",
            idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        />
      ))}

      {/* Left Chevron */}
      <button
        onClick={() => {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          goToPrev();
        }}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Right Chevron */}
      <button
        onClick={() => {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          goToNext();
        }}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default ImageBanner;
