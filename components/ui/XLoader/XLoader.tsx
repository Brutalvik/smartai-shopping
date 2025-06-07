"use client";

import React from "react";
import "./XLoader.css";

export default function XLoader() {
  return (
    <div className="relative-loader">
      {/* Invisible gradient defs */}
      <svg height="0" width="0" viewBox="0 0 100 100" className="absolute">
        <defs xmlns="http://www.w3.org/2000/svg">
          <linearGradient
            gradientUnits="userSpaceOnUse"
            y2="2"
            x2="0"
            y1="62"
            x1="0"
            id="x-gradient"
          >
            <stop stopColor="#1780cc" />
            <stop stopColor="#1780cc" offset="1.5" />
          </linearGradient>
        </defs>
      </svg>

      {/* Animated X */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 100 100"
        width="100"
        height="100"
      >
        <path
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="12"
          stroke="url(#x-gradient)"
          d="M 20,20 L 80,80 M 80,20 L 20,80"
          className="dash"
          pathLength="360"
        />
      </svg>
    </div>
  );
}
