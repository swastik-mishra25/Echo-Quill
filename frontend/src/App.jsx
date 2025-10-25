import React, { useState } from "react";
import Header from "./components/Header";
import StoryInput from "./components/StoryInput";
import StoryOutput from "./components/StoryOutput";
import Loader from "./components/Loader";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState("");

  // This function will be called by StoryInput
  const generateStory = async ({ theme, genre, tone, length }) => {
    setLoading(true);
    setStory("");

    try {
      const response = await fetch("http://127.0.0.1:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme, genre, tone, length }),
      });

      const data = await response.json();

      if (response.ok) {
        setStory(data.story);
      } else {
        alert(data.detail || "Failed to generate story.");
      }
    } catch (error) {
      console.error("Error generating story:", error);
      alert("Error connecting to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-6 transition-colors duration-500">
      <div className="w-full max-w-2xl">
        <Header />
        <StoryInput onGenerate={generateStory} />
        {loading && <Loader />}
        {!loading && story && <StoryOutput story={story} />}
      </div>
    </div>
  );
}
