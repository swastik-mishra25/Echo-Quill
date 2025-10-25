import React, { useState } from "react";
import StoryInput from "../components/StoryInput";
import StoryOutput from "..components/StoryOutput";

export default function StoryGenerator() {
  const [story, setStory] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Receive story string from StoryInput
  const handleGenerate = (generatedStory) => {
    setStory(generatedStory || "No story generated. Please try again.");
  };

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 transition-colors duration-500 p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-center mb-6 flex-1">
              ✨ AI Story Generator
            </h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 bg-blue-500 dark:bg-blue-700 text-white rounded"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>

          {/* Input component */}
          <StoryInput onGenerate={handleGenerate} />

          {/* Output component */}
          {story && <StoryOutput story={story} />}
        </div>
      </div>
    </div>
  );
}
