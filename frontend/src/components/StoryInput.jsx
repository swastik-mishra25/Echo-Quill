import React, { useState } from "react";

export default function StoryInput({ onGenerate }) {
  const [theme, setTheme] = useState("");
  const [genre, setGenre] = useState("Fantasy");
  const [tone, setTone] = useState("Inspirational");
  const [length, setLength] = useState("Medium");

  const handleGenerate = () => {
    if (!theme.trim()) {
      alert("Please enter a theme or prompt!");
      return;
    }

    onGenerate({ theme, genre, tone, length });
  };

  return (
    <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 mb-6 transition-colors duration-500">
      <h2 className="text-xl font-semibold mb-4">Create Your Story</h2>

      <textarea
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        placeholder="Enter a story theme or prompt..."
        className="w-full h-28 p-3 border border-gray-300 dark:border-slate-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-gray-100"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="p-2 border border-gray-300 dark:border-slate-700 rounded-md dark:bg-slate-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
        >
          <option>Fantasy</option>
          <option>Science Fiction</option>
          <option>Romance</option>
          <option>Mystery</option>
          <option>Adventure</option>
        </select>

        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="p-2 border border-gray-300 dark:border-slate-700 rounded-md dark:bg-slate-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
        >
          <option>Inspirational</option>
          <option>Humorous</option>
          <option>Serious</option>
          <option>Dramatic</option>
          <option>Whimsical</option>
        </select>

        <select
          value={length}
          onChange={(e) => setLength(e.target.value)}
          className="p-2 border border-gray-300 dark:border-slate-700 rounded-md dark:bg-slate-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
        >
          <option>Short</option>
          <option>Medium</option>
          <option>Long</option>
        </select>
      </div>

      <button
        onClick={handleGenerate}
        className="w-full mt-6 py-3 font-semibold rounded-lg text-white transition bg-linear-to-r from-blue-500 to-purple-600 hover:opacity-90"
      >
        Generate Story
      </button>
    </div>
  );
}