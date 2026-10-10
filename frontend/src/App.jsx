import React, { useState, useEffect, useRef } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import ReactMarkdown from "react-markdown";
import {
  Sparkles,
  Terminal,
  BookOpen,
  PenTool,
  RotateCcw,
  Copy,
  Check,
  Zap,
  Flame,
  Radio,
  Download,
  Eye,
  Maximize2,
  Minimize2,
  Cpu,
  Layers,
  ChevronRight,
  Clock,
  FileText,
  SlidersHorizontal,
  Volume2,
  VolumeX,
  Play,
  ArrowRight,
  Send,
  AlertCircle,
  Palette,
  X,
  CheckCircle2,
  Type
} from "lucide-react";

const API_BASE_URL = "https://echo-quill-1.onrender.com";

// Typography Profiles
const FONT_STYLES = [
  {
    id: "space-grotesk",
    name: "Cyber Grotesk",
    shortName: "Grotesk",
    uiFont: "'Space Grotesk', system-ui, -apple-system, sans-serif",
    proseFont: "'Newsreader', Georgia, serif",
    tagline: "Space Grotesk UI + Newsreader Literary Prose"
  },
  {
    id: "cinema-royale",
    name: "Cinema Royale",
    shortName: "Outfit",
    uiFont: "'Outfit', system-ui, -apple-system, sans-serif",
    proseFont: "'Cormorant Garamond', Georgia, serif",
    tagline: "Outfit Modern UI + Cormorant Garamond Drama"
  },
  {
    id: "modern-studio",
    name: "Modern Studio",
    shortName: "Jakarta",
    uiFont: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    proseFont: "'Newsreader', Georgia, serif",
    tagline: "Plus Jakarta Precision + Editorial Serif"
  }
];

// 8 Harmonized Color Palettes with Diffuse Spatial Distribution
const THEME_PALETTES = [
  {
    id: "cyan-rose",
    name: "Cyber Cyan & Phoenix Rose",
    tagline: "Holographic Neo-Tokyo // High Contrast",
    c1: "#06b6d4",
    c2: "#6366f1",
    c3: "#f43f5e",
    bgBase: "#02040b",
    auroraTop: "rgba(6, 182, 212, 0.08)",
    auroraLeft: "rgba(6, 182, 212, 0.06)",
    auroraRight: "rgba(244, 63, 94, 0.06)",
    auroraBottom: "rgba(99, 102, 241, 0.07)",
    glowColor: "rgba(6, 182, 212, 0.35)"
  },
  {
    id: "solar-amber",
    name: "Solar Amber & Cyber Rust",
    tagline: "Blade Runner 2049 & Arrakis Dust",
    c1: "#f59e0b",
    c2: "#ea580c",
    c3: "#e11d48",
    bgBase: "#080402",
    auroraTop: "rgba(245, 158, 11, 0.08)",
    auroraLeft: "rgba(245, 158, 11, 0.06)",
    auroraRight: "rgba(225, 29, 72, 0.06)",
    auroraBottom: "rgba(234, 88, 12, 0.07)",
    glowColor: "rgba(245, 158, 11, 0.35)"
  },
  {
    id: "emerald-matrix",
    name: "Emerald Matrix & Bioluminescence",
    tagline: "Deep Neural Biosphere & Alien Core",
    c1: "#10b981",
    c2: "#0d9488",
    c3: "#84cc16",
    bgBase: "#010804",
    auroraTop: "rgba(16, 185, 129, 0.08)",
    auroraLeft: "rgba(16, 185, 129, 0.06)",
    auroraRight: "rgba(132, 204, 22, 0.06)",
    auroraBottom: "rgba(13, 148, 136, 0.07)",
    glowColor: "rgba(16, 185, 129, 0.35)"
  },
  {
    id: "cosmic-violet",
    name: "Cosmic Violet & Astral Azure",
    tagline: "Deep Space Nebula & Hyperspace",
    c1: "#8b5cf6",
    c2: "#3b82f6",
    c3: "#d946ef",
    bgBase: "#05020c",
    auroraTop: "rgba(139, 92, 246, 0.08)",
    auroraLeft: "rgba(139, 92, 246, 0.06)",
    auroraRight: "rgba(217, 70, 239, 0.06)",
    auroraBottom: "rgba(59, 130, 246, 0.07)",
    glowColor: "rgba(139, 92, 246, 0.35)"
  },
  {
    id: "crimson-abyss",
    name: "Crimson Abyss & Nightshade",
    tagline: "Dark Gothic Thriller & Bloodlines",
    c1: "#ef4444",
    c2: "#a855f7",
    c3: "#f43f5e",
    bgBase: "#090103",
    auroraTop: "rgba(239, 68, 68, 0.08)",
    auroraLeft: "rgba(239, 68, 68, 0.06)",
    auroraRight: "rgba(244, 63, 94, 0.06)",
    auroraBottom: "rgba(168, 85, 247, 0.07)",
    glowColor: "rgba(239, 68, 68, 0.35)"
  },
  {
    id: "arctic-frost",
    name: "Arctic Glacial & Frost Blue",
    tagline: "Sub-Zero Cryo Array & Pure Quartz",
    c1: "#38bdf8",
    c2: "#6366f1",
    c3: "#2dd4bf",
    bgBase: "#02050e",
    auroraTop: "rgba(56, 189, 248, 0.08)",
    auroraLeft: "rgba(56, 189, 248, 0.06)",
    auroraRight: "rgba(45, 212, 191, 0.06)",
    auroraBottom: "rgba(99, 102, 241, 0.07)",
    glowColor: "rgba(56, 189, 248, 0.35)"
  },
  {
    id: "vaporwave-sunset",
    name: "Vaporwave Sunset & Retro Synth",
    tagline: "Outrun Grid & Miami 1984 Mirage",
    c1: "#ec4899",
    c2: "#8b5cf6",
    c3: "#06b6d4",
    bgBase: "#060109",
    auroraTop: "rgba(236, 72, 153, 0.08)",
    auroraLeft: "rgba(236, 72, 153, 0.06)",
    auroraRight: "rgba(6, 182, 212, 0.06)",
    auroraBottom: "rgba(139, 92, 246, 0.07)",
    glowColor: "rgba(236, 72, 153, 0.35)"
  },
  {
    id: "monolith-gold",
    name: "Imperial Gold & Solar Bronze",
    tagline: "Royal Grimoire & High-Fantasy Sovereign",
    c1: "#eab308",
    c2: "#f59e0b",
    c3: "#d97706",
    bgBase: "#060502",
    auroraTop: "rgba(234, 179, 8, 0.08)",
    auroraLeft: "rgba(234, 179, 8, 0.06)",
    auroraRight: "rgba(217, 119, 6, 0.06)",
    auroraBottom: "rgba(245, 158, 11, 0.07)",
    glowColor: "rgba(234, 179, 8, 0.35)"
  }
];

// Curated atmospheric story inspiration presets
const INSPIRATION_PRESETS = [
  {
    tag: "CYBERPUNK NOIR",
    genre: "Cyberpunk Tech-Noir",
    tone: "Gritty, Rain-Drenched, Cynical",
    protagonist:
      "Kaelen Voss, a burned-out neural-memory extractor harboring contraband flashbacks",
    setting: "Neo-Shinjuku Sub-Level 4, beneath perpetual synthetic acid rain",
    premise:
      "A dying syndicate courier implants a locked memory shard into Kaelen's skull, containing proof of a simulated consciousness harvest."
  },
  {
    tag: "COSMIC HORROR",
    genre: "Deep-Space Cosmic Dread",
    tone: "Atmospheric, Claustrophobic, Unsettling",
    protagonist:
      "Dr. Evelyn Ward, sole signal analyst aboard Deep Array Station Kepler-9",
    setting:
      "The silent edge of the Boötes Void, four light-years from nearest outpost",
    premise:
      "An ancient repeating transmission matches Evelyn's childhood heartbeat and begins rewriting the station's navigational star maps."
  },
  {
    tag: "SOLARPUNK ODYSSEY",
    genre: "Solarpunk Speculative Fiction",
    tone: "Wondrous, Luminous, Melancholic",
    protagonist:
      "Orla Thorne, an arboreal bio-architect nursing an outlawed terraforming spore",
    setting:
      "The Floating Canopy of New Valis, suspended 3,000 meters above petrified salt seas",
    premise:
      "A sudden solar pulse awakens the dormant mycorrhizal network of the ancient canopy, whispering coordinates to the ruined surface below."
  },
  {
    tag: "GOTHIC CHRONICLE",
    genre: "Grimdark Gothic Fantasy",
    tone: "Visceral, Poetic, Haunting",
    protagonist:
      "Vaelen the Ashbound, an excommunicated paladin bound to a whispering silver blade",
    setting:
      "The Cathedral City of Oakhaven, sinking slowly into an abyss of black mercury",
    premise:
      "The city bells toll backward at midnight, releasing centuries of buried confessions that manifest as ravenous spectral apparitions."
  }
];

// Rich fallback story stream for offline/demo simulation mode
const DEMO_STORY_CHUNKS = [
  "### Chapter I: The Architecture of Rust\n\n",
  "The rain over Sub-Level 4 never tasted like water. It was a cold, acidic mist distilled from twenty vertical miles of exhaust shafts and synthetic coolant leaks, clinging to the neon kanji of the lower promenade like wet lacquer.\n\n",
  "Kaelen Voss wiped his synthetic ocular lens with a thumb clad in frayed synth-leather. The optical feed recalibrated with a soft, mechanical click—overlaying chromatic heat signatures across the crowded alleyway. Thirty-four heartbeats within twelve paces. None of them mattered, save for the faltering rhythm stumbling toward him from the shadows of the ventilation canal.\n\n",
  "> *\"A memory is never inert, Voss. It breathes in the host, waiting for warmth.\"*\n\n",
  "The dying courier collapsed against Kaelen's chest, smelling of ozone and fried bio-circuitry. He didn't offer a name. In the undercity, names were liabilities traded on open subnet auctions. Instead, his trembling fingers gripped Kaelen's collar, pressing a hexagonal cryo-shard into the hollow of his palm.\n\n",
  "\"The Syndicate...\" the courier gasped, blood flecked with bioluminescent dye bubbling past his lips. \"They didn't archive the council members. They harvested them. Every soul... digitized into the orbital mainframe.\"\n\n",
  "---\n\n",
  "### Chapter II: The Ghost in the Synapse\n\n",
  "Kaelen retreated to his safehouse beneath the freight rail. The room was four paces wide, smelling of soldering resin, wet wool, and stale nutrient paste. On the workbench, the neural immersion deck hummed with a low, predatory resonance.\n\n",
  "He slotted the shard into the dermal port behind his left ear.\n\n",
  "The world disintegrated into blinding ultraviolet geometry. Then came the memories—not his own, but belonging to a thousand distinct voices speaking in unison across sixty thousand light-cycles. He felt the cold vacuum of an orbital laboratory, the sterile sting of cortical extraction needles, and the horrifying revelation: the city above was not a sanctuary, but a colossal bio-processor feeding on the dreams of its forgotten denizens.\n\n",
  "---\n\n",
  "### Chapter III: The Midnight Reckoning\n\n",
  "Down in the street, heavy hydraulic footsteps shook the floorboards. The Syndicate's cybernetic enforcers had arrived. Their red scanner beams cut through the grimy blinds like laser scalpel incisions.\n\n",
  "Kaelen didn't reach for his sidearm. He drew a breath, opened his neural firewall, and allowed the extracted ghosts to flood into the city's power grid. One final transmission—an irreversible spark through the cinematic void.\n\n",
  "The streetlights shattered simultaneously. In the total darkness, the chronicle of Neo-Shinjuku was rewritten in electric fire."
];

export default function App() {
  // Theme state
  const [themeIndex, setThemeIndex] = useState(0);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const currentTheme = THEME_PALETTES[themeIndex];

  // Font Style state
  const [fontIndex, setFontIndex] = useState(0);
  const currentFont = FONT_STYLES[fontIndex];

  // Pipeline Navigation State (1: Pitch, 2: Blueprint, 3: Chronicle)
  const [stage, setStage] = useState(1);

  // Responsive Mobile Tab for Workspace (<lg viewports)
  const [mobileTab, setMobileTab] = useState("blueprint"); // "blueprint" | "chronicle"

  // Stage 1: Form state
  const [formData, setFormData] = useState({
    genre: "Cyberpunk Tech-Noir",
    tone: "Gritty, Rain-Drenched, Atmospheric",
    protagonist: "Kaelen Voss, a burned-out neural-memory extractor",
    setting: "Neo-Shinjuku Sub-Level 4, beneath perpetual synthetic rain",
    premise:
      "A dying courier implants a locked memory shard containing evidence that the city council is harvesting digitized citizen souls."
  });

  // Stage 2: Blueprint state
  const [outline, setOutline] = useState(null);

  // Stage 3: Prose Streaming State
  const [storyText, setStoryText] = useState("");
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamError, setStreamError] = useState(null);

  // Reader Polish & Micro-Interactions
  const [autoScroll, setAutoScroll] = useState(true);
  const [fontSize, setFontSize] = useState("base"); // 'sm' | 'base' | 'lg'
  const [copied, setCopied] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [useSimulationMode, setUseSimulationMode] = useState(false);

  // References
  const proseContainerRef = useRef(null);
  const audioContextRef = useRef(null);

  // Auto-scroll logic when streaming new tokens
  useEffect(() => {
    if (autoScroll && proseContainerRef.current) {
      proseContainerRef.current.scrollTop = proseContainerRef.current.scrollHeight;
    }
  }, [storyText, autoScroll]);

  // Audio synthesizer click effect
  const playCyberBlip = (freq = 900, duration = 0.04) => {
    if (!soundEnabled) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.035, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio fallback silent
    }
  };

  const handleSelectTheme = (idx) => {
    playCyberBlip(1100, 0.06);
    setThemeIndex(idx);
    setShowThemeModal(false);
  };

  const handleCycleTheme = () => {
    playCyberBlip(1050, 0.05);
    setThemeIndex((prev) => (prev + 1) % THEME_PALETTES.length);
  };

  const handleCycleFont = () => {
    playCyberBlip(1150, 0.05);
    setFontIndex((prev) => (prev + 1) % FONT_STYLES.length);
  };

  // Form Handlers
  const handleIdeaChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleOutlineChange = (e) =>
    setOutline({ ...outline, [e.target.name]: e.target.value });

  const handleApplyPreset = (preset) => {
    playCyberBlip(1250, 0.05);
    setFormData({
      genre: preset.genre,
      tone: preset.tone,
      protagonist: preset.protagonist,
      setting: preset.setting,
      premise: preset.premise
    });
  };

  // Stage 1 -> Stage 2: Generate Outline
  const handleGenerateOutline = async (e) => {
    if (e) e.preventDefault();
    playCyberBlip(950, 0.08);
    setIsGeneratingOutline(true);
    setStreamError(null);
    setStoryText("");

    if (useSimulationMode) {
      setTimeout(() => {
        setOutline({
          title: "Whispers of the Sub-Level Mainframe",
          hook: "The rain over Sub-Level 4 never tasted like water; it tasted like ozone, copper, and dying circuitry.",
          act_1_setup: `${formData.protagonist} operates from a damp neon crawlspace in ${formData.setting}, extracting dead-man memories until a dying courier drops a forbidden shard in his hands.`,
          act_2_confrontation: `When the memory boots up, it reveals the horrific truth behind ${formData.premise}. Syndicate enforcers breach his perimeter, hunting the shard with lethal authorization.`,
          act_3_resolution: `Cornered at the apex of the central cooling tower, the protagonist must choose between purging his own identity to broadcast the truth or becoming another erased ghost in the void.`
        });
        setStage(2);
        setMobileTab("blueprint");
        setIsGeneratingOutline(false);
      }, 850);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/story/outline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data = await response.json();
      setOutline(data);
      setStage(2);
      setMobileTab("blueprint");
    } catch (error) {
      console.warn(
        "Backend API not reachable, switching to neural simulation mode:",
        error
      );
      setOutline({
        title: "Echoes in the Neon Smog",
        hook: `A terminal beep pierced the static of ${formData.setting}, where secrets cost more than oxygen.`,
        act_1_setup: `${formData.protagonist} uncovers an encrypted trace: ${formData.premise}`,
        act_2_confrontation: `The Syndicate deploys hunter-killer automata. The protagonist navigates high-stakes intrigue across the city underbelly to decrypt the master code.`,
        act_3_resolution: `A climactic showdown at the central transmitter forces a fateful decision: execute the virus to liberate the city or preserve the stolen memories forever.`
      });
      setStreamError(
        "Remote server offline/cold starting. Activated local neural simulation mode."
      );
      setStage(2);
      setMobileTab("blueprint");
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  // Stage 2 -> Stage 3: Stream Live Story Prose
  const handleStreamStory = async () => {
    playCyberBlip(1400, 0.1);
    setStage(3);
    setMobileTab("chronicle"); // Automatically switch mobile view to reader!
    setIsStreaming(true);
    setStoryText("");
    setStreamError(null);

    if (useSimulationMode) {
      runSimulatedStream();
      return;
    }

    const payload = { ...outline, tone: formData.tone };

    try {
      let receivedAnyChunk = false;
      await fetchEventSource(`${API_BASE_URL}/api/story/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        onmessage(ev) {
          receivedAnyChunk = true;
          if (ev.event === "chunk") {
            try {
              const data = JSON.parse(ev.data);
              setStoryText((prev) => prev + data.text);
              if (Math.random() > 0.85) playCyberBlip(1600, 0.02);
            } catch {
              setStoryText((prev) => prev + ev.data);
            }
          }
          if (ev.event === "done") {
            setIsStreaming(false);
          }
        },
        onerror(err) {
          console.warn("SSE stream error:", err);
          if (!receivedAnyChunk) {
            setStreamError(
              "Remote stream timed out. Running seamless neural simulation demo."
            );
            runSimulatedStream();
          }
          setIsStreaming(false);
          throw err;
        }
      });
    } catch (error) {
      console.warn("SSE connection interrupted, using fallback simulation:", error);
      if (!storyText) {
        runSimulatedStream();
      } else {
        setIsStreaming(false);
      }
    }
  };

  // Simulated live typewriter SSE stream
  const runSimulatedStream = () => {
    setIsStreaming(true);
    let chunkIndex = 0;
    const interval = setInterval(() => {
      if (chunkIndex < DEMO_STORY_CHUNKS.length) {
        const nextChunk = DEMO_STORY_CHUNKS[chunkIndex];
        setStoryText((prev) => prev + nextChunk);
        playCyberBlip(1200 + chunkIndex * 35, 0.02);
        chunkIndex++;
      } else {
        clearInterval(interval);
        setIsStreaming(false);
      }
    }, 420);
  };

  // Reset
  const handleResetToPitch = () => {
    playCyberBlip(600, 0.05);
    setStage(1);
    setOutline(null);
    setStoryText("");
    setIsStreaming(false);
    setStreamError(null);
    setMobileTab("blueprint");
  };

  const handleCopyStory = () => {
    if (!storyText) return;
    navigator.clipboard.writeText(storyText);
    setCopied(true);
    playCyberBlip(1500, 0.08);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleDownloadMarkdown = () => {
    if (!storyText) return;
    playCyberBlip(1100, 0.06);
    const element = document.createElement("a");
    const file = new Blob(
      [
        `# ${outline?.title || "EchoQuill Narrative"}\n\n` +
          `**Genre:** ${formData.genre} | **Tone:** ${formData.tone}\n\n` +
          `**Protagonist:** ${formData.protagonist}\n\n` +
          `**Setting:** ${formData.setting}\n\n` +
          `---\n\n` +
          storyText
      ],
      { type: "text/markdown" }
    );
    element.href = URL.createObjectURL(file);
    element.download = `${(outline?.title || "echoquill_story")
      .toLowerCase()
      .replace(/\s+/g, "_")}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Reading metrics
  const wordCount = storyText
    ? storyText.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const estimatedReadMinutes = Math.max(1, Math.ceil(wordCount / 200));

  // CSS variables
  const themeVars = {
    "--c1": currentTheme.c1,
    "--c2": currentTheme.c2,
    "--c3": currentTheme.c3,
    "--aurora-top": currentTheme.auroraTop,
    "--aurora-left": currentTheme.auroraLeft,
    "--aurora-right": currentTheme.auroraRight,
    "--aurora-bottom": currentTheme.auroraBottom,
    "--cursor-glow": `0 0 12px ${currentTheme.c1}, 0 0 20px ${currentTheme.c3}`,
    "--active-font-ui": currentFont.uiFont,
    "--active-font-prose": currentFont.proseFont,
    backgroundColor: currentTheme.bgBase,
    fontFamily: currentFont.uiFont
  };

  const titleGradient = {
    backgroundImage: `linear-gradient(90deg, #ffffff 0%, #f1f5f9 22%, ${currentTheme.c1} 62%, ${currentTheme.c2} 100%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  };

  const logoGradient = {
    backgroundImage: `linear-gradient(90deg, #ffffff 0%, ${currentTheme.c1} 45%, ${currentTheme.c2} 80%, ${currentTheme.c3} 100%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  };

  const fullGradientButton = {
    backgroundImage: `linear-gradient(135deg, ${currentTheme.c1} 0%, ${currentTheme.c2} 55%, ${currentTheme.c3} 100%)`,
    boxShadow: `0 6px 24px -4px ${currentTheme.glowColor}`
  };

  return (
    <div
      style={themeVars}
      className="min-h-screen text-slate-100 selection:bg-white/20 selection:text-white relative overflow-x-hidden pb-16 sm:pb-24 transition-colors duration-700"
    >
      {/* Background Cyber Grid */}
      <div className="fixed inset-0 cyber-grid opacity-35 pointer-events-none z-0" />

      {/* Symmetrical, Diffuse Ambient Atmosphere */}
      <div className="aurora-canopy" />

      {/* Top Glassmorphic Navigation Bar - Fully Responsive */}
      <header className="relative z-20 border-b border-white/[0.08] bg-black/70 backdrop-blur-xl sticky top-0 px-3 sm:px-6 md:px-8 py-2.5 sm:py-3.5">
        <div className="max-w-[1520px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Title & Subtitle (Logo icon removed as requested) */}
          <div
            className="cursor-pointer flex-shrink-0"
            onClick={() => setStage(1)}
            title="Return to Pitch"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span
                style={logoGradient}
                className="text-lg sm:text-2xl font-black tracking-tight"
              >
                ECHOQUILL
              </span>
              <span
                style={{
                  borderColor: `${currentTheme.c1}35`,
                  color: currentTheme.c1
                }}
                className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] border font-bold tracking-wider"
              >
                v3.4
              </span>
            </div>
            <p className="text-[10px] font-mono tracking-[0.22em] text-slate-400 uppercase hidden md:block">
              Cinematic Narrative Engine // Void & Cyber-Glass
            </p>
          </div>

          {/* Controls: Responsive Cluster */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Core Online Beacon - Visible on ALL screen sizes */}
            <div className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] sm:text-xs font-mono font-semibold flex-shrink-0">
              <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-emerald-500"></span>
              </span>
              <span>ONLINE</span>
            </div>

            {/* Font Style Toggle Button */}
            <button
              onClick={handleCycleFont}
              className="flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-mono border border-white/[0.14] bg-white/[0.04] hover:bg-white/[0.09] text-slate-200 hover:text-white transition-all cursor-pointer shadow-lg hover:border-white/30"
              title={`Switch Font Style (Current: ${currentFont.name})`}
            >
              <Type className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
              <span className="font-semibold text-[10px] sm:text-[11px] tracking-wider">
                <span className="hidden sm:inline">FONT: </span>
                {currentFont.shortName.toUpperCase()}
              </span>
            </button>

            {/* Palette Gallery Selector */}
            <button
              onClick={() => {
                playCyberBlip(1200, 0.05);
                setShowThemeModal(true);
              }}
              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-mono border border-white/[0.14] bg-white/[0.04] hover:bg-white/[0.09] text-slate-200 hover:text-white transition-all cursor-pointer shadow-lg hover:border-white/30"
              title="Open Color Palette Gallery"
            >
              <Palette
                className="w-3.5 h-3.5 flex-shrink-0"
                style={{ color: currentTheme.c1 }}
              />
              <div className="flex items-center gap-1.5">
                <div
                  style={{
                    background: `linear-gradient(90deg, ${currentTheme.c1}, ${currentTheme.c2}, ${currentTheme.c3})`
                  }}
                  className="w-6 sm:w-8 h-2 sm:h-2.5 rounded-full shadow-inner border border-black/40"
                />
                <span className="hidden lg:inline font-bold text-[11px] uppercase tracking-wider">
                  {currentTheme.name.split(" ")[0]}
                </span>
              </div>
            </button>

            {/* Quick Next Theme Cycle (Hidden on small screens) */}
            <button
              onClick={handleCycleTheme}
              className="hidden md:flex items-center px-2 py-1.5 rounded-lg text-[11px] font-mono text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] transition-colors cursor-pointer"
              title="Next color palette"
            >
              Cycle
            </button>

            {/* Simulation / Live Mode Toggle */}
            <button
              onClick={() => {
                setUseSimulationMode(!useSimulationMode);
                playCyberBlip(1000, 0.04);
              }}
              title={
                useSimulationMode
                  ? "Mode: Neural Sandbox (Fast local demo)"
                  : "Mode: Live Render Backend"
              }
              style={{
                borderColor: useSimulationMode
                  ? `${currentTheme.c1}50`
                  : "rgba(255,255,255,0.1)",
                color: useSimulationMode ? currentTheme.c1 : "#94a3b8"
              }}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full text-xs font-mono border bg-white/[0.02] transition-all cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="hidden sm:inline text-[10px] sm:text-[11px] font-semibold">
                {useSimulationMode ? "DEMO" : "LIVE"}
              </span>
            </button>

            {/* Audio Feedback Toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playCyberBlip(1200, 0.05);
              }}
              className="p-1 sm:p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20 transition-colors cursor-pointer"
              title={
                soundEnabled
                  ? "Mute Cyber Synthesizer"
                  : "Enable Cyber Synthesizer"
              }
            >
              {soundEnabled ? (
                <Volume2
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                  style={{ color: currentTheme.c1 }}
                />
              ) : (
                <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Diffuse Under-Header Accent Beam */}
        <div
          style={{
            background: `linear-gradient(90deg, transparent 5%, ${currentTheme.c1} 25%, ${currentTheme.c2} 50%, ${currentTheme.c3} 75%, transparent 95%)`
          }}
          className="h-[1px] w-full opacity-40 mt-1"
        />
      </header>

      {/* THEME GALLERY MODAL - Fully Responsive */}
      {showThemeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in-up">
          <div className="cyber-glass-uniform rounded-2xl sm:rounded-3xl p-4 sm:p-8 max-w-3xl w-full shadow-2xl relative max-h-[88vh] overflow-y-auto scrollbar-cyber border border-white/[0.14]">
            <div
              style={{
                background: `linear-gradient(90deg, ${currentTheme.c1}, ${currentTheme.c2}, ${currentTheme.c3})`
              }}
              className="h-[2px] w-full rounded-full mb-4 sm:mb-6 opacity-70"
            />

            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/[0.08] mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-white">
                  <Palette className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Uniform Cinematic Palettes
                  </h3>
                  <p className="text-[10px] sm:text-xs font-mono text-slate-400">
                    Symmetrical distribution across all 3 pipeline stages
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowThemeModal(false)}
                className="p-1.5 sm:p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Grid of 8 Handcrafted Palettes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
              {THEME_PALETTES.map((t, index) => {
                const isSelected = index === themeIndex;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleSelectTheme(index)}
                    className={`text-left p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden group ${
                      isSelected
                        ? "bg-white/[0.08] border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                        : "bg-white/[0.02] hover:bg-white/[0.06] border-white/[0.08] hover:border-white/25"
                    }`}
                  >
                    {/* Continuous Gradient Bar Preview */}
                    <div
                      style={{
                        background: `linear-gradient(90deg, ${t.c1} 0%, ${t.c2} 50%, ${t.c3} 100%)`
                      }}
                      className="h-2 sm:h-2.5 w-full rounded-full shadow-sm mb-2 sm:mb-3"
                    />

                    <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                      <span className="text-xs sm:text-sm font-bold text-white">
                        {t.name}
                      </span>
                      {isSelected ? (
                        <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 sm:px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> ACTIVE
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-300">
                          #{index + 1}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono truncate">
                      {t.tagline}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace Area */}
      <main className="relative z-10 max-w-[1520px] mx-auto px-3 sm:px-6 lg:px-8 pt-5 sm:pt-8 md:pt-9">
        {/* UNIFIED PROGRESS TRACKER - Responsive Scrollable Container */}
        <section className="flex justify-center mb-6 sm:mb-10 w-full overflow-x-auto scrollbar-none px-1">
          <div className="relative inline-flex items-center p-1 sm:p-1.5 rounded-full cyber-glass-uniform border border-white/[0.1] shadow-xl flex-nowrap">
            {/* Step 1: Idea Pitch */}
            <button
              onClick={() => setStage(1)}
              style={
                stage === 1
                  ? {
                      backgroundColor: `${currentTheme.c1}18`,
                      borderColor: `${currentTheme.c1}45`,
                      color: currentTheme.c1,
                      boxShadow: `0 0 14px ${currentTheme.c1}30`
                    }
                  : {}
              }
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full font-mono text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition-all duration-300 border border-transparent cursor-pointer flex-shrink-0 ${
                stage === 1 ? "" : "text-slate-400 hover:text-white"
              }`}
            >
              <span
                style={
                  stage === 1
                    ? {
                        backgroundColor: currentTheme.c1,
                        color: "#000"
                      }
                    : { backgroundColor: "rgba(255,255,255,0.1)", color: "#cbd5e1" }
                }
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold"
              >
                1
              </span>
              <span>
                <span className="hidden sm:inline">01 </span>Pitch
              </span>
            </button>

            {/* Gradient Connector 1 -> 2 */}
            <div
              style={{
                background: `linear-gradient(90deg, ${currentTheme.c1}, ${currentTheme.c2})`
              }}
              className="w-3 sm:w-6 md:w-8 h-[1.5px] opacity-50 mx-0.5 sm:mx-1 flex-shrink-0"
            />

            {/* Step 2: Story Architect */}
            <button
              onClick={() => {
                if (outline) {
                  setStage(2);
                  setMobileTab("blueprint");
                }
              }}
              disabled={!outline}
              style={
                stage === 2
                  ? {
                      backgroundColor: `${currentTheme.c2}18`,
                      borderColor: `${currentTheme.c2}45`,
                      color: currentTheme.c2,
                      boxShadow: `0 0 14px ${currentTheme.c2}30`
                    }
                  : {}
              }
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full font-mono text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition-all duration-300 border border-transparent flex-shrink-0 ${
                stage === 2
                  ? ""
                  : outline
                  ? "text-slate-400 hover:text-white cursor-pointer"
                  : "text-slate-600 cursor-not-allowed"
              }`}
            >
              <span
                style={
                  stage === 2
                    ? {
                        backgroundColor: currentTheme.c2,
                        color: "#000"
                      }
                    : outline
                    ? { backgroundColor: `${currentTheme.c2}25`, color: currentTheme.c2 }
                    : { backgroundColor: "rgba(255,255,255,0.05)", color: "#64748b" }
                }
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold"
              >
                2
              </span>
              <span>
                <span className="hidden sm:inline">02 </span>Blueprint
              </span>
            </button>

            {/* Gradient Connector 2 -> 3 */}
            <div
              style={{
                background: `linear-gradient(90deg, ${currentTheme.c2}, ${currentTheme.c3})`
              }}
              className="w-3 sm:w-6 md:w-8 h-[1.5px] opacity-50 mx-0.5 sm:mx-1 flex-shrink-0"
            />

            {/* Step 3: The Chronicle */}
            <button
              onClick={() => {
                if (storyText || isStreaming) {
                  setStage(3);
                  setMobileTab("chronicle");
                }
              }}
              disabled={!storyText && !isStreaming}
              style={
                stage === 3
                  ? {
                      backgroundColor: `${currentTheme.c3}18`,
                      borderColor: `${currentTheme.c3}45`,
                      color: currentTheme.c3,
                      boxShadow: `0 0 14px ${currentTheme.c3}30`
                    }
                  : {}
              }
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full font-mono text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition-all duration-300 border border-transparent flex-shrink-0 ${
                stage === 3
                  ? ""
                  : storyText || isStreaming
                  ? "text-slate-400 hover:text-white cursor-pointer"
                  : "text-slate-600 cursor-not-allowed"
              }`}
            >
              <span
                style={
                  stage === 3
                    ? {
                        backgroundColor: currentTheme.c3,
                        color: "#000"
                      }
                    : storyText || isStreaming
                    ? { backgroundColor: `${currentTheme.c3}25`, color: currentTheme.c3 }
                    : { backgroundColor: "rgba(255,255,255,0.05)", color: "#64748b" }
                }
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold"
              >
                3
              </span>
              <span>
                <span className="hidden sm:inline">03 </span>Chronicle
              </span>
            </button>
          </div>
        </section>

        {/* Global Notification Banner */}
        {streamError && (
          <div
            style={{
              borderColor: `${currentTheme.c1}40`,
              backgroundColor: `${currentTheme.c1}10`,
              color: currentTheme.c1
            }}
            className="max-w-4xl mx-auto mb-5 sm:mb-6 p-2.5 sm:p-3 rounded-xl border flex items-center justify-between text-xs font-mono animate-fade-in-up"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{streamError}</span>
            </div>
            <button
              onClick={() => setStreamError(null)}
              className="text-slate-400 hover:text-white px-2 py-0.5 rounded text-[11px] cursor-pointer flex-shrink-0 ml-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* STAGE 1: IDEA PITCH */}
        {stage === 1 && (
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fade-in-up">
            {/* Hero Title */}
            <div className="text-center space-y-2 sm:space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-mono tracking-widest uppercase border border-white/[0.1] bg-white/[0.02] text-slate-300">
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: currentTheme.c1 }}
                />
                <span>Stage 01 // Narrative Ignition</span>
              </div>

              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight px-1">
                <span style={titleGradient}>Pitch Your Cinematic Vision</span>
              </h1>

              <p className="text-xs sm:text-sm md:text-base text-slate-400 max-w-xl mx-auto leading-relaxed px-2">
                Define the world, tone, and core catalyst. EchoQuill will synthesize a
                multi-act blueprint ready for live prose orchestration.
              </p>
            </div>

            {/* Inspiration Seed Chips - Responsive Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] sm:text-xs font-mono text-slate-400 tracking-wider uppercase flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" style={{ color: currentTheme.c1 }} />
                  Quick Neural Presets
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono text-slate-500">
                  Click to pre-load
                </span>
              </div>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
                {INSPIRATION_PRESETS.map((preset, index) => {
                  const chipColor =
                    index === 0
                      ? currentTheme.c1
                      : index === 1
                      ? currentTheme.c1
                      : index === 2
                      ? currentTheme.c2
                      : currentTheme.c3;

                  return (
                    <button
                      key={index}
                      onClick={() => handleApplyPreset(preset)}
                      className="group relative p-2.5 sm:p-3 text-left rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] hover:border-white/25 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
                    >
                      <div
                        style={{ color: chipColor }}
                        className="text-[11px] font-mono font-bold tracking-wider"
                      >
                        {preset.tag}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5 group-hover:text-slate-300">
                        {preset.genre}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Card - Fully Responsive Padding & Fields */}
            <form
              onSubmit={handleGenerateOutline}
              className="cyber-glass-uniform rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:p-10 space-y-4 sm:space-y-6 relative border border-white/[0.1] overflow-hidden"
            >
              {/* Diffuse Accent Line */}
              <div
                style={{
                  background: `linear-gradient(90deg, transparent 0%, ${currentTheme.c1} 20%, ${currentTheme.c2} 50%, ${currentTheme.c3} 80%, transparent 100%)`
                }}
                className="absolute top-0 left-0 right-0 h-[2px] opacity-60"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
                {/* Genre */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="block text-[11px] sm:text-xs font-mono uppercase tracking-[0.18em] text-slate-300 font-semibold flex items-center gap-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: currentTheme.c1 }}
                    />
                    Genre / Paradigm
                  </label>
                  <input
                    name="genre"
                    value={formData.genre}
                    onChange={handleIdeaChange}
                    placeholder="e.g. Cyberpunk Tech-Noir, Cosmic Dread"
                    style={{ outlineColor: currentTheme.c1 }}
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-white/30 focus:bg-white/[0.06] rounded-xl px-3.5 py-3 sm:px-4 sm:py-3.5 text-white placeholder-slate-500 transition-all text-xs sm:text-sm"
                    required
                  />
                </div>

                {/* Tone */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="block text-[11px] sm:text-xs font-mono uppercase tracking-[0.18em] text-slate-300 font-semibold flex items-center gap-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: currentTheme.c2 }}
                    />
                    Atmosphere & Tone
                  </label>
                  <input
                    name="tone"
                    value={formData.tone}
                    onChange={handleIdeaChange}
                    placeholder="e.g. Gritty, Claustrophobic, Luminous"
                    style={{ outlineColor: currentTheme.c2 }}
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-white/30 focus:bg-white/[0.06] rounded-xl px-3.5 py-3 sm:px-4 sm:py-3.5 text-white placeholder-slate-500 transition-all text-xs sm:text-sm"
                    required
                  />
                </div>

                {/* Protagonist */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="block text-[11px] sm:text-xs font-mono uppercase tracking-[0.18em] text-slate-300 font-semibold flex items-center gap-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: currentTheme.c3 }}
                    />
                    Protagonist
                  </label>
                  <input
                    name="protagonist"
                    value={formData.protagonist}
                    onChange={handleIdeaChange}
                    placeholder="e.g. Burned-out memory extractor"
                    style={{ outlineColor: currentTheme.c3 }}
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-white/30 focus:bg-white/[0.06] rounded-xl px-3.5 py-3 sm:px-4 sm:py-3.5 text-white placeholder-slate-500 transition-all text-xs sm:text-sm"
                    required
                  />
                </div>

                {/* Setting */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="block text-[11px] sm:text-xs font-mono uppercase tracking-[0.18em] text-slate-300 font-semibold flex items-center gap-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: currentTheme.c1 }}
                    />
                    Setting / World
                  </label>
                  <input
                    name="setting"
                    value={formData.setting}
                    onChange={handleIdeaChange}
                    placeholder="e.g. Neo-Shinjuku Sub-Level 4"
                    style={{ outlineColor: currentTheme.c1 }}
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-white/30 focus:bg-white/[0.06] rounded-xl px-3.5 py-3 sm:px-4 sm:py-3.5 text-white placeholder-slate-500 transition-all text-xs sm:text-sm"
                    required
                  />
                </div>
              </div>

              {/* Premise */}
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] sm:text-xs font-mono uppercase tracking-[0.18em] text-slate-300 font-semibold flex items-center gap-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: currentTheme.c2 }}
                    />
                    Core Catalyst & Inciting Premise
                  </label>
                  <span className="text-[10px] sm:text-[11px] font-mono text-slate-500 hidden xs:inline">
                    What sets this tale into motion?
                  </span>
                </div>
                <textarea
                  name="premise"
                  value={formData.premise}
                  onChange={handleIdeaChange}
                  rows={4}
                  placeholder="Describe the inciting spark, central conflict, or impossible dilemma..."
                  style={{ outlineColor: currentTheme.c2 }}
                  className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-white/30 focus:bg-white/[0.06] rounded-xl p-3 sm:p-4 text-white placeholder-slate-500 transition-all text-xs sm:text-sm resize-none"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isGeneratingOutline}
                style={fullGradientButton}
                className="w-full relative group overflow-hidden text-white font-mono text-xs sm:text-sm uppercase tracking-wider sm:tracking-[0.18em] font-bold py-3.5 sm:py-4 px-4 sm:px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none cursor-pointer"
              >
                <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                  {isGeneratingOutline ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white"
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
                      <span>SYNTHESIZING ARCHITECTURE...</span>
                    </>
                  ) : (
                    <>
                      <span>SYNTHESIZE STORY BLUEPRINT</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>
            </form>
          </div>
        )}

        {/* STAGES 2 & 3: WIDE SPLIT-PANE WORKSPACE WITH RESPONSIVE MOBILE TABS */}
        {(stage === 2 || stage === 3) && outline && (
          <div>
            {/* Mobile View Toggle Segmented Tabs (<lg only) */}
            <div className="flex lg:hidden items-center justify-center mb-5">
              <div className="inline-flex p-1 rounded-2xl bg-black/50 border border-white/[0.12] backdrop-blur-xl shadow-lg">
                <button
                  onClick={() => setMobileTab("blueprint")}
                  style={
                    mobileTab === "blueprint"
                      ? {
                          backgroundColor: `${currentTheme.c2}25`,
                          borderColor: `${currentTheme.c2}50`,
                          color: currentTheme.c2
                        }
                      : {}
                  }
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all border border-transparent ${
                    mobileTab === "blueprint" ? "" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Blueprint</span>
                </button>
                <button
                  onClick={() => setMobileTab("chronicle")}
                  style={
                    mobileTab === "chronicle"
                      ? {
                          backgroundColor: `${currentTheme.c3}25`,
                          borderColor: `${currentTheme.c3}50`,
                          color: currentTheme.c3
                        }
                      : {}
                  }
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all border border-transparent ${
                    mobileTab === "chronicle" ? "" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Chronicle</span>
                  {isStreaming && (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping ml-0.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Split-Pane Grid Container */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
              {/* LEFT PANE: STORY ARCHITECT (Editable Blueprint) */}
              <div
                className={`lg:col-span-5 space-y-4 animate-fade-in-up ${
                  mobileTab === "blueprint" ? "block" : "hidden lg:block"
                }`}
              >
                <div className="cyber-glass-uniform rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-7 border border-white/[0.1] relative overflow-hidden shadow-2xl">
                  {/* Left Pane Gradient Accent Bar */}
                  <div
                    style={{
                      background: `linear-gradient(90deg, ${currentTheme.c1} 0%, ${currentTheme.c2} 100%)`
                    }}
                    className="absolute top-0 left-0 right-0 h-[2px] opacity-70"
                  />

                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/[0.08] mb-4 sm:mb-5">
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      <div
                        style={{
                          backgroundColor: `${currentTheme.c2}20`,
                          borderColor: `${currentTheme.c2}40`,
                          color: currentTheme.c2
                        }}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border flex items-center justify-center flex-shrink-0"
                      >
                        <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <div>
                        <h2 className="text-xs sm:text-sm font-mono uppercase tracking-[0.2em] font-bold text-white">
                          Stage 02 // Story Architect
                        </h2>
                        <p className="text-[10px] sm:text-[11px] font-mono text-slate-400">
                          Editable Outline & Narrative Beats
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleResetToPitch}
                      className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-mono text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] transition-colors cursor-pointer"
                      title="Scrap and re-pitch"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Re-Pitch</span>
                    </button>
                  </div>

                  {/* Metadata Badges */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-white/[0.06]">
                    <span
                      style={{
                        backgroundColor: `${currentTheme.c1}15`,
                        borderColor: `${currentTheme.c1}35`,
                        color: currentTheme.c1
                      }}
                      className="text-[10px] sm:text-[11px] font-mono px-2 sm:px-2.5 py-0.5 rounded-full border truncate max-w-[150px] sm:max-w-none"
                    >
                      {formData.genre}
                    </span>
                    <span
                      style={{
                        backgroundColor: `${currentTheme.c2}15`,
                        borderColor: `${currentTheme.c2}35`,
                        color: currentTheme.c2
                      }}
                      className="text-[10px] sm:text-[11px] font-mono px-2 sm:px-2.5 py-0.5 rounded-full border truncate max-w-[150px] sm:max-w-none"
                    >
                      {formData.tone}
                    </span>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-3 sm:space-y-4">
                    {/* Title */}
                    <div className="space-y-1 sm:space-y-1.5">
                      <label className="block text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.18em] text-slate-300 font-semibold">
                        Story Title
                      </label>
                      <input
                        name="title"
                        value={outline.title || ""}
                        onChange={handleOutlineChange}
                        style={{ outlineColor: currentTheme.c1 }}
                        className="w-full bg-white/[0.03] border border-white/[0.12] focus:bg-white/[0.05] rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5 text-white font-bold text-sm sm:text-base transition-all font-sans"
                      />
                    </div>

                    {/* Hook */}
                    <div className="space-y-1 sm:space-y-1.5">
                      <label
                        style={{ color: currentTheme.c1 }}
                        className="block text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.18em] font-semibold flex items-center justify-between"
                      >
                        <span>The Hook // Opening Line</span>
                        <span className="text-[9px] sm:text-[10px] text-slate-500">Incident</span>
                      </label>
                      <textarea
                        name="hook"
                        value={outline.hook || ""}
                        onChange={handleOutlineChange}
                        rows={2}
                        style={{ outlineColor: currentTheme.c1 }}
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm text-slate-200 transition-all resize-none"
                      />
                    </div>

                    {/* Act 1 */}
                    <div className="space-y-1 sm:space-y-1.5">
                      <label
                        style={{ color: currentTheme.c2 }}
                        className="block text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.18em] font-semibold"
                      >
                        Act I: Setup & Catalyst
                      </label>
                      <textarea
                        name="act_1_setup"
                        value={outline.act_1_setup || ""}
                        onChange={handleOutlineChange}
                        rows={3}
                        style={{ outlineColor: currentTheme.c2 }}
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm text-slate-200 transition-all resize-none"
                      />
                    </div>

                    {/* Act 2 */}
                    <div className="space-y-1 sm:space-y-1.5">
                      <label
                        style={{ color: currentTheme.c2 }}
                        className="block text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.18em] font-semibold"
                      >
                        Act II: Confrontation & Midpoint Reversal
                      </label>
                      <textarea
                        name="act_2_confrontation"
                        value={outline.act_2_confrontation || ""}
                        onChange={handleOutlineChange}
                        rows={3}
                        style={{ outlineColor: currentTheme.c2 }}
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm text-slate-200 transition-all resize-none"
                      />
                    </div>

                    {/* Act 3 */}
                    <div className="space-y-1 sm:space-y-1.5">
                      <label
                        style={{ color: currentTheme.c3 }}
                        className="block text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.18em] font-semibold"
                      >
                        Act III: Climax & Resolution
                      </label>
                      <textarea
                        name="act_3_resolution"
                        value={outline.act_3_resolution || ""}
                        onChange={handleOutlineChange}
                        rows={3}
                        style={{ outlineColor: currentTheme.c3 }}
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm text-slate-200 transition-all resize-none"
                      />
                    </div>
                  </div>

                  {/* Primary Ignition Action */}
                  <div className="pt-4 sm:pt-6 space-y-2.5 sm:space-y-3">
                    <button
                      onClick={handleStreamStory}
                      disabled={isStreaming}
                      style={fullGradientButton}
                      className="w-full relative group overflow-hidden text-white font-mono text-xs uppercase tracking-wider sm:tracking-[0.18em] font-bold py-3 sm:py-3.5 px-4 sm:px-5 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg disabled:opacity-50 disabled:transform-none cursor-pointer"
                    >
                      <div className="flex items-center justify-center gap-2">
                        {isStreaming ? (
                          <>
                            <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-white" />
                            <span>TRANSMITTING PROSE...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white fill-white" />
                            <span>
                              {storyText
                                ? "RE-BROADCAST CHRONICLE"
                                : "INITIALIZE CHRONICLE STREAM"}
                            </span>
                          </>
                        )}
                      </div>
                    </button>

                    <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-500 px-1">
                      <span>Target: ~600-1200 words</span>
                      <span>Markdown Prose</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT PANE: THE CHRONICLE (Live Streaming Reading View) */}
              <div
                className={`lg:col-span-7 space-y-4 animate-fade-in-up-delayed ${
                  mobileTab === "chronicle" ? "block" : "hidden lg:block"
                }`}
              >
                <div className="cyber-glass-uniform rounded-2xl sm:rounded-3xl border border-white/[0.1] p-4 sm:p-6 md:p-8 relative min-h-[460px] sm:min-h-[580px] flex flex-col shadow-2xl overflow-hidden">
                  {/* Right Pane Gradient Accent Bar */}
                  <div
                    style={{
                      background: `linear-gradient(90deg, ${currentTheme.c2} 0%, ${currentTheme.c3} 100%)`
                    }}
                    className="absolute top-0 left-0 right-0 h-[2px] opacity-70"
                  />

                  {/* Reader Toolbar Header - Responsive Layout */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 pb-3.5 sm:pb-5 border-b border-white/[0.08] mb-4 sm:mb-6 relative z-10">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div
                        style={{
                          backgroundColor: `${currentTheme.c3}20`,
                          borderColor: `${currentTheme.c3}40`,
                          color: currentTheme.c3
                        }}
                        className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl border flex items-center justify-center flex-shrink-0"
                      >
                        <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <h2 className="text-xs sm:text-sm font-mono uppercase tracking-[0.2em] font-bold text-white">
                            Stage 03 // The Chronicle
                          </h2>
                          {isStreaming && (
                            <span
                              style={{
                                backgroundColor: `${currentTheme.c3}20`,
                                borderColor: `${currentTheme.c3}50`,
                                color: currentTheme.c3
                              }}
                              className="flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] sm:text-[10px] font-mono font-bold animate-pulse"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                              <span className="hidden xs:inline">STREAMING</span>
                            </span>
                          )}
                          {!isStreaming && storyText && (
                            <span className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[9px] sm:text-[10px] font-mono text-emerald-400">
                              COMPLETE
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] sm:text-[11px] font-mono text-slate-400">
                          Cinematic Prose Output & Reader
                        </p>
                      </div>
                    </div>

                    {/* Reading Tools - Responsive Icons & Badges */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {storyText && (
                        <>
                          {/* Word Count Badge */}
                          <div className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[10px] sm:text-xs font-mono text-slate-300">
                            <FileText
                              className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                              style={{ color: currentTheme.c1 }}
                            />
                            <span>{wordCount}w</span>
                            <span className="text-slate-600 hidden xs:inline">|</span>
                            <span className="text-slate-400 hidden xs:inline">~{estimatedReadMinutes}m</span>
                          </div>

                          {/* Font size toggle */}
                          <button
                            onClick={() => {
                              setFontSize((prev) =>
                                prev === "sm"
                                  ? "base"
                                  : prev === "base"
                                  ? "lg"
                                  : "sm"
                              );
                              playCyberBlip(1000, 0.03);
                            }}
                            className="px-2 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-[10px] sm:text-xs font-mono text-slate-300 cursor-pointer"
                            title="Adjust typography size"
                          >
                            {fontSize.toUpperCase()}
                          </button>

                          {/* Copy Story */}
                          <button
                            onClick={handleCopyStory}
                            className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-[10px] sm:text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Copy story markdown"
                          >
                            {copied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="hidden sm:inline text-emerald-400">
                                  Copied
                                </span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-slate-400" />
                                <span className="hidden sm:inline">Copy</span>
                              </>
                            )}
                          </button>

                          {/* Download Markdown */}
                          <button
                            onClick={handleDownloadMarkdown}
                            className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-[10px] sm:text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Export as Markdown file"
                          >
                            <Download className="w-3.5 h-3.5 text-slate-400" />
                            <span className="hidden sm:inline">Export</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Main Content Area with Touch Scrolling */}
                  <div
                    ref={proseContainerRef}
                    className={`flex-1 overflow-y-auto max-h-[55vh] sm:max-h-[640px] pr-1.5 sm:pr-2 scrollbar-cyber relative z-10 ${
                      fontSize === "sm"
                        ? "text-sm sm:text-base"
                        : fontSize === "lg"
                        ? "text-lg sm:text-xl"
                        : "text-base sm:text-lg"
                    }`}
                  >
                    {/* State 1: Awaiting Generation */}
                    {!storyText && !isStreaming && (
                      <div className="h-full min-h-[340px] sm:min-h-[420px] flex flex-col items-center justify-center text-center p-4 sm:p-8 space-y-4 sm:space-y-5 border border-dashed border-white/[0.1] rounded-2xl bg-black/20">
                        <div className="relative">
                          <div
                            style={{
                              borderColor: `${currentTheme.c2}35`,
                              backgroundColor: `${currentTheme.c2}12`
                            }}
                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl border flex items-center justify-center text-white"
                          >
                            <Radio className="w-6 h-6 sm:w-8 sm:h-8 animate-pulse text-white" />
                          </div>
                          <div
                            style={{ backgroundColor: currentTheme.c3 }}
                            className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-black"
                          >
                            <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          </div>
                        </div>

                        <div className="space-y-1.5 sm:space-y-2 max-w-md px-2">
                          <h3 className="text-base sm:text-lg font-bold text-white">
                            Chronicle Broadcast Standby
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                            The narrative outline is staged in the architect console. Click{" "}
                            <span
                              className="font-mono font-bold"
                              style={{ color: currentTheme.c2 }}
                            >
                              "Initialize Chronicle Stream"
                            </span>{" "}
                            to begin real-time streaming prose generation.
                          </p>
                        </div>

                        <button
                          onClick={handleStreamStory}
                          style={fullGradientButton}
                          className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-white font-mono text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-widest font-bold transition-all transform hover:-translate-y-0.5 shadow-lg cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" />
                          <span>IGNITE CHRONICLE TRANSMISSION</span>
                        </button>
                      </div>
                    )}

                    {/* State 2: Live Streaming or Complete Story Prose */}
                    {(storyText || isStreaming) && (
                      <div className="prose-cinematic space-y-3 sm:space-y-4">
                        {/* Story Title Header */}
                        <div className="pb-3 sm:pb-4 mb-4 sm:mb-6 border-b border-white/[0.08]">
                          <h1
                            style={titleGradient}
                            className="text-xl sm:text-3xl font-extrabold tracking-tight"
                          >
                            {outline?.title || "The Chronicle"}
                          </h1>
                          <p
                            style={{ color: currentTheme.c1 }}
                            className="text-[10px] sm:text-xs font-mono tracking-widest uppercase mt-1 sm:mt-1.5"
                          >
                            Narrative Sequence // {formData.genre}
                          </p>
                        </div>

                        {/* Rendered Prose Content with Literary Typography */}
                        <div
                          style={{ fontFamily: currentFont.proseFont }}
                          className="text-slate-200 leading-[1.85] sm:leading-[1.92]"
                        >
                          <ReactMarkdown>{storyText}</ReactMarkdown>

                          {/* LIVE STREAMING GLOWING CURSOR BLOCK (|) */}
                          {isStreaming && (
                            <span
                              style={{
                                backgroundImage: `linear-gradient(180deg, ${currentTheme.c1} 0%, ${currentTheme.c2} 50%, ${currentTheme.c3} 100%)`
                              }}
                              className="inline-block w-2 sm:w-2.5 h-5 sm:h-6 ml-1 sm:ml-1.5 align-middle animate-cyber-cursor rounded-xs"
                              title="Active Token Stream"
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer Controls & Stats */}
                  {(storyText || isStreaming) && (
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px] sm:text-xs font-mono text-slate-500 relative z-10">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <button
                          onClick={() => setAutoScroll(!autoScroll)}
                          style={
                            autoScroll
                              ? {
                                  borderColor: `${currentTheme.c1}40`,
                                  backgroundColor: `${currentTheme.c1}12`,
                                  color: currentTheme.c1
                                }
                              : {}
                          }
                          className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 rounded text-[10px] sm:text-[11px] border border-white/[0.08] transition-colors cursor-pointer"
                        >
                          <span>Auto-scroll</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        </button>
                        <span className="hidden sm:inline">
                          Font:{" "}
                          <span className="text-slate-300 font-semibold">
                            {currentFont.name}
                          </span>
                        </span>
                      </div>

                      {!isStreaming && storyText && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleStartNewStory}
                            className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] transition-colors cursor-pointer text-[10px] sm:text-xs"
                          >
                            New Story
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );

  function handleStartNewStory() {
    playCyberBlip(700, 0.05);
    setStage(1);
    setOutline(null);
    setStoryText("");
    setIsStreaming(false);
    setMobileTab("blueprint");
  }
}
