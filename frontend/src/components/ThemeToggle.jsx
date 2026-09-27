import { useEffect, useState } from "react";

function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode((prev) => !prev)}
      className="rounded-lg border border-[#D8D3DA] bg-[#F0EDF1] px-3 py-2 text-sm text-[#27242A] hover:bg-[#E8E5EA] dark:border-[#3B383D] dark:bg-[#25232A] dark:text-[#A7A3AA] dark:hover:bg-[#2D2A30]"
      aria-label="Toggle dark mode"
    >
      {darkMode ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}

export default ThemeToggle;
