import React, { useState } from "react";
import Header from "./components/Header";
import StoryInput from "./components/StoryInput";
import StoryOutput from "./components/StoryOutput";
import Loader from "./components/Loader";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState("");

  const generateStory = async ({ theme, genre, tone, length }) => {
    setLoading(true);
    setStory(""); 

    try {
      // ⚠️ Direct Render URL is hardcoded here!
      const response = await fetch("https://echo-quill-1.onrender.com/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme, genre, tone, length }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to generate story.");
      }

      setLoading(false);

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break; 

        const chunkText = decoder.decode(value, { stream: true });
        setStory((prevStory) => prevStory + chunkText);
      }
    } catch (error) {
      console.error("Error generating story:", error);
      alert(error.message || "Error connecting to backend.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-6 transition-colors duration-500">
      <div className="w-full max-w-2xl">
        <Header />
        <StoryInput onGenerate={generateStory} isGenerating={loading} />
        
        {loading && <Loader />}
        {story && <StoryOutput story={story} />}
      </div>
    </div>
  );
}