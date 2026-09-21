import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Volume2,
  VolumeX,
  CloudRain,
  Coins,
  ArrowRight,
  Sparkles,
  Menu,
  X,
  Compass,
  Layers,
  ChevronRight,
  Maximize2,
  Zap,
} from "lucide-react";

interface CoverPageProps {
  onEnter: () => void;
}

// 3D Particle with position, target, velocity and color
interface Particle3D {
  x: number;
  y: number;
  z: number;
  tx: number;
  ty: number;
  tz: number;
  vx: number;
  vy: number;
  vz: number;
  baseSize: number;
  r: number;
  g: number;
  b: number;
  alpha: number;
  pulsePhase: number;
  pulseSpeed: number;
}

export const CoverPage: React.FC<CoverPageProps> = ({ onEnter }) => {
  // Directly start on the active 3D particle view
  const [phase, setPhase] = useState<"active_3d" | "warping">("active_3d");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentShapeIndex, setCurrentShapeIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHoveringOrb, setIsHoveringOrb] = useState(false);

  // Canvas & Audio refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const raindropTimerRef = useRef<number | null>(null);
  const rainSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // 3D Engine State
  const particlesRef = useRef<Particle3D[]>([]);
  const rotationRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const mouseRef = useRef({ x: 0, y: 0, isDown: false, lastX: 0, lastY: 0 });
  const shockwaveRef = useRef<{ x: number; y: number; progress: number } | null>(null);

  // Content stages matching video aesthetic
  const stages = useMemo(
    () => [
      {
        id: "monogram",
        tag: "01 / MONOGRAM",
        prefix: "Where",
        title: "AMBITIOUS IDEAS BECOME REVENUE PEOPLE REMEMBER",
        description: "ScaleUp orchestrates autonomous InsurTech growth, brand dominance, and multi-market conversion for JA Assure.",
        quote: "BEAUTY WITH A REASON",
      },
      {
        id: "torus",
        tag: "02 / THE VORTEX",
        prefix: "We",
        title: "BUILD FOR LEADERS WHO CARE HOW GROWTH FEELS",
        description: "Every impression, underwriting lead, and video campaign connects to closed-loop ARR across Singapore, Malaysia, and Hong Kong.",
        quote: "PRECISION AT SCALE",
      },
      {
        id: "nebula",
        tag: "03 / THE SUPERNOVA",
        prefix: "Here",
        title: "CAPITAL, COMPLIANCE & CREATIVITY UNITE IN HARMONY",
        description: "Instant MAS and BNM regulatory verification powering high-velocity jewelry, transit, and medical protection portfolios.",
        quote: "AUTONOMOUS VELOCITY",
      },
      {
        id: "helix",
        tag: "04 / EXPONENTIAL DYNAMICS",
        prefix: "Infinite",
        title: "EXPONENTIAL VALUE MINTED AT THE SPEED OF THOUGHT",
        description: "ScaleUp's closed-loop neural hands monitor lead radar, synthesize broadcast video, and capture untapped market share.",
        quote: "EXPONENTIAL ORBIT",
      },
    ],
    []
  );

  // ----------------------------------------------------
  // Coin & Cash Sound Synthesizer (Cash Register + Gold Coins Cascade)
  // ----------------------------------------------------
  const playCashCoinSound = (ctx: AudioContext) => {
    try {
      const now = ctx.currentTime;

      // 1. Mechanical cash drawer latch / percussive snap
      const snapOsc = ctx.createOscillator();
      const snapGain = ctx.createGain();
      snapOsc.type = "triangle";
      snapOsc.frequency.setValueAtTime(320, now);
      snapOsc.frequency.exponentialRampToValueAtTime(40, now + 0.04);
      snapGain.gain.setValueAtTime(0.35, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
      snapOsc.connect(snapGain);
      snapGain.connect(ctx.destination);
      snapOsc.start(now);
      snapOsc.stop(now + 0.05);

      // 2. Twin crystal cash register bell strikes: "Cha-Ching!"
      const bells = [2093.0, 3135.96, 4186.0]; // C7, G7, C8
      bells.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        const startTime = now + idx * 0.035;
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(0.2, startTime + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.85);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.9);
      });

      // 3. Cascade of ringing gold coins spilling into the tray
      const coins = [
        { t: 0.05, f: 2489, dur: 0.22, v: 0.18 },
        { t: 0.10, f: 3322, dur: 0.25, v: 0.22 },
        { t: 0.15, f: 2793, dur: 0.23, v: 0.16 },
        { t: 0.21, f: 3951, dur: 0.30, v: 0.25 },
        { t: 0.27, f: 3135, dur: 0.32, v: 0.19 },
        { t: 0.33, f: 4698, dur: 0.35, v: 0.20 },
        { t: 0.39, f: 5274, dur: 0.38, v: 0.16 },
      ];

      coins.forEach(({ t, f, dur, v }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle"; // metallic ring
        const startT = now + t;
        osc.frequency.setValueAtTime(f, startT);
        osc.frequency.exponentialRampToValueAtTime(f * 1.012, startT + dur);
        gain.gain.setValueAtTime(0.0001, startT);
        gain.gain.linearRampToValueAtTime(v, startT + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.0001, startT + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startT);
        osc.stop(startT + dur);
      });
    } catch {
      // Audio fail-safe
    }
  };

  // ----------------------------------------------------
  // Relaxing Generative Rain & Ambient Meditation Engine
  // ----------------------------------------------------
  const startRelaxingRainSoundscape = useCallback(() => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      // If already initialized, smoothly un-mute or resume
      if (audioCtxRef.current && masterGainRef.current) {
        if (audioCtxRef.current.state === "suspended") {
          audioCtxRef.current.resume();
        }
        const g = masterGainRef.current;
        g.gain.cancelScheduledValues(audioCtxRef.current.currentTime);
        g.gain.setValueAtTime(g.gain.value, audioCtxRef.current.currentTime);
        g.gain.exponentialRampToValueAtTime(0.12, audioCtxRef.current.currentTime + 1.2);
        setSoundEnabled(true);
        return;
      }

      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Master output gain with gentle swell
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 2.0);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // 1. Continuous soothing rain generator (pink noise filtered)
      const bufferLength = ctx.sampleRate * 4;
      const noiseBuffer = ctx.createBuffer(1, bufferLength, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferLength; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.09;
        b6 = white * 0.115926;
      }

      const rainSource = ctx.createBufferSource();
      rainSource.buffer = noiseBuffer;
      rainSource.loop = true;
      rainSourceRef.current = rainSource;

      // Multi-stage rain filters: natural rainfall timbre
      const rainLowpass = ctx.createBiquadFilter();
      rainLowpass.type = "lowpass";
      rainLowpass.frequency.setValueAtTime(2600, ctx.currentTime);

      const rainBandpass = ctx.createBiquadFilter();
      rainBandpass.type = "bandpass";
      rainBandpass.frequency.setValueAtTime(1150, ctx.currentTime);
      rainBandpass.Q.setValueAtTime(0.85, ctx.currentTime);

      const rainGain = ctx.createGain();
      rainGain.gain.setValueAtTime(0.22, ctx.currentTime);

      rainSource.connect(rainLowpass);
      rainLowpass.connect(rainBandpass);
      rainBandpass.connect(rainGain);
      rainGain.connect(masterGain);
      rainSource.start();

      // 2. Warm ambient bed drone (Eb Maj chord) for deep meditation underneath
      const droneFilter = ctx.createBiquadFilter();
      droneFilter.type = "lowpass";
      droneFilter.frequency.setValueAtTime(360, ctx.currentTime);
      droneFilter.connect(masterGain);

      const chordFreqs = [155.56, 196.00, 233.08]; // Eb3, G3, Bb3
      chordFreqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        g.gain.setValueAtTime(0.045, ctx.currentTime);
        osc.connect(g);
        g.connect(droneFilter);
        osc.start();
      });

      // 3. Delicate water droplet engine (soft raindrop plinks hitting the water)
      const timer = window.setInterval(() => {
        if (!audioCtxRef.current || audioCtxRef.current.state !== "running") return;
        if (!soundEnabled) return;
        if (Math.random() > 0.4) return;

        try {
          const actx = audioCtxRef.current;
          const dropOsc = actx.createOscillator();
          const dropGain = actx.createGain();
          dropOsc.type = "sine";

          const startF = 1300 + Math.random() * 850;
          dropOsc.frequency.setValueAtTime(startF, actx.currentTime);
          dropOsc.frequency.exponentialRampToValueAtTime(startF * 0.4, actx.currentTime + 0.07);

          dropGain.gain.setValueAtTime(0.0001, actx.currentTime);
          dropGain.gain.linearRampToValueAtTime(0.018 + Math.random() * 0.015, actx.currentTime + 0.003);
          dropGain.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + 0.07);

          dropOsc.connect(dropGain);
          dropGain.connect(masterGain);

          dropOsc.start();
          dropOsc.stop(actx.currentTime + 0.075);
        } catch {
          // ignore
        }
      }, 190);

      raindropTimerRef.current = timer;
      setSoundEnabled(true);
    } catch (e) {
      console.warn("Audio waiting for user gesture:", e);
    }
  }, [soundEnabled]);

  // Toggle Mute / Unmute
  const toggleAudio = useCallback(() => {
    if (!audioCtxRef.current || !masterGainRef.current) {
      startRelaxingRainSoundscape();
      return;
    }

    const ctx = audioCtxRef.current;
    const g = masterGainRef.current;

    if (soundEnabled) {
      g.gain.cancelScheduledValues(ctx.currentTime);
      g.gain.setValueAtTime(g.gain.value, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      setSoundEnabled(false);
    } else {
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      g.gain.cancelScheduledValues(ctx.currentTime);
      g.gain.setValueAtTime(g.gain.value, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.8);
      setSoundEnabled(true);
    }
  }, [soundEnabled, startRelaxingRainSoundscape]);

  // Interactive chime on click / morph
  const playMorphChime = () => {
    if (!soundEnabled || !audioCtxRef.current || !masterGainRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";

      const freqs = [622.25, 783.99, 932.33, 1046.5]; // Eb5, G5, Bb5, C6
      const f = freqs[Math.floor(Math.random() * freqs.length)];
      osc.frequency.setValueAtTime(f, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(f * 1.3, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(masterGainRef.current);

      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch {
      // Audio fail-safe
    }
  };

  // ----------------------------------------------------
  // Autoplay & Browser Interaction Gesture Handler
  // ----------------------------------------------------
  useEffect(() => {
    // Attempt instant relaxing rain audio startup
    startRelaxingRainSoundscape();

    // In case browser autoplay policy initially suspended the context,
    // seamlessly resume on first user click, tap, or key press
    const handleFirstGesture = () => {
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      } else if (!audioCtxRef.current) {
        startRelaxingRainSoundscape();
      }
    };

    window.addEventListener("pointerdown", handleFirstGesture, { once: true });
    window.addEventListener("keydown", handleFirstGesture, { once: true });
    window.addEventListener("touchstart", handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
      if (raindropTimerRef.current) {
        clearInterval(raindropTimerRef.current);
      }
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch {
          // ignore
        }
        audioCtxRef.current = null;
      }
    };
  }, [startRelaxingRainSoundscape]);

  // ----------------------------------------------------
  // 3D Particle Target Shapes Generation (Lush Green Theme)
  // ----------------------------------------------------
  const PARTICLE_COUNT = 1800;

  const calculateTarget = useCallback((index: number, shape: number) => {
    const i = index;
    const count = PARTICLE_COUNT;

    // 0: The 3D "S" ScaleUp Monogram (Luminous Emerald & Mint Glow)
    if (shape === 0) {
      const t = (i / count) * Math.PI * 3.2 - Math.PI * 1.6;
      const y = t * 75;
      const x = Math.sin(t) * 130 + (Math.sin(t * 2) * 25);
      const z = Math.cos(t * 1.5) * 60;
      const spread = 28 * (Math.random() - 0.5);
      return {
        x: x + spread * 1.5,
        y: -y + spread * 1.5,
        z: z + spread * 1.5,
        r: 45 + Math.random() * 40, // Emerald & Mint
        g: 225 + Math.random() * 30,
        b: 165 + Math.random() * 50,
      };
    }

    // 1: The Luminous 3D Torus Vortex (Neon Jade & Mint Aurora)
    if (shape === 1) {
      const u = (i / count) * Math.PI * 2 * 6;
      const v = ((i % 120) / 120) * Math.PI * 2;
      const R = 180; // Major radius
      const r = 55 + (Math.sin(u * 2) * 15); // Minor radius
      const x = (R + r * Math.cos(v)) * Math.cos(u);
      const y = (R + r * Math.cos(v)) * Math.sin(u) * 0.45;
      const z = r * Math.sin(v) + (Math.random() - 0.5) * 20;
      return {
        x,
        y,
        z,
        r: 16 + Math.random() * 40, // Vivid Jade Green
        g: 235 + Math.random() * 20,
        b: 135 + Math.random() * 60,
      };
    }

    // 2: The Nova Heart / Breathing Nebula (Luminous Mint Stardust)
    if (shape === 2) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const radius = 170 * (0.6 + 0.4 * Math.random()) * (1 + 0.25 * Math.sin(theta * 3));
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi) * 1.15;
      const z = radius * Math.cos(phi);
      return {
        x,
        y,
        z,
        r: 160 + Math.random() * 60, // Mint Stardust
        g: 245 + Math.random() * 10,
        b: 200 + Math.random() * 55,
      };
    }

    // 3: The Infinite Growth Helix / Double Spiral (Vivid Emerald & Lime Gold)
    const t = (i / count) * Math.PI * 6 - Math.PI * 3;
    const strand = i % 2 === 0 ? 1 : -1;
    const radius = 130 + Math.sin(t) * 30;
    const x = Math.cos(t) * radius * strand;
    const y = t * 65;
    const z = Math.sin(t) * radius;
    const scatter = (Math.random() - 0.5) * 30;
    return {
      x: x + scatter,
      y: y + scatter,
      z: z + scatter,
      r: strand === 1 ? 52 : 234, // Emerald + Lime Gold strands
      g: strand === 1 ? 211 : 230,
      b: strand === 1 ? 153 : 60,
    };
  }, []);

  // Update target coordinates for all particles when shape changes
  const applyShape = useCallback(
    (shapeIndex: number) => {
      particlesRef.current.forEach((p, idx) => {
        const target = calculateTarget(idx, shapeIndex);
        p.tx = target.x;
        p.ty = target.y;
        p.tz = target.z;
        p.r = target.r;
        p.g = target.g;
        p.b = target.b;
      });
      playMorphChime();
    },
    [calculateTarget]
  );

  // Switch to next shape
  const nextShape = () => {
    setCurrentShapeIndex((prev) => {
      const next = (prev + 1) % stages.length;
      applyShape(next);
      return next;
    });
  };

  // ----------------------------------------------------
  // 3D Canvas Loop with Water Surface Mirror & Shimmer
  // ----------------------------------------------------
  useEffect(() => {
    if (phase !== "active_3d" && phase !== "warping") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Initialize particles if empty
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const target = calculateTarget(i, currentShapeIndex);
        particlesRef.current.push({
          x: (Math.random() - 0.5) * width,
          y: (Math.random() - 0.5) * height,
          z: (Math.random() - 0.5) * 400,
          tx: target.x,
          ty: target.y,
          tz: target.z,
          vx: 0,
          vy: 0,
          vz: 0,
          baseSize: 1.8 + Math.random() * 3.2,
          r: target.r,
          g: target.g,
          b: target.b,
          alpha: 0.4 + Math.random() * 0.6,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.03 + Math.random() * 0.04,
        });
      }
    }

    let time = 0;

    const render = () => {
      time += 0.015;

      // Smooth inertia rotation
      const rot = rotationRef.current;
      rot.x += (rot.targetX - rot.x) * 0.08;
      rot.y += (rot.targetY - rot.y) * 0.08;

      // Slight natural breathing oscillation
      const autoRotY = rot.y + Math.sin(time * 0.5) * 0.15;
      const autoRotX = rot.x + Math.cos(time * 0.3) * 0.08;

      const cosY = Math.cos(autoRotY);
      const sinY = Math.sin(autoRotY);
      const cosX = Math.cos(autoRotX);
      const sinX = Math.sin(autoRotX);

      // Background clear: Lush green dusk twilight gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, "#041a12"); // Deep emerald night
      bgGrad.addColorStop(0.35, "#083324"); // Luminous jade twilight
      bgGrad.addColorStop(0.55, "#0e4a35"); // Sunset mint mist
      bgGrad.addColorStop(0.6, "#062319"); // Horizon ridge line
      bgGrad.addColorStop(0.68, "#031710"); // Silky dark emerald lake surface
      bgGrad.addColorStop(1, "#010a07"); // Deep water abyss
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw Horizon Mountain Silhouettes (Deep emerald ridges)
      const horizonY = height * 0.6;
      ctx.save();
      ctx.fillStyle = "rgba(3, 16, 11, 0.96)";
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      // Serrated mountain ridge
      ctx.lineTo(width * 0.1, horizonY - 35);
      ctx.lineTo(width * 0.22, horizonY - 12);
      ctx.lineTo(width * 0.35, horizonY - 45);
      ctx.lineTo(width * 0.45, horizonY - 20);
      ctx.lineTo(width * 0.55, horizonY - 25);
      ctx.lineTo(width * 0.68, horizonY - 50);
      ctx.lineTo(width * 0.82, horizonY - 18);
      ctx.lineTo(width * 0.92, horizonY - 38);
      ctx.lineTo(width, horizonY - 15);
      ctx.lineTo(width, horizonY + 2);
      ctx.lineTo(0, horizonY + 2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Atmospheric glowing mist along the horizon (Emerald aura)
      const mistGrad = ctx.createLinearGradient(0, horizonY - 60, 0, horizonY + 40);
      mistGrad.addColorStop(0, "rgba(52, 211, 153, 0)");
      mistGrad.addColorStop(0.5, "rgba(52, 211, 153, 0.24)");
      mistGrad.addColorStop(1, "rgba(3, 16, 11, 0)");
      ctx.fillStyle = mistGrad;
      ctx.fillRect(0, horizonY - 60, width, 100);

      // Camera parameters
      const fov = 420;
      const centerX = width / 2;
      const centerY = height * 0.42; // Above water level

      // Update Shockwave if active
      if (shockwaveRef.current) {
        shockwaveRef.current.progress += 0.04;
        if (shockwaveRef.current.progress >= 1) {
          shockwaveRef.current = null;
        }
      }

      // Sort and project particles
      const particles = particlesRef.current;
      const projected: Array<{
        x2d: number;
        y2d: number;
        scale: number;
        alpha: number;
        size: number;
        color: string;
        glowColor: string;
        z3d: number;
      }> = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Smooth spring towards target
        p.vx = (p.tx - p.x) * 0.06;
        p.vy = (p.ty - p.y) * 0.06;
        p.vz = (p.tz - p.z) * 0.06;

        // Shockwave displacement
        if (shockwaveRef.current) {
          const sw = shockwaveRef.current;
          const dx = p.x - sw.x;
          const dy = p.y - sw.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const waveRadius = sw.progress * 380;
          const diff = Math.abs(dist - waveRadius);
          if (diff < 60) {
            const force = (1 - diff / 60) * (1 - sw.progress) * 45;
            p.x += (dx / (dist || 1)) * force;
            p.y += (dy / (dist || 1)) * force;
          }
        }

        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // 3D Rotation (Yaw Y, then Pitch X)
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;

        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        // Perspective projection
        const zDist = z2 + 500;
        if (zDist <= 10) continue;

        const scale = fov / zDist;
        const x2d = centerX + x1 * scale;
        const y2d = centerY + y2 * scale;

        // Shimmer pulse
        p.pulsePhase += p.pulseSpeed;
        const pulse = 0.8 + 0.3 * Math.sin(p.pulsePhase);

        projected.push({
          x2d,
          y2d,
          scale,
          size: Math.max(0.8, p.baseSize * scale * pulse),
          alpha: Math.min(1, Math.max(0.1, p.alpha * (scale * 1.1))),
          color: `rgba(${p.r}, ${p.g}, ${p.b}, `,
          glowColor: `rgba(${p.r}, ${p.g}, ${p.b}, 0.35)`,
          z3d: z2,
        });
      }

      // Sort by depth (back to front)
      projected.sort((a, b) => b.z3d - a.z3d);

      // ----------------------------------------------------
      // DRAW 1: Water Surface Reflection (Bottom half mirroring)
      // ----------------------------------------------------
      for (let i = 0; i < projected.length; i += 2) {
        const p = projected[i];
        const distFromHorizon = p.y2d - horizonY;
        if (distFromHorizon < -10) {
          // Reflect below horizon with ripple distortion
          const refY = horizonY + Math.abs(distFromHorizon) * 0.75;
          if (refY < height) {
            const ripple = Math.sin(time * 3 + refY * 0.05) * 6;
            const refAlpha = p.alpha * 0.28 * Math.max(0, 1 - (refY - horizonY) / (height * 0.4));

            ctx.beginPath();
            ctx.arc(p.x2d + ripple, refY, p.size * 1.1, 0, Math.PI * 2);
            ctx.fillStyle = p.color + refAlpha + ")";
            ctx.fill();
          }
        }
      }

      // Water subtle ripple lines with green tint
      ctx.strokeStyle = "rgba(52, 211, 153, 0.04)";
      ctx.lineWidth = 1;
      for (let y = horizonY + 15; y < height; y += 18) {
        ctx.beginPath();
        ctx.moveTo(0, y + Math.sin(time * 2 + y) * 2);
        ctx.lineTo(width, y + Math.sin(time * 2 + y) * 2);
        ctx.stroke();
      }

      // ----------------------------------------------------
      // DRAW 2: Main 3D Particle Cloud Sculpture (Above water)
      // ----------------------------------------------------
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];

        // Draw particle body
        ctx.beginPath();
        ctx.arc(p.x2d, p.y2d, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ")";
        ctx.fill();

        // Shimmer aura on prominent particles
        if (p.size > 2.8) {
          ctx.beginPath();
          ctx.arc(p.x2d, p.y2d, p.size * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = p.glowColor;
          ctx.fill();
        }
      }

      // Subtle atmospheric starlight particles
      ctx.fillStyle = "rgba(167, 243, 208, 0.5)";
      for (let s = 0; s < 12; s++) {
        const sx = ((s * 197 + time * 15) % width);
        const sy = (s * 83) % (horizonY - 80);
        ctx.fillRect(sx, sy, 1.2, 1.2);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [phase, calculateTarget, currentShapeIndex]);

  // ----------------------------------------------------
  // Interactive Mouse / Touch Orbit & Shockwave
  // ----------------------------------------------------
  const handlePointerDown = (e: React.PointerEvent) => {
    mouseRef.current.isDown = true;
    mouseRef.current.lastX = e.clientX;
    mouseRef.current.lastY = e.clientY;

    // Trigger shockwave at click position
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left - rect.width / 2;
      const clickY = e.clientY - rect.top - rect.height * 0.42;
      shockwaveRef.current = { x: clickX, y: clickY, progress: 0 };
      playMorphChime();
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    // Parallax tilt even without dragging
    const normX = (e.clientX / window.innerWidth - 0.5) * 2;
    const normY = (e.clientY / window.innerHeight - 0.5) * 2;

    if (!mouseRef.current.isDown) {
      rotationRef.current.targetY = normX * 0.4;
      rotationRef.current.targetX = -normY * 0.25;
      return;
    }

    const dx = e.clientX - mouseRef.current.lastX;
    const dy = e.clientY - mouseRef.current.lastY;
    rotationRef.current.targetY += dx * 0.008;
    rotationRef.current.targetX -= dy * 0.008;

    mouseRef.current.lastX = e.clientX;
    mouseRef.current.lastY = e.clientY;
  };

  const handlePointerUp = () => {
    mouseRef.current.isDown = false;
  };

  // Launch into main application with camera warp & coin / cash sound
  const handleEnterWorkspace = () => {
    setPhase("warping");

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtx();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === "suspended") {
          ctx.resume();
        }
        // Play the satisfying cash register + cascading gold coins sound
        playCashCoinSound(ctx);

        // Ascending warp whoosh
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.6);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.65);
      }
    } catch (e) {
      console.warn("Coin audio error:", e);
    }

    setTimeout(() => {
      onEnter();
    }, 700);
  };

  const currentStage = stages[currentShapeIndex];

  return (
    <div
      id="scaleup-awwwards-portal"
      className="fixed inset-0 z-50 overflow-hidden bg-[#03130d] select-none font-sans"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* ========================================================
          3D INTERACTIVE PARTICLE CANVAS & WATER SCULPTURE
          ======================================================== */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-auto cursor-grab active:cursor-grabbing z-0"
      />

      {/* ========================================================
          EDITORIAL OVERLAY & NARRATIVE HEADLINES
          ======================================================== */}
      {(phase === "active_3d" || phase === "warping") && (
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6 sm:p-10 lg:p-12">
          {/* Top Editorial Header (Prominent Size & Elegant Display Typography) */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif-display uppercase tracking-wider text-white drop-shadow-[0_2px_18px_rgba(16,185,129,0.7)] flex flex-wrap items-baseline gap-2">
                  <span>JA ASSURE</span>
                  <span className="text-emerald-400 font-editorial italic font-normal lowercase tracking-normal text-2xl sm:text-3xl lg:text-4xl">
                    marketing engine
                  </span>
                </h1>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-emerald-200/80 tracking-widest pl-5">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-semibold text-[10px]">
                  AUTONOMOUS RADAR
                </span>
                <span>[ SINGAPORE • MALAYSIA • HONG KONG ]</span>
              </div>
            </div>

            {/* Current Shape & Relaxing Rain Audio Controls */}
            <div className="flex items-center gap-3 pointer-events-auto">
              <button
                id="header-sound-toggle-btn"
                onClick={toggleAudio}
                className={`px-3.5 py-2 rounded-full backdrop-blur-md border text-xs font-mono tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                  soundEnabled
                    ? "bg-emerald-500/20 border-emerald-400/50 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.35)]"
                    : "bg-white/10 hover:bg-white/20 border-white/15 text-white/60"
                }`}
                title={soundEnabled ? "Mute relaxing rain" : "Play relaxing rain sound"}
              >
                {soundEnabled ? (
                  <>
                    <CloudRain className="w-4 h-4 text-emerald-300 animate-bounce" />
                    <span className="hidden sm:inline text-xs font-semibold">Relaxing Rain On</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 opacity-60" />
                    <span className="hidden sm:inline text-xs">Rain Muted</span>
                  </>
                )}
              </button>

              <button
                onClick={nextShape}
                className="px-3.5 py-2 rounded-full bg-emerald-950/60 hover:bg-emerald-900/60 backdrop-blur-md border border-emerald-500/30 text-emerald-100 text-xs font-mono tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(5,150,105,0.2)]"
                title="Cycle 3D Morph"
              >
                <span>{currentStage.tag}</span>
                <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-spin" />
              </button>

              <button
                onClick={handleEnterWorkspace}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-400 text-slate-950 font-black text-xs hover:bg-emerald-300 transition-all shadow-[0_0_20px_rgba(52,211,153,0.5)] cursor-pointer"
                title="Enter with cash sound"
              >
                <Coins className="w-3.5 h-3.5 text-slate-950" />
                <span>Enter Workspace</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
              </button>
            </div>
          </div>

          {/* Left Hero Editorial Typography */}
          <div className="max-w-xl pb-16 pointer-events-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStage.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="space-y-3"
              >
                {/* Prefix italic serif */}
                <div className="text-2xl sm:text-3xl font-editorial italic text-emerald-200/90 font-light">
                  {currentStage.prefix}
                </div>

                {/* Big condensed uppercase headline */}
                <h2 className="text-3xl sm:text-5xl font-black font-serif-display uppercase tracking-tight text-white leading-tight drop-shadow-[0_4px_20px_rgba(4,120,87,0.7)]">
                  {currentStage.title}
                </h2>

                <p className="text-xs sm:text-sm font-mono text-emerald-100/80 max-w-md leading-relaxed">
                  {currentStage.description}
                </p>

                {/* Interactive Click prompt */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={nextShape}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-mono font-medium hover:bg-emerald-500/30 transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  >
                    <span>Morph 3D Sculpture</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono text-emerald-300/50 hidden sm:inline">
                    (Click or drag screen to tilt & distort)
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Floating Dock Bar (Green Themed) */}
          <div className="w-full flex items-center justify-center pointer-events-auto">
            <div className="flex items-center gap-3 sm:gap-4 px-4 py-2.5 rounded-full bg-[#062117]/90 border border-emerald-500/30 backdrop-blur-2xl shadow-[0_20px_50px_rgba(1,12,8,0.9)]">
              {/* Menu Drawer Toggle */}
              <button
                id="cover-dock-menu-btn"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full hover:bg-emerald-500/20 text-emerald-200 transition-all cursor-pointer"
                title="Open Controls Menu"
              >
                {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>

              {/* Sound Quick Toggle (Rain) */}
              <button
                id="cover-dock-audio-btn"
                onClick={toggleAudio}
                className="p-2 rounded-full hover:bg-emerald-500/20 text-emerald-200 transition-all cursor-pointer relative"
                title={soundEnabled ? "Mute relaxing rain" : "Play relaxing rain"}
              >
                {soundEnabled ? (
                  <>
                    <CloudRain className="w-4 h-4 text-emerald-300 animate-pulse" />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  </>
                ) : (
                  <VolumeX className="w-4 h-4 text-emerald-100/50" />
                )}
              </button>

              {/* Center Logo */}
              <div
                onClick={nextShape}
                className="flex items-center gap-2 px-2 sm:px-3 py-1 cursor-pointer group"
                title="Click to morph shape"
              >
                <span className="text-lg font-black font-3d-logo-emerald tracking-wide text-white group-hover:scale-105 transition-transform">
                  Scale<span className="text-emerald-400">Up</span>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>

              {/* Primary Entrance Action with Coin Sound */}
              <button
                id="cover-dock-enter-main-btn"
                onClick={handleEnterWorkspace}
                className="px-4 sm:px-5 py-2 rounded-full bg-emerald-400 text-slate-950 font-black text-xs tracking-tight flex items-center gap-2 hover:bg-emerald-300 hover:shadow-[0_0_25px_rgba(52,211,153,0.7)] transition-all cursor-pointer"
                title="Enter workspace (Coin sound)"
              >
                <Coins className="w-4 h-4 text-slate-950" />
                <span>Enter Workspace</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
              </button>

              {/* Holographic Glowing Interactive Orb */}
              <div
                onMouseEnter={() => setIsHoveringOrb(true)}
                onMouseLeave={() => setIsHoveringOrb(false)}
                onClick={nextShape}
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-400 to-lime-300 p-0.5 shadow-[0_0_18px_rgba(52,211,153,0.8)] cursor-pointer hover:scale-110 transition-transform flex items-center justify-center"
                title="Holographic Core: Click to cycle"
              >
                <div className="w-full h-full rounded-full bg-[#041a12]/80 backdrop-blur-sm flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-emerald-200 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SLIDE-UP MENU DRAWER (Green Themed)
          ======================================================== */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-md p-6 rounded-3xl bg-[#062117]/95 border border-emerald-500/30 backdrop-blur-3xl shadow-[0_30px_70px_rgba(1,12,8,0.95)] z-30 text-white"
          >
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4 mb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-300">
                SCALEUP SETTINGS & NAVIGATION
              </span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-emerald-300/60 hover:text-emerald-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Menu Links */}
            <div className="space-y-2 mb-6 font-mono text-sm">
              {stages.map((stg, idx) => (
                <button
                  key={stg.id}
                  onClick={() => {
                    setCurrentShapeIndex(idx);
                    applyShape(idx);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer ${
                    currentShapeIndex === idx
                      ? "bg-emerald-500/25 border border-emerald-400/40 text-emerald-200 font-bold"
                      : "text-emerald-100/70 hover:text-emerald-100 hover:bg-emerald-500/10"
                  }`}
                >
                  <span>{stg.tag}</span>
                  <span className="text-xs text-emerald-300/90 font-editorial italic font-normal">
                    {stg.quote}
                  </span>
                </button>
              ))}
            </div>

            {/* Sound Toggle Row */}
            <div className="flex items-center justify-between py-3 border-t border-emerald-500/20 text-xs font-mono">
              <span className="flex items-center gap-2 text-emerald-100">
                <CloudRain className="w-4 h-4 text-emerald-300" />
                <span>Relaxing Rain Ambiance</span>
                {soundEnabled && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
              </span>
              <button
                onClick={toggleAudio}
                className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                  soundEnabled
                    ? "bg-emerald-500/25 border-emerald-400 text-emerald-300"
                    : "bg-white/5 border-white/10 text-white/50"
                }`}
              >
                {soundEnabled ? "Playing" : "Muted"}
              </button>
            </div>

            {/* Direct Enter CTA with Coin / Cash Effect */}
            <div className="pt-4 border-t border-emerald-500/20">
              <button
                onClick={handleEnterWorkspace}
                className="w-full py-3 rounded-2xl bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-emerald-300 transition-all cursor-pointer shadow-[0_0_20px_rgba(52,211,153,0.5)]"
              >
                <Coins className="w-4 h-4 text-slate-950" />
                <span>Launch Main Platform</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================
          PHASE 4: CINEMATIC WARP EXPLOSION ON ENTRANCE (Green Flash)
          ======================================================== */}
      <AnimatePresence>
        {phase === "warping" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#021d12] pointer-events-none flex items-center justify-center"
            transition={{ duration: 0.65 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 1 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{ duration: 0.55 }}
              className="text-white font-3d-logo-emerald font-black text-7xl sm:text-9xl"
            >
              ScaleUp
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
