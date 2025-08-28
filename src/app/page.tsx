"use client";
import { useState, useEffect } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";

export default function HomePage() {
  const [isDark, setIsDark] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const shouldBeDark =
      savedTheme === "dark" || (!savedTheme && systemPrefersDark);

    setIsDark(shouldBeDark);
    document.documentElement.className = shouldBeDark
      ? "theme-dark"
      : "theme-light";
  }, []);

  return (
    <>
      <ThemeToggle
        isDark={isDark}
        setIsDark={setIsDark}
        isAnimating={isAnimating}
        setIsAnimating={setIsAnimating}
      />
      <HeroSection isDark={isDark} />
      <ProjectsSection isDark={isDark} />
    </>
  );
}
