"use client";

import React from "react";
import "./XyvoLoader.css";

type Theme = "google" | "standard";

interface XyvoLoaderProps {
  colorTheme?: Theme;
}

export default function XyvoLoader({
  colorTheme = "standard",
}: XyvoLoaderProps) {
  const isGoogle = colorTheme === "google";

  return (
    <div className="loader text-default-500">
      <svg height="0" width="0" viewBox="0 0 100 100" className="absolute">
        <defs xmlns="http://www.w3.org/2000/svg">
          {isGoogle ? (
            <>
              <linearGradient
                id="x-gradient"
                x1="0"
                y1="62"
                x2="0"
                y2="2"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#EA4335" />
                <stop stopColor="#EA4335" offset="1.5" />
              </linearGradient>
              <linearGradient
                id="y-gradient"
                x1="0"
                y1="62"
                x2="0"
                y2="2"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4285F4" />
                <stop stopColor="#4285F4" offset="1.5" />
              </linearGradient>
              <linearGradient
                id="v-gradient"
                x1="0"
                y1="62"
                x2="0"
                y2="2"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FBBC05" />
                <stop stopColor="#FBBC05" offset="1.5" />
              </linearGradient>
              <linearGradient
                id="o-gradient"
                x1="0"
                y1="62"
                x2="0"
                y2="2"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#34A853" />
                <stop stopColor="#34A853" offset="1.5" />
              </linearGradient>
            </>
          ) : (
            <>
              <linearGradient
                id="x-gradient"
                x1="0"
                y1="62"
                x2="0"
                y2="2"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#1780cc" />
                <stop stopColor="#1780cc" offset="1.5" />
              </linearGradient>
              <linearGradient
                id="default-gradient"
                x1="0"
                y1="62"
                x2="0"
                y2="2"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="currentColor" />
                <stop stopColor="currentColor" offset="1.5" />
              </linearGradient>
            </>
          )}
        </defs>
      </svg>

      {/* X */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 100 100"
        width="100"
        height="100"
        className="inline-block"
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

      {/* Y */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 100 100"
        width="100"
        height="100"
        className="inline-block"
      >
        <path
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="12"
          stroke={isGoogle ? "url(#y-gradient)" : "url(#default-gradient)"}
          d="M 20,20 L 50,50 M 80,20 L 50,50 L 50,80"
          className="dash"
          pathLength="360"
        />
      </svg>

      {/* V */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 100 100"
        width="100"
        height="100"
        className="inline-block"
      >
        <path
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="12"
          stroke={isGoogle ? "url(#v-gradient)" : "url(#default-gradient)"}
          d="M 20,20 L 50,80 L 80,20"
          className="dash"
          pathLength="360"
        />
      </svg>

      {/* O */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 100 100"
        width="100"
        height="100"
        className="inline-block"
      >
        <path
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="11"
          stroke={isGoogle ? "url(#o-gradient)" : "url(#default-gradient)"}
          d="M 50,15  
            A 35,35 0 0 1 85,50  
            A 35,35 0 0 1 50,85  
            A 35,35 0 0 1 15,50  
            A 35,35 0 0 1 50,15 Z"
          className="spin"
          pathLength="360"
        />
      </svg>
    </div>
  );
}
