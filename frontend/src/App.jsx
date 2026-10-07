import { useState } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import ReactMarkdown from 'react-markdown';
import { Loader2, PenTool, BookOpen } from 'lucide-react';

export default function App() {
  const [formData, setFormData] = useState({
    genre: 'Cyberpunk Noir',
    protagonist: 'A burned-out memory archivist',
    setting: 'Neo-Shinjuku, perpetual acid rain',
    tone: 'Gritty, atmospheric',
    premise: 'Uncovers a memory chip containing a politician\'s murder.'
  });

  const [outline, setOutline] = useState(null);
  const [story, setStory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateStory = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setOutline(null);
    setStory('');

    try {
      // ⚠️ REPLACE THIS URL WITH YOUR ACTUAL RENDER URL ⚠️
      await fetchEventSource(' https://echo-quill-1.onrender.com/api/story/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify(formData),
        async onopen(response) {
          if (response.ok) {
            return; 
          } else {
            const errorText = await response.text();
            console.error(`Server rejected request: ${response.status} - ${errorText}`);
            throw new Error(`Server Error ${response.status}`);
          }
        },
        onmessage(ev) {
          if (ev.event === 'outline') {
            setOutline(JSON.parse(ev.data));
          } else if (ev.event === 'chunk') {
            const parsed = JSON.parse(ev.data);
            setStory((prev) => prev + parsed.text);
          } else if (ev.event === 'done') {
            setIsGenerating(false);
          }
        },
        onerror(err) {
          console.error("Stream error:", err);
          setIsGenerating(false);
          throw err; 
        }
      });
    } catch (error) {
      console.error("Failed to generate story:", error);
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Input Form */}
        <div className="lg:col-span-1 bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl h-fit">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
            <PenTool className="text-emerald-500 w-6 h-6" />
            <h1 className="text-2xl font-bold tracking-tight">Echo-Quill</h1>
          </div>
          
          <form onSubmit={generateStory} className="space-y-4">
            {['genre', 'protagonist', 'setting', 'tone'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-400 mb-1 capitalize">
                  {field}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
                />
              </div>
            ))}
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Core Premise</label>
              <textarea
                name="premise"
                value={formData.premise}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate Narrative'}
            </button>
          </form>
        </div>

        {/* Right Column: Output Stream */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Outline Blueprint Card */}
          {outline && (
            <div className="bg-gray-900 border border-emerald-900/50 rounded-xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
              <h2 className="text-xl font-bold text-emerald-400 mb-4">{outline.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h3 className="text-gray-500 font-semibold mb-1">The Hook</h3>
                  <p className="text-gray-300 leading-relaxed">{outline.hook}</p>
                </div>
                <div>
                  <h3 className="text-gray-500 font-semibold mb-1">Thematic Elements</h3>
                  <div className="flex flex-wrap gap-2">
                    {outline.key_themes.map((theme, idx) => (
                      <span key={idx} className="bg-gray-800 border border-gray-700 px-2 py-1 rounded text-xs text-gray-300">
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Story Prose Card */}
          {(story || isGenerating) && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-xl min-h-[500px]">
              <div className="flex items-center gap-2 mb-6 border-b border-gray-800 pb-4">
                <BookOpen className="text-gray-500 w-5 h-5" />
                <h3 className="text-lg font-medium text-gray-300">Live Draft</h3>
              </div>
              
              <div className="prose prose-invert prose-emerald max-w-none">
                <ReactMarkdown>{story}</ReactMarkdown>
                {isGenerating && story.length > 0 && (
                  <span className="inline-block w-2 h-5 bg-emerald-500 ml-1 animate-pulse align-middle"></span>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}