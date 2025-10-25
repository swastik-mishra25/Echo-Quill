import React from "react";

export default function StoryOutput({ story }) {
  const copyToClipboard = () => navigator.clipboard.writeText(story);

  const downloadTxtFile = () => {
    const element = document.createElement("a");
    const file = new Blob([story], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "story.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6 fade-in transition-colors duration-500">
      <h2 className="text-xl font-semibold mb-3">Generated Story</h2>
      <div className="max-h-64 overflow-y-auto border border-gray-200 dark:border-slate-700 p-3 rounded-md whitespace-pre-wrap text-gray-800 dark:text-gray-100">
        {story}
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={copyToClipboard}
          className="flex-1 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Copy
        </button>
        <button
          onClick={downloadTxtFile}
          className="flex-1 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
        >
          Download
        </button>
      </div>
    </div>
  );
}
