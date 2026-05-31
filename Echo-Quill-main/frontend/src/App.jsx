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
    setStory(""); // Clear previous story

    try {
      // Hit your newly updated /generate streaming endpoint
      const response = await fetch(`${import.meta.env.VITE_API_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme, genre, tone, length }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to generate story.");
      }

      // Turn off the full-screen loader immediately as chunks start arriving
      setLoading(false);

      // Set up the stream reader
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break; // Stream complete!

        // Convert byte chunks to string text
        const chunkText = decoder.decode(value, { stream: true });

        // Append the incoming chunk to your story state in real-time
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
        {/* Pass loading state to StoryInput to disable fields if needed */}
        <StoryInput onGenerate={generateStory} isGenerating={loading} />
        
        {/* Show Loader only during the brief initial wake/handshake period */}
        {loading && <Loader />}
        
        {/* Show StoryOutput immediately as soon as text chunks begin loading */}
        {story && <StoryOutput story={story} />}
      </div>
    </div>
  );
}