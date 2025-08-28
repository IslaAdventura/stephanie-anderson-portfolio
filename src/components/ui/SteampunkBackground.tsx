import { useEffect, useState } from "react";

interface SteampunkBackgroundProps {
  isDark: boolean;
}

export default function SteampunkBackground({
  isDark,
}: SteampunkBackgroundProps) {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: -1 }}
    >
      {/* Light Mode - Simple moving rectangle instead of SVG */}
      {!isDark && (
        <div
          className="absolute w-32 h-16 bg-orange-500"
          style={{
            top: "30%",
            opacity: 0.7,
            animation: "simpleMove 10s linear infinite",
          }}
        >
          BALLOON
        </div>
      )}

      {/* Dark Mode - Simple moving rectangles instead of SVG */}
      {isDark && (
        <>
          <div
            className="absolute w-24 h-12 bg-purple-500"
            style={{
              top: "20%",
              opacity: 0.6,
              animation: "simpleMove 8s linear infinite",
            }}
          >
            AIRSHIP1
          </div>
          <div
            className="absolute w-20 h-10 bg-green-500"
            style={{
              top: "50%",
              opacity: 0.5,
              animation: "simpleMove 12s linear infinite reverse",
            }}
          >
            AIRSHIP2
          </div>
        </>
      )}
    </div>
  );
}
