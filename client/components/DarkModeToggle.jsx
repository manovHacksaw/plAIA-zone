"use client";
import { useState, useEffect } from "react";
import { Switch } from "./ui/switch";
import { FiSun, FiMoon } from "react-icons/fi";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for a saved theme; if none, use system preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    // Apply theme and store preference on darkMode change
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="fixed bottom-4 right-4 opacity-60 hover:opacity-100 transition-opacity z-50">
      <label className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-800 p-2 rounded-lg shadow-lg">
        {darkMode ? (
          <FiMoon className="text-gray-300" size={18} />
        ) : (
          <FiSun className="text-yellow-500" size={18} />
        )}
        <Switch checked={darkMode} onCheckedChange={setDarkMode} />
      </label>
    </div>
  );
}
