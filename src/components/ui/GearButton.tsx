"use client";
import { useState } from "react";

interface GearButtonProps {
  isDark: boolean;
  isAnimating: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function GearButton({
  isDark,
  isAnimating,
  onClick,
}: GearButtonProps) {
  const [isSpinning, setIsSpinning] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 800);
    onClick(e);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isAnimating}
      className={`
    gear-button relative w-16 h-16 md:w-20 md:h-20 rounded-full transition-all duration-300 overflow-hidden
    ${isAnimating ? "gear-animating" : ""}
  `}
    >
      {/* Single Hollow Gear */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 80 80"
          className="absolute inset-0"
        >
          {/* Hollow Gear */}
          <g
            className={isSpinning ? "animate-spin" : ""}
            style={{
              transformOrigin: "40px 40px",
              animation: isSpinning
                ? "spin 0.8s ease-out"
                : "spin 8s linear infinite",
            }}
          >
            {/* Gear teeth as rectangles */}
            {Array.from({ length: 12 }, (_, i) => (
              <rect
                key={`tooth-${i}`}
                x="38"
                y="6"
                width="4"
                height="10"
                fill={isDark ? "#8b4513" : "#4a4a4a"}
                stroke={isDark ? "#654321" : "#2a2a2a"}
                strokeWidth="0.5"
                transform={`rotate(${i * 30} 40 40)`}
              />
            ))}

            {/* Hollow gear ring */}
            <circle
              cx="40"
              cy="40"
              r="24"
              fill="none"
              stroke={isDark ? "#8b4513" : "#4a4a4a"}
              strokeWidth="6"
            />
          </g>
        </svg>

        {/* Theme Icon in Center */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-2xl md:text-3xl">{isDark ? "🦋" : "🦇"}</span>
        </div>
      </div>
    </button>
  );
}
