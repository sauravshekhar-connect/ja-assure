import React, { useState, useEffect, useRef } from "react";
import { 
  Video, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Copy, 
  Check, 
  Layers, 
  Film,
  Music,
  Share2
} from "lucide-react";
import { MarketingAsset, VideoScriptData, BrandId } from "../types";

interface VideoStudioProps {
  assets: MarketingAsset[];
  selectedBrand: BrandId | "all";
  onAssetCreated: (asset: MarketingAsset) => void;
}

export const VideoStudio: React.FC<VideoStudioProps> = ({
  assets,
  selectedBrand,
  onAssetCreated,
}) => {
  // Find assets that have videoScript
  const videoAssets = assets.filter((a) => a.videoScript);
  const [selectedAssetId, setSelectedAssetId] = useState<string>(
    videoAssets[0]?.id || assets[0]?.id || ""
  );

  const activeAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];
  const videoScript: VideoScriptData | undefined = activeAsset?.videoScript;

  // Video Player Simulation State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [copied, setCopied] = useState(false);

  // New Generation in Video Studio
  const [customTopic, setCustomTopic] = useState("");
  const [videoBrand, setVideoBrand] = useState<BrandId>("jade");
  const [isGenerating, setIsGenerating] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Stop speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Web Speech API Voiceover Trigger
  const speakScene = (text: string) => {
    if (!audioEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    // Prefer English voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith("en"));
    if (englishVoice) utterance.voice = englishVoice;
    window.speechSynthesis.speak(utterance);
  };

  // Playback Loop
  const handlePlayToggle = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.pause();
      }
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setIsPlaying(true);
      if (videoScript?.scenes && videoScript.scenes.length > 0) {
        const scene = videoScript.scenes[currentSceneIdx];
        speakScene(scene?.voiceoverCue || videoScript.voiceoverFullScript);
      }

      // Interval ticker for simulation
      const totalSec = videoScript?.totalDurationSeconds || 30;
      timerRef.current = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            setCurrentSceneIdx(0);
            return 0;
          }
          const next = prev + 100 / (totalSec * 10);
          
          // Switch scene based on progress
          if (videoScript?.scenes) {
            const sceneCount = videoScript.scenes.length;
            const targetScene = Math.min(
              sceneCount - 1,
              Math.floor((next / 100) * sceneCount)
            );
            setCurrentSceneIdx((curr) => {
              if (curr !== targetScene) {
                speakScene(videoScript.scenes[targetScene]?.voiceoverCue || "");
                return targetScene;
              }
              return curr;
            });
          }

          return next;
        });
      }, 100);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setPlaybackProgress(0);
    setCurrentSceneIdx(0);
    if (timerRef.current) clearInterval(timerRef.current);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleGenerateReel = async () => {
    if (!customTopic.trim()) return;
    setIsGenerating(true);

    try {
      const res = await fetch("/api/agent/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: videoBrand,
          topic: customTopic,
          platform: "tiktok",
          format: "video",
          includeVideoScript: true,
        }),
      });
      const data = await res.json();
      onAssetCreated(data.asset);
      setSelectedAssetId(data.asset.id);
      setCustomTopic("");
      handleReset();
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyStoryboard = () => {
    if (!videoScript) return;
    const text = `JA ASSURE SHORT-FORM REEL PRODUCTION BRIEF
Brand: ${activeAsset?.brand.toUpperCase()}
Hook Title: ${videoScript.hookTitle}
Duration: ${videoScript.totalDurationSeconds}s
BGM Vibe: ${videoScript.audioBgmStyle}

VOICEOVER SCRIPT:
${videoScript.voiceoverFullScript}

SCENE STORYBOARD:
${videoScript.scenes.map(s => `[Scene ${s.sceneNumber} (${s.durationSeconds}s)]
Visual: ${s.visualPrompt}
Overlay: "${s.overlayText}"
Audio Cue: "${s.voiceoverCue}"`).join("\n\n")}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentScene = videoScript?.scenes?.[currentSceneIdx];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Short-Form Video & Reels Studio
              <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-red-500/20 text-red-300 border border-red-500/30 uppercase">
                Agent 03: Multi-Format
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Generate 9:16 vertical scripts, on-screen text overlays & synchronized Web Speech voiceover
            </p>
          </div>
        </div>

        {/* Storyboard Export Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyStoryboard}
            disabled={!videoScript}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Export Production Brief</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: 9:16 Interactive Video Player Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[320px] aspect-[9/16] rounded-3xl bg-slate-950 border-4 border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between p-4">
            
            {/* Dynamic Background Simulation */}
            <div className={`absolute inset-0 transition-opacity duration-700 ${
              currentSceneIdx === 0 
                ? "bg-gradient-to-b from-slate-900 via-emerald-950/40 to-slate-950" 
                : currentSceneIdx === 1 
                ? "bg-gradient-to-b from-slate-900 via-amber-950/40 to-slate-950" 
                : "bg-gradient-to-b from-slate-900 via-cyan-950/40 to-slate-950"
            }`}>
              {/* Subtle animated pattern */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
            </div>

            {/* Top Bar inside Phone */}
            <div className="relative z-10 flex items-center justify-between text-white text-[11px] font-mono">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                <span>REEL • {videoScript?.totalDurationSeconds || 30}s</span>
              </div>
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className="p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-black/80"
                title={audioEnabled ? "Mute audio" : "Enable voiceover narration"}
              >
                {audioEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
              </button>
            </div>

            {/* Middle: Visual Scene Graphic & Animated Captions */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center p-3">
              {/* Scene Indicator */}
              <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold mb-2">
                Scene {currentScene?.sceneNumber || 1} of {videoScript?.scenes?.length || 3}
              </div>

              {/* On-screen text overlay (Simulating Viral Reel Text) */}
              <div className="bg-black/75 backdrop-blur-md border border-white/15 px-3 py-2 rounded-xl shadow-xl max-w-[260px] animate-pulse">
                <span className="text-sm font-black text-amber-300 leading-snug drop-shadow-md">
                  {currentScene?.overlayText || videoScript?.hookTitle || "High-Value Insurance Blind Spots"}
                </span>
              </div>

              {/* Spoken cue preview */}
              <div className="mt-4 px-2 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-[11px] text-emerald-200 italic max-w-[240px]">
                "{currentScene?.voiceoverCue || "Watch the video to find out..."}"
              </div>
            </div>

            {/* Bottom: Channel Brand & Scrub Bar */}
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-xs text-white">
                  JA
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    JA Assure
                    <span className="text-[10px] text-emerald-400">✓</span>
                  </div>
                  <div className="text-[10px] text-slate-300">
                    #{activeAsset?.brand} #{activeAsset?.platform}
                  </div>
                </div>
              </div>

              {/* Scrub Bar */}
              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-100"
                  style={{ width: `${playbackProgress}%` }}
                ></div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3 pt-1">
                <button
                  onClick={handleReset}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs"
                  title="Reset"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handlePlayToggle}
                  className="p-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg"
                  title={isPlaying ? "Pause" : "Play Reel"}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
              </div>
            </div>

          </div>
          <div className="text-[11px] text-slate-400 mt-2 text-center">
            Click Play to test synchronized browser speech synthesis narration!
          </div>
        </div>

        {/* Right: Storyboard Breakdown & Reel Generator */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Active Asset Selector */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-400" />
                Select Reel from Content Library:
              </label>
              <select
                value={selectedAssetId}
                onChange={(e) => {
                  setSelectedAssetId(e.target.value);
                  handleReset();
                }}
                className="bg-slate-950 border border-slate-700 text-slate-300 rounded-lg px-2.5 py-1 text-xs max-w-[240px] truncate"
              >
                {assets.map((a) => (
                  <option key={a.id} value={a.id}>
                    [{a.brand.toUpperCase()}] {a.title.slice(0, 32)}...
                  </option>
                ))}
              </select>
            </div>

            {videoScript ? (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-300">
                  <span className="px-2 py-0.5 rounded bg-slate-800">
                    Hook: <strong className="text-amber-300">"{videoScript.hookTitle}"</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800">
                    Total Duration: <strong className="text-emerald-300">{videoScript.totalDurationSeconds}s</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 flex items-center gap-1">
                    <Music className="w-3 h-3 text-cyan-400" />
                    <span className="text-cyan-300 truncate">{videoScript.audioBgmStyle}</span>
                  </span>
                </div>

                {/* Voiceover Master Script */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-500 uppercase mb-1">
                    Full Spoken Voiceover Narration:
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed italic">
                    "{videoScript.voiceoverFullScript}"
                  </p>
                </div>

                {/* Scene Cards */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-300">
                    Scene-by-Scene Storyboard ({videoScript.scenes.length} Scenes):
                  </div>
                  {videoScript.scenes.map((scene) => (
                    <div
                      key={scene.sceneNumber}
                      onClick={() => {
                        setCurrentSceneIdx(scene.sceneNumber - 1);
                        speakScene(scene.voiceoverCue);
                      }}
                      className={`cursor-pointer p-3 rounded-xl border text-xs transition-all ${
                        currentSceneIdx === scene.sceneNumber - 1
                          ? "bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/30"
                          : "bg-slate-950 border-slate-800/80 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                        <span className="font-bold text-emerald-300">
                          Scene {scene.sceneNumber} • {scene.durationSeconds}s
                        </span>
                        <span className="text-slate-500">Click to preview scene</span>
                      </div>

                      <div className="text-slate-300 text-[11px] mb-1">
                        <strong>Visual Prompt:</strong> {scene.visualPrompt}
                      </div>

                      <div className="text-amber-300 text-[11px] font-semibold mb-1">
                        <strong>Text Overlay:</strong> "{scene.overlayText}"
                      </div>

                      <div className="text-slate-400 text-[11px] italic">
                        <strong>Spoken Audio Cue:</strong> "{scene.voiceoverCue}"
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-slate-950 text-center text-slate-400 text-xs">
                This asset does not yet have a video script generated. Use the generator below to create one instantly.
              </div>
            )}
          </div>

          {/* Reel Generator Quick Box */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Generate Fresh Short-Form Reel
            </h3>

            <div className="grid grid-cols-3 gap-2">
              {(["jade", "jaguar", "doctorshield"] as BrandId[]).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setVideoBrand(b)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold capitalize border ${
                    videoBrand === b
                      ? "bg-slate-800 text-white border-slate-600"
                      : "bg-slate-950 text-slate-400 border-slate-800"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="e.g. 3 reasons doctors get sued even when treatments go right..."
              className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500"
            />

            <button
              onClick={handleGenerateReel}
              disabled={isGenerating || !customTopic.trim()}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all disabled:opacity-50"
            >
              {isGenerating ? "Generating Storyboard & Voiceover..." : "Generate Reel Script with Gemini"}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
