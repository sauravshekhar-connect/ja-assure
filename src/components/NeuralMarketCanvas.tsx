import React, { useEffect, useRef } from "react";
import { ThemeId } from "../types";

interface NeuralCanvasProps {
  intensity?: "low" | "medium" | "high";
  interactive?: boolean;
  accentColor?: string;
  theme?: ThemeId;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  pulsePhase: number;
  layer: number; // 0: background, 1: mid, 2: foreground
  color: string;
}

interface MarketCandle {
  x: number;
  y: number;
  high: number;
  low: number;
  open: number;
  close: number;
}

export const NeuralMarketCanvas: React.FC<NeuralCanvasProps> = ({
  interactive = true,
  theme = "digilink-gold",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    // Neural Nodes setup
    const nodeCount = Math.floor(Math.min(width, 1200) / 18);
    const nodes: Node[] = [];
    
    // Theme-driven palette selection
    const themePalettes: Record<string, string[]> = {
      "runner-dark": [
        "rgba(56, 189, 248, ",   // Ice Cyan
        "rgba(255, 255, 255, ",  // Runner White Pure
        "rgba(99, 102, 241, ",  // Modern Indigo
        "rgba(52, 211, 153, ",  // Mint Pulse
      ],
      "runner-light": [
        "rgba(15, 23, 42, ",    // Slate 900
        "rgba(56, 189, 248, ",  // Ice Cyan
        "rgba(79, 70, 229, ",   // Indigo Slate
        "rgba(100, 116, 139, ", // Cool Steel
      ],
      "digilink-gold": [
        "rgba(245, 158, 11, ",  // Digilink Amber / Gold
        "rgba(139, 92, 246, ",  // Digilink Violet
        "rgba(6, 182, 212, ",   // Electric Cyan
        "rgba(251, 191, 36, ",  // Warm Yellow Light
      ],
      "executive-light": [
        "rgba(37, 99, 235, ",   // Deep Cobalt Blue
        "rgba(59, 130, 246, ",  // Vivid Royal Blue
        "rgba(14, 165, 233, ",  // Sky Blue
        "rgba(99, 102, 241, ",  // Indigo Accent
      ],
      "cyber-matrix": [
        "rgba(6, 182, 212, ",   // Electric Cyan
        "rgba(16, 185, 129, ",  // Matrix Emerald
        "rgba(52, 211, 153, ",  // Neon Mint
        "rgba(34, 211, 238, ",  // High-voltage Cyan
      ],
      "royal-amethyst": [
        "rgba(168, 85, 247, ",  // Royal Purple
        "rgba(217, 70, 239, ",  // Neon Fuchsia
        "rgba(192, 132, 252, ", // Orchid Violet
        "rgba(236, 72, 153, ",  // Vivid Magenta
      ],
    };

    const colors = themePalettes[theme] || themePalettes["digilink-gold"];

    for (let i = 0; i < nodeCount; i++) {
      const baseRadius = Math.random() * 2 + 1.2;
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: baseRadius,
        baseRadius,
        pulsePhase: Math.random() * Math.PI * 2,
        layer: Math.floor(Math.random() * 3),
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Stock Market Ticker Simulation points (sine-wave harmonic price chart)
    let marketTick = 0;
    const getMarketCurve = (t: number) => {
      const points: { x: number; y: number }[] = [];
      const step = 20;
      const baseline = height * 0.65;
      for (let x = 0; x <= width + 40; x += step) {
        const wave1 = Math.sin((x * 0.006) + (t * 0.02)) * 35;
        const wave2 = Math.cos((x * 0.015) - (t * 0.015)) * 18;
        const wave3 = Math.sin((x * 0.002) + (t * 0.005)) * 40;
        points.push({ x, y: baseline + wave1 + wave2 + wave3 });
      }
      return points;
    };

    // Synapse Signal Pulse Packet
    interface SynapsePacket {
      fromIndex: number;
      toIndex: number;
      progress: number;
      speed: number;
      color: string;
    }
    const packets: SynapsePacket[] = [];

    const triggerSynapse = () => {
      if (nodes.length < 2) return;
      const i1 = Math.floor(Math.random() * nodes.length);
      // find a close neighbor
      let bestDist = 160;
      let i2 = -1;
      for (let j = 0; j < nodes.length; j++) {
        if (j === i1) continue;
        const dx = nodes[i1].x - nodes[j].x;
        const dy = nodes[i1].y - nodes[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < bestDist) {
          bestDist = dist;
          i2 = j;
        }
      }
      if (i2 !== -1) {
        packets.push({
          fromIndex: i1,
          toIndex: i2,
          progress: 0,
          speed: 0.03 + Math.random() * 0.04,
          color: Math.random() > 0.5 ? "#22d3ee" : "#10b981",
        });
      }
    };

    let lastPacketTime = 0;

    const render = (time: number) => {
      marketTick += 0.02;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Stock Market Dynamic Trend Wave (Neural Finance Grid)
      const marketPoints = getMarketCurve(marketTick);
      if (marketPoints.length > 1) {
        // Gradient fill under market curve
        const grad = ctx.createLinearGradient(0, height * 0.4, 0, height);
        grad.addColorStop(0, "rgba(245, 158, 11, 0.09)");
        grad.addColorStop(0.5, "rgba(139, 92, 246, 0.05)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.beginPath();
        ctx.moveTo(marketPoints[0].x, marketPoints[0].y);
        for (let i = 1; i < marketPoints.length; i++) {
          const xc = (marketPoints[i - 1].x + marketPoints[i].x) / 2;
          const yc = (marketPoints[i - 1].y + marketPoints[i].y) / 2;
          ctx.quadraticCurveTo(marketPoints[i - 1].x, marketPoints[i - 1].y, xc, yc);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        // Neon trend line
        ctx.beginPath();
        ctx.moveTo(marketPoints[0].x, marketPoints[0].y);
        for (let i = 1; i < marketPoints.length; i++) {
          const xc = (marketPoints[i - 1].x + marketPoints[i].x) / 2;
          const yc = (marketPoints[i - 1].y + marketPoints[i].y) / 2;
          ctx.quadraticCurveTo(marketPoints[i - 1].x, marketPoints[i - 1].y, xc, yc);
        }
        ctx.strokeStyle = "rgba(245, 158, 11, 0.45)";
        ctx.lineWidth = 1.5;
        ctx.shadowColor = "rgba(245, 158, 11, 0.6)";
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      }

      // Periodically trigger neural pulses
      if (time - lastPacketTime > 250) {
        triggerSynapse();
        lastPacketTime = time;
      }

      // 2. Update & Draw Neural Axons (Connections)
      const maxDistance = 140;
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];

        // Particle physics
        n1.x += n1.vx;
        n1.y += n1.vy;

        // Wall rebound
        if (n1.x < 0 || n1.x > width) n1.vx *= -1;
        if (n1.y < 0 || n1.y > height) n1.vy *= -1;

        // Mouse interactive force
        if (interactive && mouseRef.current.active) {
          const mdx = mouseRef.current.x - n1.x;
          const mdy = mouseRef.current.y - n1.y;
          const mDist = Math.hypot(mdx, mdy);
          if (mDist < 120 && mDist > 5) {
            // gentle pull towards cursor with neural spring
            n1.x += (mdx / mDist) * 0.8;
            n1.y += (mdy / mDist) * 0.8;
          }
        }

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.28;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // 3. Draw Synapse Signal Packets (Neural Data Transmissions)
      for (let p = packets.length - 1; p >= 0; p--) {
        const pkt = packets[p];
        pkt.progress += pkt.speed;

        const n1 = nodes[pkt.fromIndex];
        const n2 = nodes[pkt.toIndex];
        if (!n1 || !n2 || pkt.progress >= 1) {
          packets.splice(p, 1);
          continue;
        }

        const curX = n1.x + (n2.x - n1.x) * pkt.progress;
        const curY = n1.y + (n2.y - n1.y) * pkt.progress;

        ctx.beginPath();
        ctx.arc(curX, curY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = pkt.color;
        ctx.shadowColor = pkt.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 4. Draw Neural Nodes (Neurons)
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.pulsePhase += 0.04;
        const pulse = Math.sin(n.pulsePhase) * 0.6;
        const currentRadius = Math.max(1, n.baseRadius + pulse);

        // Halo
        ctx.beginPath();
        ctx.arc(n.x, n.y, currentRadius * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `${n.color}0.15)`;
        ctx.fill();

        // Core neuron
        ctx.beginPath();
        ctx.arc(n.x, n.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = `${n.color}0.85)`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [interactive, theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ opacity: 0.85 }}
    />
  );
};
