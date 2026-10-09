import React, { useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import ReactMarkdown from "react-markdown";

const API_BASE_URL = "https://echo-quill-1.onrender.com";

function App() {
  const [formData, setFormData] = useState({
    genre: "",
    protagonist: "",
    setting: "",
    tone: "",
    premise: "",
  });
  const [outline, setOutline] = useState(null);
  const [storyText, setStoryText] = useState("");
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleIdeaChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleOutlineChange = (e) =>
    setOutline({ ...outline, [e.target.name]: e.target.value });

  const handleGenerateOutline = async (e) => {
    e.preventDefault();
    setIsGeneratingOutline(true);
    setStoryText("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/story/outline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to generate outline");
      const data = await response.json();
      setOutline(data);
    } catch (error) {
      console.error("Outline error:", error);
      alert("Error generating outline. Check console.");
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  const handleStreamStory = async () => {
    setIsStreaming(true);
    setStoryText("");
    const payload = { ...outline, tone: formData.tone };

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
          if (ev.event === "done") setIsStreaming(false);
        },
        onerror(err) {
          console.error("Stream failed:", err);
          setIsStreaming(false);
          throw err;
        },
      });
    } catch (error) {
      console.error("SSE Connection Error:", error);
      setIsStreaming(false);
    }
  };

  const handleStartOver = () => {
    setOutline(null);
    setStoryText("");
  };

  // --- REUSABLE TAILWIND CLASSES ---
  const inputStyles =
    "w-full bg-white/5 border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 rounded-xl p-4 text-white placeholder-gray-400 transition-all outline-none";
  const labelStyles =
    "block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-4 ml-1";

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#0f172a] to-black text-gray-100 p-4 md:p-12 font-sans selection:bg-blue-500/30">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* HEADER */}
        <header className="text-center pt-8 pb-4">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-blue-500 blur-[40px] opacity-20"></div>
            <h1 className="relative text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 tracking-tight">
              EchoQuill
            </h1>
          </div>
          <p className="text-gray-400 mt-3 text-lg font-medium">
            AI-Powered Narrative Generation
          </p>
        </header>

        {/* VIEW 1: THE IDEA FORM */}
        {!outline && (
          <form
            onSubmit={handleGenerateOutline}
            className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl space-y-6"
          >
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="bg-blue-500/20 text-blue-400 p-2 rounded-lg text-sm">
                1
              </span>
              Pitch Your Idea
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <input
                  name="genre"
                  placeholder="Genre (e.g. Cyberpunk Noir)"
                  value={formData.genre}
                  onChange={handleIdeaChange}
                  className={inputStyles}
                  required
                />
              </div>
              <div>
                <input
                  name="tone"
                  placeholder="Tone (e.g. Gritty, Atmospheric)"
                  value={formData.tone}
                  onChange={handleIdeaChange}
                  className={inputStyles}
                  required
                />
              </div>
              <div>
                <input
                  name="protagonist"
                  placeholder="Protagonist (e.g. Burned-out hacker)"
                  value={formData.protagonist}
                  onChange={handleIdeaChange}
                  className={inputStyles}
                  required
                />
              </div>
              <div>
                <input
                  name="setting"
                  placeholder="Setting (e.g. Neo-Tokyo)"
                  value={formData.setting}
                  onChange={handleIdeaChange}
                  className={inputStyles}
                  required
                />
              </div>
            </div>

            <div>
              <textarea
                name="premise"
                placeholder="Core Premise (What happens?)"
                value={formData.premise}
                onChange={handleIdeaChange}
                className={`${inputStyles} h-32 resize-none`}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isGeneratingOutline}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:-translate-y-1 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:transform-none mt-4"
            >
              {isGeneratingOutline ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Drafting Blueprint...
                </span>
              ) : (
                "Generate Outline"
              )}
            </button>
          </form>
        )}

        {/* VIEW 2: THE EDITABLE OUTLINE */}
        {outline && !storyText && !isStreaming && (
          <div className="bg-white/[0.03] backdrop-blur-xl border border-blue-500/30 p-8 rounded-3xl shadow-[0_0_40px_-15px_rgba(59,130,246,0.3)] space-y-2 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="bg-purple-500/20 text-purple-400 p-2 rounded-lg text-sm">
                2
              </span>
              Review & Edit Blueprint
            </h2>
            <p className="text-gray-400 mb-6 pb-4 border-b border-white/10">
              Tweak the AI's plan before generating the full prose.
            </p>

            <div className="space-y-1">
              <label className={labelStyles}>Title</label>
              <input
                name="title"
                value={outline.title}
                onChange={handleOutlineChange}
                className={`${inputStyles} text-lg font-bold text-blue-100`}
              />

              <label className={labelStyles}>The Hook</label>
              <textarea
                name="hook"
                value={outline.hook}
                onChange={handleOutlineChange}
                className={`${inputStyles} h-20 resize-none`}
              />

              <label className={labelStyles}>Act 1: Setup</label>
              <textarea
                name="act_1_setup"
                value={outline.act_1_setup}
                onChange={handleOutlineChange}
                className={`${inputStyles} h-24 resize-none`}
              />

              <label className={labelStyles}>Act 2: Confrontation</label>
              <textarea
                name="act_2_confrontation"
                value={outline.act_2_confrontation}
                onChange={handleOutlineChange}
                className={`${inputStyles} h-32 resize-none`}
              />

              <label className={labelStyles}>Act 3: Resolution</label>
              <textarea
                name="act_3_resolution"
                value={outline.act_3_resolution}
                onChange={handleOutlineChange}
                className={`${inputStyles} h-24 resize-none`}
              />
            </div>

            <div className="flex gap-4 pt-6">
              <button
                onClick={handleStartOver}
                className="w-1/3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-4 px-6 rounded-xl transition-all"
              >
                Scrap It
              </button>
              <button
                onClick={handleStreamStory}
                className="w-2/3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:-translate-y-1 shadow-lg shadow-purple-500/25"
              >
                Confirm & Write Story
              </button>
            </div>
          </div>
        )}

        {/* VIEW 3: THE LIVE DRAFT */}
        {(storyText || isStreaming) && (
          <div className="bg-[#0b1120] border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
            {/* Ambient Background Glow inside the reader */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-purple-500/10 blur-[60px] pointer-events-none"></div>

            <div className="flex justify-between items-center border-b border-white/10 pb-6 mb-8 relative z-10">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="bg-pink-500/20 text-pink-400 p-2 rounded-lg text-sm">
                  3
                </span>
                Live Draft
              </h2>
              {isStreaming && (
                <div className="flex items-center gap-2 px-4 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                  </span>
                  Streaming...
                </div>
              )}
            </div>

            {/* Enhanced Typography for Reading */}
            <div className="prose prose-invert prose-lg max-w-none prose-p:leading-relaxed prose-p:text-gray-300 prose-headings:text-white prose-a:text-blue-400 relative z-10">
              <ReactMarkdown>{storyText}</ReactMarkdown>
              {isStreaming && (
                <span className="inline-block w-2 h-5 bg-purple-500 animate-pulse ml-1 align-middle"></span>
              )}
            </div>

            {!isStreaming && storyText && (
              <button
                onClick={handleStartOver}
                className="mt-12 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-bold py-4 px-6 rounded-xl transition-all"
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
