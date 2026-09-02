import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Volume2, Lightbulb, Heart } from 'lucide-react';
import { VosvosConfig } from '../types';
import { audioEngine } from '../utils/audioEngine';

interface VosvosCanvasProps {
  config: VosvosConfig;
  isEngineRunning: boolean;
  rpm: number;
  onHonk?: () => void;
  onToggleLights?: () => void;
}

export const VosvosCanvas: React.FC<VosvosCanvasProps> = ({
  config,
  isEngineRunning,
  rpm,
  onHonk,
  onToggleLights,
}) => {
  const [honkingEffect, setHonkingEffect] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleHornClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioEngine.playHorn();
    setHonkingEffect(true);
    setTimeout(() => setHonkingEffect(false), 500);
    if (onHonk) onHonk();
  };

  const handleHeadlightClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioEngine.playClick(1100);
    if (onToggleLights) onToggleLights();
  };

  const handleLoveClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newHeart = { id: Date.now() + Math.random(), x, y };
    setHearts((prev) => [...prev.slice(-8), newHeart]);
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1200);
  };

  // Dynamic calculations for vibration based on RPM
  const vibrationIntensity = isEngineRunning ? Math.min(2.5, 0.6 + (rpm - 800) / 1600) : 0;

  return (
    <div className="relative w-full overflow-hidden rounded-[32px] bg-gradient-to-b from-[#F7F3EE] via-[#FDFBF7] to-[#E9E4DB] p-4 sm:p-8 border border-[#E9E4DB] shadow-sm flex flex-col items-center justify-center">
      {/* Background Vintage Scenery Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-4 left-6 text-xs uppercase tracking-widest font-semibold text-[#8C847C]">
          Karmann Karosserie • Type 1 Classic
        </div>
        <div className="absolute bottom-6 left-8 right-8 h-[2px] bg-[#D6D1C7]/80 dashed" />
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#CCD5AE]/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#8FA382]/20 blur-3xl" />
      </div>

      {/* Interactive Floating Quick Badges */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <button
          onClick={handleHeadlightClick}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs border ${
            config.headlightsOn
              ? 'bg-[#8FA382] text-white border-[#7D8E74] shadow-[#8FA382]/30'
              : 'bg-[#FDFBF7]/90 text-[#5D554D] border-[#E9E4DB] hover:bg-white'
          }`}
          title="Farları Aç / Kapat"
        >
          <Lightbulb className={`w-3.5 h-3.5 ${config.headlightsOn ? 'text-white fill-white' : 'text-[#8FA382]'}`} />
          <span>{config.headlightsOn ? 'Farlar Açık' : 'Farlar Kapalı'}</span>
        </button>

        <button
          onClick={handleHornClick}
          className="px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-[#FDFBF7]/90 hover:bg-white text-[#5D554D] border border-[#E9E4DB] shadow-xs transition-all active:scale-95"
          title="Kornaya Bas"
        >
          <Volume2 className="w-3.5 h-3.5 text-[#A67B5B]" />
          <span>Klakson Çal</span>
        </button>
      </div>

      {/* Main Interactive SVG Vosvos Illustration */}
      <motion.div
        animate={
          isEngineRunning
            ? {
                y: [0, -vibrationIntensity, vibrationIntensity * 0.8, -vibrationIntensity * 0.5, 0],
                x: [0, vibrationIntensity * 0.4, -vibrationIntensity * 0.4, 0],
              }
            : { y: 0, x: 0 }
        }
        transition={
          isEngineRunning
            ? { repeat: Infinity, duration: Math.max(0.06, 0.18 - (rpm - 800) / 25000), ease: 'linear' }
            : {}
        }
        className="relative w-full max-w-2xl py-4"
      >
        <svg
          viewBox="0 0 950 490"
          className="w-full h-auto drop-shadow-md select-none cursor-pointer"
          onClick={handleLoveClick}
        >
          <defs>
            {/* Body Gradients */}
            <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={config.bodyColor} stopOpacity="1" />
              <stop offset="35%" stopColor={config.bodyColor} stopOpacity="1" />
              <stop offset="70%" stopColor={config.bodyColor} stopOpacity="0.95" />
              <stop offset="100%" stopColor="#1a1a1a" stopOpacity="0.35" />
            </linearGradient>

            <linearGradient id="bodyHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
              <stop offset="40%" stopColor="#ffffff" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
            </linearGradient>

            <linearGradient id="roofLight" x1="0%" y1="0%" x2="100%" y2="30%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
              <stop offset="60%" stopColor="#ffffff" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d8ecf8" stopOpacity="0.92" />
              <stop offset="45%" stopColor="#b2d4eb" stopOpacity="0.85" />
              <stop offset="85%" stopColor="#78a9c8" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#4a7c9d" stopOpacity="0.98" />
            </linearGradient>

            <linearGradient id="chromeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#e2e8f0" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="75%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>

            <linearGradient id="bumperChrome" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#cbd5e1" />
              <stop offset="70%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            <linearGradient id="beamGrad" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#fff2a8" stopOpacity="0.85" />
              <stop offset="40%" stopColor="#ffe680" stopOpacity="0.45" />
              <stop offset="80%" stopColor="#ffe680" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#ffe680" stopOpacity="0" />
            </linearGradient>

            {/* Radial Hubcap Chrome Dome */}
            <radialGradient id="hubcapShine" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#e2e8f0" />
              <stop offset="70%" stopColor="#94a3b8" />
              <stop offset="90%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#334155" />
            </radialGradient>

            {/* Wheel Rim Shadow Gradient */}
            <radialGradient id="rimDepth" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.1" />
              <stop offset="80%" stopColor="#000000" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.75" />
            </radialGradient>

            {/* Lens Pattern */}
            <pattern id="lensPattern" width="4" height="4" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="4" stroke="#94a3b8" strokeWidth="0.8" opacity="0.45" />
            </pattern>
          </defs>

          {/* Realistic Ground Shadow under car */}
          <ellipse cx="480" cy="425" rx="390" ry="24" fill="#181513" fillOpacity="0.3" filter="blur(6px)" />
          <ellipse cx="480" cy="428" rx="320" ry="14" fill="#0f0d0c" fillOpacity="0.45" />
          <ellipse cx="290" cy="426" rx="65" ry="9" fill="#000000" fillOpacity="0.6" />
          <ellipse cx="680" cy="426" rx="65" ry="9" fill="#000000" fillOpacity="0.6" />

          {/* Exhaust Smoke Animation when Engine is Running */}
          {isEngineRunning && (
            <g transform="translate(130, 396)">
              <motion.circle
                animate={{ cx: [-10, -65, -125], cy: [0, -18, -40], r: [4, 13, 24], opacity: [0.75, 0.45, 0] }}
                transition={{ repeat: Infinity, duration: 0.85, ease: 'easeOut' }}
                fill="#8c9096"
              />
              <motion.circle
                animate={{ cx: [-15, -80, -145], cy: [2, -28, -55], r: [5, 16, 28], opacity: [0.65, 0.35, 0] }}
                transition={{ repeat: Infinity, duration: 1.05, delay: 0.25, ease: 'easeOut' }}
                fill="#a0a5ab"
              />
            </g>
          )}

          {/* Headlight Beam Effect */}
          {config.headlightsOn && (
            <g>
              <polygon points="790,325 945,285 945,450 798,355" fill="url(#beamGrad)" />
              <circle cx="792" cy="336" r="26" fill="#fff9d6" fillOpacity="0.9" filter="blur(5px)" />
            </g>
          )}

          {/* ROOF RACK ACCESSORIES */}
          {config.roofRack !== 'none' && (
            <g id="roof-rack-group">
              {/* Metal Rack Base with Legs attached to Rain Gutter */}
              <path
                d="M 335 152 L 575 152 M 350 152 L 360 174 M 420 152 L 425 168 M 495 152 L 498 168 M 565 152 L 555 174"
                stroke="url(#chromeGrad)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Wooden Slats on Rack */}
              <rect x="330" y="148" width="250" height="4" rx="2" fill="#8d5b28" stroke="#5c3814" strokeWidth="0.8" />
              <rect x="325" y="140" width="260" height="3" rx="1.5" fill="url(#chromeGrad)" />
              <line x1="325" y1="140" x2="330" y2="150" stroke="url(#chromeGrad)" strokeWidth="3" />
              <line x1="585" y1="140" x2="580" y2="150" stroke="url(#chromeGrad)" strokeWidth="3" />

              {/* Specific Items */}
              {config.roofRack === 'luggage' && (
                <g>
                  {/* Vintage Leather Suitcase 1 (Large Brown) */}
                  <rect x="350" y="102" width="115" height="42" rx="6" fill="#854d27" stroke="#4a250e" strokeWidth="2.5" />
                  <rect x="355" y="106" width="105" height="34" rx="4" fill="#a05e32" />
                  {/* Straps & Brass Buckles */}
                  <rect x="375" y="102" width="8" height="42" fill="#381c0b" />
                  <rect x="430" y="102" width="8" height="42" fill="#381c0b" />
                  <rect x="374" y="118" width="10" height="6" fill="#d4af37" rx="1" />
                  <rect x="429" y="118" width="10" height="6" fill="#d4af37" rx="1" />
                  {/* Handle */}
                  <path d="M 395 102 C 395 92, 420 92, 420 102" stroke="#381c0b" strokeWidth="4" fill="none" />
                  {/* Retro Stickers */}
                  <circle cx="400" cy="122" r="8" fill="#e74c3c" />
                  <rect x="362" y="116" width="12" height="9" fill="#f1c40f" transform="rotate(-10 362 116)" />

                  {/* Second Smaller Vintage Bag (Navy) */}
                  <rect x="475" y="110" width="95" height="34" rx="5" fill="#2c3e50" stroke="#1a252f" strokeWidth="2" />
                  <rect x="492" y="110" width="6" height="34" fill="#c0392b" />
                  <rect x="540" y="110" width="6" height="34" fill="#c0392b" />
                  <rect x="480" y="120" width="16" height="12" rx="2" fill="#e67e22" />
                </g>
              )}

              {config.roofRack === 'surfboard' && (
                <g transform="rotate(-3 455 135)">
                  {/* Classic Longboard with Wooden Stringer */}
                  <path
                    d="M 285 132 C 360 116, 560 116, 630 134 C 560 146, 360 146, 285 132 Z"
                    fill="#3aa89b"
                    stroke="#1d665e"
                    strokeWidth="2.5"
                  />
                  {/* Wood Stringer down the center */}
                  <path d="M 285 132 C 360 120, 560 120, 630 134" stroke="#d49b4b" strokeWidth="2" fill="none" />
                  {/* Retro Competition Stripes */}
                  <path d="M 315 130 C 375 120, 535 120, 595 132" stroke="#f6b828" strokeWidth="4" fill="none" />
                  <path d="M 335 134 C 385 124, 515 124, 575 135" stroke="#f4ede2" strokeWidth="2.5" fill="none" />
                  {/* Surf Fin */}
                  <polygon points="315,132 300,116 335,130" fill="#f6b828" />
                </g>
              )}

              {config.roofRack === 'skis' && (
                <g>
                  {/* Vintage Wooden Skis with Curved Tips */}
                  <path d="M 290 122 C 340 134, 570 136, 615 118" stroke="#ba2d32" strokeWidth="5" strokeLinecap="round" fill="none" />
                  <path d="M 285 128 C 340 140, 570 142, 620 124" stroke="#5c3814" strokeWidth="5" strokeLinecap="round" fill="none" />
                  {/* Ski poles */}
                  <line x1="310" y1="112" x2="595" y2="144" stroke="#cbd5e1" strokeWidth="2.5" />
                  <circle cx="330" cy="115" r="7" stroke="#334155" strokeWidth="1.5" fill="none" />
                </g>
              )}

              {config.roofRack === 'flowers' && (
                <g>
                  <rect x="360" y="118" width="185" height="26" rx="4" fill="#a0522d" stroke="#5c2c16" strokeWidth="2" />
                  <circle cx="380" cy="112" r="14" fill="#f39c12" />
                  <circle cx="380" cy="112" r="6" fill="#e74c3c" />
                  <circle cx="420" cy="107" r="16" fill="#e91e63" />
                  <circle cx="420" cy="107" r="7" fill="#f1c40f" />
                  <circle cx="465" cy="110" r="15" fill="#3498db" />
                  <circle cx="465" cy="110" r="6" fill="#ffffff" />
                  <circle cx="510" cy="108" r="17" fill="#9b59b6" />
                  <circle cx="510" cy="108" r="7" fill="#f39c12" />
                </g>
              )}
            </g>
          )}

          {/* MAIN VOSVOS (VW TYPE 1 BEETLE) PROFILE */}
          <g id="vosvos-body">
            {/* INNER WHEEL WELL DARK CAVITIES */}
            <path d="M 220 376 C 220 305, 350 305, 350 376 Z" fill="#121417" />
            <path d="M 610 376 C 610 305, 740 305, 740 376 Z" fill="#121417" />

            {/* 1. PRIMARY CURVED BEETLE MONOCOQUE HULL (Iconic Double-Arch Silhouette) */}
            <path
              d="
                M 172 376
                C 168 335, 185 285, 235 245
                C 278 210, 342 174, 420 160
                C 475 150, 528 154, 575 170
                C 600 185, 618 214, 635 248
                C 668 258, 735 288, 794 338
                C 806 348, 800 370, 775 374
                L 740 374
                C 740 308, 610 308, 610 374
                L 350 374
                C 350 308, 220 308, 220 374
                L 172 374
                Z
              "
              fill="url(#bodyGrad)"
              stroke="#22262a"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />

            {/* 2. CABRIOLET FOLDED SOFT-TOP (When modelStyle === 'cabrio') */}
            {config.modelStyle === 'cabrio' && (
              <g id="cabrio-folded-top">
                {/* Folded Canvas Boot behind seats */}
                <path
                  d="M 315 245 C 330 215, 410 215, 440 245 Z"
                  fill="#faf3e6"
                  stroke="#5c4436"
                  strokeWidth="2.5"
                />
                <path
                  d="M 320 238 C 345 228, 375 228, 400 238 C 415 242, 430 238, 438 242"
                  stroke="#8d6e63"
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Chrome windshield frame for Cabrio */}
                <path d="M 570 172 L 635 248" stroke="url(#chromeGrad)" strokeWidth="5" strokeLinecap="round" />
              </g>
            )}

            {/* 3. REAR ENGINE LOUVERS (Hava Soğutmalı Boksör Izgaraları) */}
            <g id="engine-louvers" opacity="0.65">
              <line x1="245" y1="262" x2="278" y2="252" stroke="#121417" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="240" y1="270" x2="274" y2="260" stroke="#121417" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="237" y1="278" x2="271" y2="268" stroke="#121417" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="234" y1="286" x2="268" y2="276" stroke="#121417" strokeWidth="2.5" strokeLinecap="round" />
            </g>

            {/* 4. ROOF HIGHLIGHT & REFLECTION SWEEP */}
            <path
              d="M 275 220 C 345 172, 440 162, 525 165 C 565 167, 595 185, 620 220"
              stroke="url(#roofLight)"
              strokeWidth="7"
              fill="none"
              strokeLinecap="round"
            />

            {/* 5. RAIN GUTTER CHROME TRIM (Yağmur Oluğu) */}
            <path
              d="M 270 246 C 335 178, 435 158, 525 162 C 570 165, 605 190, 628 246"
              stroke="url(#chromeGrad)"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />

            {/* 6. WINDOWS & GLASS ASSEMBLIES */}
            {config.modelStyle !== 'cabrio' && (
              <g id="beetle-windows">
                {/* A. REAR QUARTER WINDOW (Split / Oval / Classic / 1303) */}
                {config.modelStyle === 'split' ? (
                  // 1949-1952 Pre-A Split Window (Twin Heart Windows)
                  <g>
                    <path
                      d="M 300 244 C 325 198, 360 185, 388 185 L 388 244 Z"
                      fill="url(#glassGrad)"
                      stroke="url(#chromeGrad)"
                      strokeWidth="2.5"
                    />
                    {/* Split Center Bar */}
                    <rect x="388" y="183" width="7" height="63" rx="1.5" fill="url(#bodyGrad)" stroke="#222" strokeWidth="1" />
                    <path
                      d="M 398 185 C 418 185, 438 188, 448 195 L 448 244 L 398 244 Z"
                      fill="url(#glassGrad)"
                      stroke="url(#chromeGrad)"
                      strokeWidth="2.5"
                    />
                  </g>
                ) : config.modelStyle === 'oval' ? (
                  // 1953-1957 Iconic Oval Window
                  <g>
                    <ellipse
                      cx="362"
                      cy="214"
                      rx="46"
                      ry="26"
                      fill="url(#glassGrad)"
                      stroke="url(#chromeGrad)"
                      strokeWidth="3.5"
                      transform="rotate(-18 362 214)"
                    />
                    {/* Dark Interior C-Pillar behind oval */}
                    <path
                      d="M 416 186 C 435 186, 445 190, 450 196 L 450 244 L 416 244 Z"
                      fill="url(#glassGrad)"
                      stroke="url(#chromeGrad)"
                      strokeWidth="2.5"
                      opacity="0.85"
                    />
                  </g>
                ) : (
                  // Classic & 1303 Large Quarter Glass
                  <path
                    d="M 292 245 C 322 195, 375 182, 448 182 L 448 245 Z"
                    fill="url(#glassGrad)"
                    stroke="url(#chromeGrad)"
                    strokeWidth="3.5"
                  />
                )}

                {/* B. B-PILLAR (Orta Direk) */}
                <rect x="448" y="178" width="8" height="70" fill="url(#bodyGrad)" stroke="#1a1c1e" strokeWidth="1" />

                {/* C. DOOR WINDOW (Yan Kapı Camı) */}
                <path
                  d="M 458 182 L 458 245 L 626 245 C 612 214, 595 188, 565 174 C 530 168, 485 174, 458 182 Z"
                  fill="url(#glassGrad)"
                  stroke="url(#chromeGrad)"
                  strokeWidth="3.5"
                />

                {/* D. ICONIC KELEBEK CAMI (Triangular Quarter Vent Wing) */}
                <g id="kelebek-cami">
                  {/* Vertical Chrome Divider Bar */}
                  <line x1="580" y1="184" x2="580" y2="245" stroke="url(#chromeGrad)" strokeWidth="3" />
                  {/* Triangular Glass Accent */}
                  <path
                    d="M 583 186 C 600 198, 615 220, 624 243 L 583 243 Z"
                    fill="url(#glassGrad)"
                    stroke="none"
                  />
                  {/* Pivot Latch Knob */}
                  <circle cx="583" cy="226" r="3.5" fill="#1e242b" stroke="url(#chromeGrad)" strokeWidth="1" />
                  <rect x="583" y="224" width="7" height="4" rx="1" fill="url(#chromeGrad)" />
                </g>

                {/* E. Sun Glare Reflections across windows */}
                <line x1="475" y1="188" x2="520" y2="242" stroke="#ffffff" strokeWidth="3" opacity="0.65" strokeLinecap="round" />
                <line x1="492" y1="188" x2="537" y2="242" stroke="#ffffff" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
                <line x1="330" y1="200" x2="365" y2="242" stroke="#ffffff" strokeWidth="2" opacity="0.45" strokeLinecap="round" />
              </g>
            )}

            {/* 7. AUTHENTIC DOOR SHUT LINE & HANDLE */}
            <path
              d="M 452 178 L 452 368 M 632 245 C 636 290, 638 335, 638 368"
              stroke="#1a1c1e"
              strokeWidth="2"
              opacity="0.8"
            />
            {/* Chrome Door Handle (Classic Pull handle with push button) */}
            <g transform="translate(472, 260)">
              <rect x="0" y="0" width="28" height="7" rx="3.5" fill="url(#chromeGrad)" stroke="#1e242b" strokeWidth="1" />
              <circle cx="23" cy="3.5" r="2.2" fill="#1e242b" />
              <line x1="2" y1="3.5" x2="18" y2="3.5" stroke="#ffffff" strokeWidth="1.2" />
            </g>

            {/* 8. CHROME HORIZONTAL BELTLINE MOULDING (Krom Yan Çıta) */}
            <path
              d="M 235 248 C 340 248, 520 248, 632 248"
              stroke="url(#chromeGrad)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />

            {/* 9. SPECIAL DECALS & LIVERY */}
            {config.decals === 'herbie' && (
              <g id="herbie-livery">
                {/* Red, White, Blue Racing Stripes along roof & hood */}
                <path
                  d="M 178 330 C 240 215, 385 152, 485 152 C 585 152, 690 198, 778 335"
                  stroke="#1a4f9c"
                  strokeWidth="20"
                  fill="none"
                />
                <path
                  d="M 178 330 C 240 215, 385 152, 485 152 C 585 152, 690 198, 778 335"
                  stroke="#ffffff"
                  strokeWidth="12"
                  fill="none"
                />
                <path
                  d="M 178 330 C 240 215, 385 152, 485 152 C 585 152, 690 198, 778 335"
                  stroke="#d62828"
                  strokeWidth="6"
                  fill="none"
                />
                {/* Herbie #53 Door Gumball Decal */}
                <circle cx="545" cy="298" r="34" fill="#ffffff" stroke="#1a4f9c" strokeWidth="3" />
                <text
                  x="545"
                  y="310"
                  fontFamily="'DM Serif Display', Georgia, serif"
                  fontSize="34"
                  fontWeight="bold"
                  fill="#111827"
                  textAnchor="middle"
                >
                  53
                </text>
              </g>
            )}

            {config.decals === 'flower-power' && (
              <g id="flower-power-decals">
                {/* Large Colorful Hippie Daisy on Door */}
                <g transform="translate(545, 298)">
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <ellipse
                      key={i}
                      cx="0"
                      cy="-24"
                      rx="9"
                      ry="16"
                      fill={['#f39c12', '#e74c3c', '#9b59b6', '#2ecc71', '#e91e63'][i % 5]}
                      transform={`rotate(${angle})`}
                    />
                  ))}
                  <circle cx="0" cy="0" r="12" fill="#f1c40f" stroke="#e67e22" strokeWidth="2" />
                </g>
                {/* Smaller Flowers */}
                <g transform="translate(230, 310) scale(0.65)">
                  {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                    <ellipse key={i} cx="0" cy="-16" rx="6" ry="12" fill="#e91e63" transform={`rotate(${angle})`} />
                  ))}
                  <circle cx="0" cy="0" r="8" fill="#f1c40f" />
                </g>
                <g transform="translate(735, 315) scale(0.65)">
                  {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                    <ellipse key={i} cx="0" cy="-16" rx="6" ry="12" fill="#3498db" transform={`rotate(${angle})`} />
                  ))}
                  <circle cx="0" cy="0" r="8" fill="#ffffff" />
                </g>
              </g>
            )}

            {config.decals === 'two-tone' && (
              <path
                d="M 172 365 L 170 345 C 170 315, 220 295, 290 290 L 670 290 C 730 295, 785 315, 795 345 L 795 365 Z"
                fill="#f7f3e8"
                opacity="0.9"
              />
            )}

            {config.decals === 'rally' && (
              <g>
                <rect x="495" y="270" width="85" height="54" rx="6" fill="#111" stroke="#f6b828" strokeWidth="3" />
                <text x="537" y="308" fontFamily="sans-serif" fontSize="32" fontWeight="900" fill="#f6b828" textAnchor="middle">
                  73
                </text>
              </g>
            )}

            {/* 10. ICONIC BULBOUS 3D FENDERS (Vosvos'un Karakteristik Şişkin Çamurlukları) */}
            {/* REAR FENDER (Arka Çamurluk) */}
            <g id="rear-fender">
              <path
                d="
                  M 165 372
                  C 155 315, 195 262, 285 262
                  C 345 262, 385 295, 375 372
                  C 365 315, 225 315, 215 372
                  Z
                "
                fill="url(#bodyGrad)"
                stroke="#1e242b"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              {/* Chrome Fender Welting Beading */}
              <path
                d="M 168 360 C 160 315, 198 266, 288 266 C 342 266, 380 298, 374 365"
                stroke="url(#chromeGrad)"
                strokeWidth="2.5"
                fill="none"
              />
              {/* Rear Teardrop / Elephant Foot Tail Light */}
              <g transform="translate(162, 318)">
                <ellipse cx="6" cy="12" rx="7" ry="14" fill="url(#chromeGrad)" stroke="#1e242b" strokeWidth="1" transform="rotate(-15 6 12)" />
                <ellipse cx="6" cy="8" rx="5" ry="8" fill="#e11d48" stroke="#9f1239" strokeWidth="0.8" transform="rotate(-15 6 8)" />
                <ellipse cx="7" cy="16" rx="4.5" ry="5" fill="#f59e0b" stroke="#b45309" strokeWidth="0.8" transform="rotate(-15 7 16)" />
                <circle cx="5" cy="6" r="1.5" fill="#ffffff" opacity="0.75" />
              </g>
            </g>

            {/* FRONT FENDER (Ön Çamurluk - Slanted Nose & Headlight Pod) */}
            <g id="front-fender">
              <path
                d="
                  M 595 372
                  C 590 295, 635 258, 705 258
                  C 775 258, 815 295, 810 348
                  C 805 368, 785 374, 755 374
                  C 745 315, 608 315, 595 372
                  Z
                "
                fill="url(#bodyGrad)"
                stroke="#1e242b"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              {/* Chrome Fender Welting Beading */}
              <path
                d="M 600 365 C 596 300, 638 262, 708 262 C 772 262, 810 298, 806 345"
                stroke="url(#chromeGrad)"
                strokeWidth="2.5"
                fill="none"
              />

              {/* Classic Amber Bullet Turn Indicator on Top of Front Fender (Patates Sinyal) */}
              <g transform="translate(735, 252)">
                <path d="M 0 6 C 4 0, 16 0, 20 6 Z" fill="url(#chromeGrad)" stroke="#1e242b" strokeWidth="1" />
                <ellipse cx="10" cy="2" rx="8" ry="4" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
                <ellipse cx="8" cy="1" rx="4" ry="1.5" fill="#fef3c7" opacity="0.8" />
              </g>

              {/* Slotted Chrome Horn Grille below Headlight */}
              <g transform="translate(802, 348)">
                <circle cx="0" cy="0" r="6" fill="url(#chromeGrad)" stroke="#1e242b" strokeWidth="1" />
                <line x1="-3" y1="-2" x2="3" y2="-2" stroke="#1e242b" strokeWidth="1" />
                <line x1="-4" y1="0" x2="4" y2="0" stroke="#1e242b" strokeWidth="1" />
                <line x1="-3" y1="2" x2="3" y2="2" stroke="#1e242b" strokeWidth="1" />
              </g>
            </g>

            {/* 11. RUNNING BOARD WITH RUBBER RIBS (Yan Basamak & Krom Çıta) */}
            <g id="running-board">
              <rect x="350" y="368" width="260" height="11" rx="2.5" fill="#171a1d" stroke="#0a0c0e" strokeWidth="1.5" />
              {/* Chrome Outer Lip */}
              <rect x="350" y="375" width="260" height="4" rx="1" fill="url(#chromeGrad)" />
              {/* Molded Rubber Grip Ribs */}
              {[...Array(15)].map((_, i) => (
                <rect key={i} x={365 + i * 16} y="370" width="5.5" height="4.5" rx="1" fill="#303740" />
              ))}
            </g>

            {/* 12. SLANTED NOSE HEADLIGHT ASSEMBLY (Efsanevi Eğimli Cam Far) */}
            <g id="headlight-assembly" onClick={handleHeadlightClick} className="cursor-pointer">
              {/* Slanted Chrome Bucket Bezel Ring (Angled ~18 degrees) */}
              <ellipse
                cx="792"
                cy="335"
                rx="20"
                ry="27"
                fill="url(#chromeGrad)"
                stroke="#1e242b"
                strokeWidth="2"
                transform="rotate(16 792 335)"
              />
              {/* Glass Lens with Fluting Lines */}
              <ellipse
                cx="794"
                cy="335"
                rx="15"
                ry="22"
                fill={config.headlightsOn ? '#fffae0' : 'url(#glassGrad)'}
                stroke="#64748b"
                strokeWidth="1.5"
                transform="rotate(16 794 335)"
              />
              {/* Lens Fluting Ridges */}
              <line x1="788" y1="318" x2="788" y2="352" stroke="#94a3b8" strokeWidth="1.2" opacity="0.6" />
              <line x1="794" y1="314" x2="794" y2="356" stroke="#94a3b8" strokeWidth="1.2" opacity="0.6" />
              <line x1="800" y1="318" x2="800" y2="352" stroke="#94a3b8" strokeWidth="1.2" opacity="0.6" />
              {/* Glass Specular Reflection Highlight */}
              <ellipse cx="791" cy="324" rx="5" ry="3" fill="#ffffff" opacity="0.8" transform="rotate(16 791 324)" />

              {/* Headlight Eyelashes (Far Kirpikleri) */}
              {config.headlightEyelashes && (
                <g stroke="#111827" strokeWidth="3" strokeLinecap="round">
                  <line x1="805" y1="314" x2="828" y2="292" />
                  <line x1="798" y1="310" x2="817" y2="284" />
                  <line x1="790" y1="307" x2="802" y2="278" />
                  <line x1="782" y1="308" x2="788" y2="280" />
                </g>
              )}
            </g>

            {/* 13. FRONT HOOD CENTER CHROME SPEAR & VW LOGO EMBLEM */}
            <path d="M 635 248 C 690 258, 755 282, 788 308" stroke="url(#chromeGrad)" strokeWidth="3.5" fill="none" />
            <circle cx="755" cy="285" r="9.5" fill="url(#chromeGrad)" stroke="#1e293b" strokeWidth="1.5" />
            <text x="755" y="288.5" fontSize="8.5" fontWeight="bold" fill="#1e293b" textAnchor="middle">VW</text>

            {/* 14. AUTHENTIC 1960s EXPORT CHROME BUMPERS WITH OVERRIDERS (Bıyıklı Tamponlar) */}
            {/* REAR BUMPER */}
            <g id="rear-bumper">
              {/* Main Chrome Blade */}
              <path
                d="M 130 368 C 135 358, 150 358, 160 368 L 160 388 C 150 394, 135 390, 130 380 Z"
                fill="url(#bumperChrome)"
                stroke="#1e293b"
                strokeWidth="2"
              />
              {/* Vertical Overrider (Tampon Babası) */}
              <rect x="142" y="348" width="10" height="42" rx="3" fill="url(#chromeGrad)" stroke="#1e293b" strokeWidth="1.5" />
              {/* Twin Chrome Pea-Shooter Exhausts */}
              <rect x="140" y="394" width="26" height="6.5" rx="2" fill="url(#chromeGrad)" stroke="#111" strokeWidth="1" />
              <ellipse cx="140" cy="397" rx="2" ry="3.2" fill="#0f172a" />
              <rect x="140" y="403" width="26" height="6.5" rx="2" fill="url(#chromeGrad)" stroke="#111" strokeWidth="1" />
              <ellipse cx="140" cy="406" rx="2" ry="3.2" fill="#0f172a" />
            </g>

            {/* FRONT BUMPER */}
            <g id="front-bumper">
              <path
                d="M 795 368 C 805 358, 820 358, 830 368 L 830 388 C 820 394, 805 390, 795 380 Z"
                fill="url(#bumperChrome)"
                stroke="#1e293b"
                strokeWidth="2"
              />
              {/* Vertical Overrider */}
              <rect x="808" y="348" width="10" height="42" rx="3" fill="url(#chromeGrad)" stroke="#1e293b" strokeWidth="1.5" />
            </g>

            {/* 15. VINTAGE LICENSE PLATE */}
            <g transform="translate(790, 390)">
              <rect x="0" y="0" width="48" height="20" rx="3" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
              <rect x="2" y="2" width="11" height="16" rx="1" fill="#1d4ed8" />
              <text x="7.5" y="13" fontSize="8" fontWeight="bold" fill="#ffffff" textAnchor="middle">TR</text>
              <text x="29" y="14" fontSize="8" fontWeight="800" fill="#0f172a" textAnchor="middle">
                {config.licensePlate.length > 8 ? config.licensePlate.substring(0, 8) : config.licensePlate}
              </text>
            </g>

            {/* 16. WHEELS & TIRES (Classic Dished Rims, Chrome Baby Moon Hubcaps, Whitewalls) */}
            {/* REAR WHEEL ASSEMBLY */}
            <g id="rear-wheel" transform="translate(285, 372)">
              {/* Outer Rubber Tire */}
              <circle cx="0" cy="0" r="54" fill="#1b1e22" stroke="#0a0c0e" strokeWidth="3" />
              {/* Tire Tread Ring */}
              <circle cx="0" cy="0" r="49" stroke="#2c323a" strokeWidth="4" fill="none" />

              {/* Whitewall Option (Beyaz Yanak) */}
              {config.tireStyle === 'whitewall' && (
                <circle cx="0" cy="0" r="41" fill="#faf8f2" stroke="#222" strokeWidth="1.2" />
              )}

              {/* Steel Wheel Rim (Body color or vintage cream) */}
              <circle cx="0" cy="0" r="32" fill={config.bodyColor} stroke="#111" strokeWidth="2" />
              <circle cx="0" cy="0" r="32" fill="url(#rimDepth)" />

              {/* 5 Classic Lug Bolt Holes / Cooling Slots */}
              {[0, 72, 144, 216, 288].map((ang, i) => (
                <ellipse key={i} cx="0" cy="-24" rx="4" ry="2" fill="#0a0c0e" transform={`rotate(${ang})`} />
              ))}

              {/* Hubcap Selection */}
              {config.tireStyle === 'empi-rally' ? (
                <g>
                  {/* 8-Spoke EMPI Rally Sports Wheel */}
                  <circle cx="0" cy="0" r="28" fill="#15171a" stroke="#475569" strokeWidth="1.5" />
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => (
                    <rect key={i} x="-3.5" y="-26" width="7" height="14" rx="2" fill="url(#chromeGrad)" stroke="#111" strokeWidth="0.8" transform={`rotate(${ang})`} />
                  ))}
                  <circle cx="0" cy="0" r="10" fill="url(#chromeGrad)" stroke="#111" strokeWidth="1" />
                </g>
              ) : (
                // Classic Dome Chrome Hubcap ("Baby Moon") with VW Stamp
                <g>
                  <circle cx="0" cy="0" r="24" fill="url(#hubcapShine)" stroke="#334155" strokeWidth="1.8" />
                  <circle cx="0" cy="0" r="13" fill="none" stroke="#64748b" strokeWidth="1" opacity="0.7" />
                  <circle cx="-5" cy="-6" r="5" fill="#ffffff" opacity="0.65" />
                  <text x="0" y="3.5" fontSize="7.5" fontWeight="bold" fill="#334155" textAnchor="middle">VW</text>
                </g>
              )}
            </g>

            {/* FRONT WHEEL ASSEMBLY */}
            <g id="front-wheel" transform="translate(675, 372)">
              <circle cx="0" cy="0" r="54" fill="#1b1e22" stroke="#0a0c0e" strokeWidth="3" />
              <circle cx="0" cy="0" r="49" stroke="#2c323a" strokeWidth="4" fill="none" />

              {config.tireStyle === 'whitewall' && (
                <circle cx="0" cy="0" r="41" fill="#faf8f2" stroke="#222" strokeWidth="1.2" />
              )}

              <circle cx="0" cy="0" r="32" fill={config.bodyColor} stroke="#111" strokeWidth="2" />
              <circle cx="0" cy="0" r="32" fill="url(#rimDepth)" />

              {[0, 72, 144, 216, 288].map((ang, i) => (
                <ellipse key={i} cx="0" cy="-24" rx="4" ry="2" fill="#0a0c0e" transform={`rotate(${ang})`} />
              ))}

              {config.tireStyle === 'empi-rally' ? (
                <g>
                  <circle cx="0" cy="0" r="28" fill="#15171a" stroke="#475569" strokeWidth="1.5" />
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => (
                    <rect key={i} x="-3.5" y="-26" width="7" height="14" rx="2" fill="url(#chromeGrad)" stroke="#111" strokeWidth="0.8" transform={`rotate(${ang})`} />
                  ))}
                  <circle cx="0" cy="0" r="10" fill="url(#chromeGrad)" stroke="#111" strokeWidth="1" />
                </g>
              ) : (
                <g>
                  <circle cx="0" cy="0" r="24" fill="url(#hubcapShine)" stroke="#334155" strokeWidth="1.8" />
                  <circle cx="0" cy="0" r="13" fill="none" stroke="#64748b" strokeWidth="1" opacity="0.7" />
                  <circle cx="-5" cy="-6" r="5" fill="#ffffff" opacity="0.65" />
                  <text x="0" y="3.5" fontSize="7.5" fontWeight="bold" fill="#334155" textAnchor="middle">VW</text>
                </g>
              )}
            </g>
          </g>
        </svg>
      </motion.div>

      {/* Floating Hearts Reaction when clicking the car */}
      <AnimatePresence>
        {hearts.map((h) => (
          <motion.div
            key={h.id}
            initial={{ opacity: 1, scale: 0.5, x: h.x - 12, y: h.y - 12 }}
            animate={{ opacity: 0, scale: 1.6, y: h.y - 80 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="absolute pointer-events-none z-30"
          >
            <Heart className="w-7 h-7 text-rose-500 fill-rose-500 drop-shadow-md" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Honk Visual Soundwaves */}
      <AnimatePresence>
        {honkingEffect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.1 }}
            exit={{ opacity: 0, scale: 1.3 }}
            className="absolute top-12 left-1/2 -translate-x-1/2 bg-[#8FA382] text-white font-bold px-5 py-2 rounded-full shadow-lg border-2 border-[#7D8E74] text-sm z-20 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#E9EDC9]" />
            <span>DİT DİİİP! 🎵 (Vosvos Selamı)</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Hint */}
      <div className="mt-2 text-center text-xs text-[#8C847C] flex items-center justify-center gap-4 flex-wrap font-medium">
        <span>✨ Arabaya tıkla ve sevgini gönder</span>
        <span>•</span>
        <span>💡 Farlara tıklayarak yak</span>
        <span>•</span>
        <span>📣 Korna ile selam ver</span>
      </div>
    </div>
  );
};
