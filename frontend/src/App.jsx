import React, { useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import ReactMarkdown from "react-markdown";

// Replace with your local backend URL if testing locally (e.g., http://localhost:10000)
const API_BASE_URL = "https://echo-quill-1.onrender.com";

function App() {
  // --- STATE MANAGEMENT ---
  // Stage 1: Initial Idea
  const [formData, setFormData] = useState({
    genre: "",
    protagonist: "",
    setting: "",
    tone: "",
    premise: "",
  });

  // Stage 2: The Outline (Editable)
  const [outline, setOutline] = useState(null);

  // Stage 3: The Story
  const [storyText, setStoryText] = useState("");

  // Loading States
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  // --- HANDLERS ---
  const handleIdeaChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOutlineChange = (e) => {
    setOutline({ ...outline, [e.target.name]: e.target.value });
  };

  // STEP 1: Generate Outline
  const handleGenerateOutline = async (e) => {
    e.preventDefault();
    setIsGeneratingOutline(true);
    setStoryText(""); // Reset story if regenerating

    try {
      const response = await fetch(`${API_BASE_URL}/api/story/outline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to generate outline");

      const data = await response.json();
      setOutline(data); // Switches UI to Stage 2
    } catch (error) {
      console.error("Outline error:", error);
      alert("Error generating outline. Check console.");
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  // STEP 2: Stream Final Story
  const handleStreamStory = async () => {
    setIsStreaming(true);
    setStoryText(""); // Clear previous text

    // Combine edited outline with the original tone required by the backend
    const payload = {
      ...outline,
      tone: formData.tone,
    };

    try {
      await fetchEventSource(`${API_BASE_URL}/api/story/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        onmessage(ev) {
          if (ev.event === "chunk") {
            const data = JSON.parse(ev.data);
            setStoryText((prev) => prev + data.text);
          }
          if (ev.event === "done") {
            setIsStreaming(false);
          }
        },
        onerror(err) {
          console.error("Stream failed:", err);
          setIsStreaming(false);
          throw err; // Stop retrying
        },
      });
    } catch (error) {
      console.error("SSE Connection Error:", error);
      setIsStreaming(false);
    }
  };

  // Reset entirely
  const handleStartOver = () => {
    setOutline(null);
    setStoryText("");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            EchoQuill Engine
          </h1>
          <p className="text-gray-400 mt-2">AI-Powered Narrative Generation</p>
        </header>

        {/* --- UI VIEW 1: THE IDEA FORM --- */}
        {!outline && (
          <form
            onSubmit={handleGenerateOutline}
            className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4"
          >
            <h2 className="text-xl font-semibold border-b border-gray-700 pb-2">
              1. Pitch Your Idea
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <input
                name="genre"
                placeholder="Genre (e.g. Cyberpunk Noir)"
                value={formData.genre}
                onChange={handleIdeaChange}
                className="w-full bg-gray-700 p-3 rounded text-white"
                required
              />
              <input
                name="tone"
                placeholder="Tone (e.g. Gritty, Atmospheric)"
                value={formData.tone}
                onChange={handleIdeaChange}
                className="w-full bg-gray-700 p-3 rounded text-white"
                required
              />
              <input
                name="protagonist"
                placeholder="Protagonist (e.g. Burned-out hacker)"
                value={formData.protagonist}
                onChange={handleIdeaChange}
                className="w-full bg-gray-700 p-3 rounded text-white"
                required
              />
              <input
                name="setting"
                placeholder="Setting (e.g. Neo-Tokyo)"
                value={formData.setting}
                onChange={handleIdeaChange}
                className="w-full bg-gray-700 p-3 rounded text-white"
                required
              />
            </div>

            <textarea
              name="premise"
              placeholder="Core Premise (What happens?)"
              value={formData.premise}
              onChange={handleIdeaChange}
              className="w-full bg-gray-700 p-3 rounded text-white h-24"
              required
            />

            <button
              type="submit"
              disabled={isGeneratingOutline}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded transition-colors disabled:opacity-50"
            >
              {isGeneratingOutline
                ? "Drafting Blueprint..."
                : "Generate Outline"}
            </button>
          </form>
        )}

        {/* --- UI VIEW 2: THE EDITABLE OUTLINE --- */}
        {outline && !storyText && !isStreaming && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4 border border-blue-500/30">
            <h2 className="text-xl font-semibold text-blue-400 border-b border-gray-700 pb-2">
              2. Review & Edit Blueprint
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              Tweak the AI's plan before generating the full prose.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 uppercase">Title</label>
                <input
                  name="title"
                  value={outline.title}
                  onChange={handleOutlineChange}
                  className="w-full bg-gray-700 p-2 rounded text-white font-bold"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase">
                  The Hook
                </label>
                <textarea
                  name="hook"
                  value={outline.hook}
                  onChange={handleOutlineChange}
                  className="w-full bg-gray-700 p-2 rounded text-white text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase">
                  Act 1: Setup
                </label>
                <textarea
                  name="act_1_setup"
                  value={outline.act_1_setup}
                  onChange={handleOutlineChange}
                  className="w-full bg-gray-700 p-2 rounded text-white text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase">
                  Act 2: Confrontation
                </label>
                <textarea
                  name="act_2_confrontation"
                  value={outline.act_2_confrontation}
                  onChange={handleOutlineChange}
                  className="w-full bg-gray-700 p-2 rounded text-white text-sm h-20"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase">
                  Act 3: Resolution
                </label>
                <textarea
                  name="act_3_resolution"
                  value={outline.act_3_resolution}
                  onChange={handleOutlineChange}
                  className="w-full bg-gray-700 p-2 rounded text-white text-sm"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleStartOver}
                className="w-1/3 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded transition-colors"
              >
                Scrap It
              </button>
              <button
                onClick={handleStreamStory}
                className="w-2/3 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 rounded transition-colors"
              >
                Confirm & Write Story
              </button>
            </div>
          </div>
        )}

        {/* --- UI VIEW 3: THE LIVE DRAFT (SSE STREAM) --- */}
        {(storyText || isStreaming) && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
            <div className="flex justify-between items-center border-b border-gray-700 pb-2">
              <h2 className="text-xl font-semibold text-purple-400">
                3. Live Draft
              </h2>
              {isStreaming && (
                <span className="text-purple-400 text-sm animate-pulse">
                  Streaming...
                </span>
              )}
            </div>

            <div className="prose prose-invert max-w-none prose-p:leading-relaxed">
              <ReactMarkdown>{storyText}</ReactMarkdown>
            </div>

            {!isStreaming && storyText && (
              <button
                onClick={handleStartOver}
                className="mt-8 w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded transition-colors"
              >
                Start a New Story
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
