import React, { useState, useEffect } from "react";

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [darkMode]);

  return (
    <header className="flex justify-between items-center py-4">
      <h1 className="text-3xl font-bold bg-linear-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
        EchoQuill
      </h1>

      <div className="flex gap-2">
        <button
          onClick={() => setDarkMode(false)}
          className={`px-3 py-1 text-sm rounded-md font-medium transition ${
            !darkMode
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-gray-200"
          }`}
        >
          Light
        </button>

        <button
          onClick={() => setDarkMode(true)}
          className={`px-3 py-1 text-sm rounded-md font-medium transition ${
            darkMode
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-gray-200"
          }`}
        >
          Dark
        </button>
      </div>
    </header>
  );
}
