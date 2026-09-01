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
          viewBox="0 0 900 480"
          className="w-full h-auto drop-shadow-md select-none cursor-pointer"
          onClick={handleLoveClick}
        >
          <defs>
            {/* Body Gradients */}
            <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={config.bodyColor} stopOpacity="1" />
              <stop offset="60%" stopColor={config.bodyColor} stopOpacity="1" />
              <stop offset="100%" stopColor="#1a1a1a" stopOpacity="0.25" />
            </linearGradient>

            <linearGradient id="roofLight" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d5e8f5" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#b4d2e7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#7daec9" stopOpacity="0.95" />
            </linearGradient>

            <linearGradient id="chromeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#d8dde2" />
              <stop offset="50%" stopColor="#9aa0a6" />
              <stop offset="65%" stopColor="#f1f3f4" />
              <stop offset="100%" stopColor="#bdc1c6" />
            </linearGradient>

            <linearGradient id="beamGrad" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#ffe680" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#ffe680" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ffe680" stopOpacity="0" />
            </linearGradient>

            {/* Rubber and tire pattern */}
            <radialGradient id="hubcapShine" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#c5cbd3" />
              <stop offset="90%" stopColor="#70757a" />
              <stop offset="100%" stopColor="#3c4043" />
            </radialGradient>
          </defs>

          {/* Shadow under car */}
          <ellipse cx="450" cy="415" rx="360" ry="24" fill="#1e1e1e" fillOpacity="0.28" filter="blur(6px)" />
          <ellipse cx="450" cy="418" rx="280" ry="12" fill="#0f0f0f" fillOpacity="0.4" />

          {/* Exhaust Smoke Animation when Engine is Running */}
          {isEngineRunning && (
            <g transform="translate(130, 396)">
              <motion.circle
                animate={{ cx: [-10, -60, -110], cy: [0, -15, -35], r: [4, 12, 22], opacity: [0.7, 0.4, 0] }}
                transition={{ repeat: Infinity, duration: 0.9, ease: 'easeOut' }}
                fill="#8c9096"
              />
              <motion.circle
                animate={{ cx: [-15, -75, -135], cy: [2, -25, -50], r: [5, 15, 26], opacity: [0.6, 0.35, 0] }}
                transition={{ repeat: Infinity, duration: 1.1, delay: 0.3, ease: 'easeOut' }}
                fill="#a0a5ab"
              />
            </g>
          )}

          {/* Headlight Beam Effect */}
          {config.headlightsOn && (
            <g>
              <polygon points="760,332 895,300 895,430 765,355" fill="url(#beamGrad)" />
              <circle cx="760" cy="342" r="22" fill="#fff4b8" fillOpacity="0.85" filter="blur(4px)" />
            </g>
          )}

          {/* ROOF RACK ACCESSORIES */}
          {config.roofRack !== 'none' && (
            <g id="roof-rack-group">
              {/* Metal Rack Base */}
              <path
                d="M 330 160 L 570 160 M 340 160 L 350 178 M 410 160 L 415 174 M 490 160 L 490 175 M 560 160 L 550 178"
                stroke="url(#chromeGrad)"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              <rect x="325" y="156" width="250" height="4" rx="2" fill="#8d9499" />
              <rect x="320" y="148" width="260" height="3" rx="1.5" fill="url(#chromeGrad)" />
              <line x1="320" y1="148" x2="325" y2="158" stroke="url(#chromeGrad)" strokeWidth="3" />
              <line x1="580" y1="148" x2="575" y2="158" stroke="url(#chromeGrad)" strokeWidth="3" />

              {/* Specific Items */}
              {config.roofRack === 'luggage' && (
                <g>
                  {/* Vintage Leather Suitcase 1 */}
                  <rect x="345" y="108" width="115" height="44" rx="6" fill="#854d27" stroke="#4a250e" strokeWidth="2.5" />
                  <rect x="350" y="112" width="105" height="36" rx="4" fill="#a05e32" />
                  {/* Straps */}
                  <rect x="370" y="108" width="8" height="44" fill="#4a250e" />
                  <rect x="425" y="108" width="8" height="44" fill="#4a250e" />
                  {/* Handle */}
                  <path d="M 390 108 C 390 98, 415 98, 415 108" stroke="#4a250e" strokeWidth="4" fill="none" />
                  {/* Vintage stickers */}
                  <circle cx="395" cy="126" r="8" fill="#e74c3c" />
                  <rect x="360" y="122" width="12" height="9" fill="#f1c40f" transform="rotate(-10 360 122)" />

                  {/* Second Smaller Bag */}
                  <rect x="470" y="118" width="95" height="34" rx="5" fill="#2c3e50" stroke="#1a252f" strokeWidth="2" />
                  <rect x="488" y="118" width="6" height="34" fill="#d35400" />
                  <rect x="535" y="118" width="6" height="34" fill="#d35400" />
                </g>
              )}

              {config.roofRack === 'surfboard' && (
                <g transform="rotate(-4 450 145)">
                  {/* Wooden / Turquoise Surfboard */}
                  <path
                    d="M 280 140 C 350 125, 550 125, 620 142 C 550 152, 350 152, 280 140 Z"
                    fill="#3aa89b"
                    stroke="#1d665e"
                    strokeWidth="2.5"
                  />
                  {/* Retro Surf Stripes */}
                  <path d="M 310 138 C 370 128, 530 128, 590 140" stroke="#f6b828" strokeWidth="4" fill="none" />
                  <path d="M 330 142 C 380 132, 510 132, 570 143" stroke="#f4ede2" strokeWidth="3" fill="none" />
                  {/* Fin */}
                  <polygon points="310,140 295,124 330,138" fill="#f6b828" />
                </g>
              )}

              {config.roofRack === 'skis' && (
                <g>
                  {/* Vintage Red & Wooden Skis */}
                  <path d="M 290 132 C 340 142, 560 145, 600 130" stroke="#ba2d32" strokeWidth="5" strokeLinecap="round" fill="none" />
                  <path d="M 285 138 C 340 148, 560 150, 605 136" stroke="#4a250e" strokeWidth="5" strokeLinecap="round" fill="none" />
                  {/* Ski poles */}
                  <line x1="310" y1="122" x2="580" y2="152" stroke="#bdc1c6" strokeWidth="2.5" />
                  <circle cx="330" cy="125" r="7" stroke="#333" strokeWidth="1.5" fill="none" />
                </g>
              )}

              {config.roofRack === 'flowers' && (
                <g>
                  <rect x="360" y="125" width="180" height="28" rx="4" fill="#a0522d" stroke="#5c2c16" strokeWidth="2" />
                  <circle cx="380" cy="120" r="14" fill="#f39c12" />
                  <circle cx="380" cy="120" r="6" fill="#e74c3c" />
                  <circle cx="420" cy="115" r="16" fill="#e91e63" />
                  <circle cx="420" cy="115" r="7" fill="#f1c40f" />
                  <circle cx="465" cy="118" r="15" fill="#3498db" />
                  <circle cx="465" cy="118" r="6" fill="#ffffff" />
                  <circle cx="510" cy="116" r="17" fill="#9b59b6" />
                  <circle cx="510" cy="116" r="7" fill="#f39c12" />
                </g>
              )}
            </g>
          )}

          {/* MAIN VOSVOS BODY PROFILE */}
          <g id="vosvos-body">
            {/* Primary Curved Beetle Silhouette */}
            <path
              d="
                M 160 375
                L 155 350
                C 155 310, 180 270, 240 230
                C 310 180, 390 162, 470 162
                C 570 162, 650 190, 710 240
                C 745 270, 765 300, 770 345
                L 770 375
                L 720 375
                C 720 315, 620 315, 620 375
                L 360 375
                C 360 315, 260 315, 260 375
                Z
              "
              fill="url(#bodyGrad)"
              stroke="#2c3036"
              strokeWidth="3.5"
            />

            {/* Cabriolet Cutout if Model is Cabrio */}
            {config.modelStyle === 'cabrio' && (
              <g>
                <path
                  d="M 330 170 C 400 170, 560 170, 625 240 L 330 240 Z"
                  fill="#faf3e6"
                  opacity="0.95"
                />
                <path
                  d="M 320 225 C 340 215, 360 215, 380 225 C 400 235, 420 220, 440 225"
                  stroke="#8d6e63"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* Rear Engine Louvers (Boksör Havalandırma Izgaraları) */}
            <g id="engine-louvers" opacity="0.6">
              <line x1="250" y1="260" x2="280" y2="250" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="245" y1="268" x2="278" y2="258" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="242" y1="276" x2="276" y2="266" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="240" y1="284" x2="274" y2="274" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
            </g>

            {/* Roof Top Highlight */}
            <path
              d="M 280 215 C 350 170, 440 166, 530 166 C 600 166, 655 190, 695 230"
              stroke="url(#roofLight)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />

            {/* WINDOWS */}
            {config.modelStyle !== 'cabrio' && (
              <g id="beetle-windows">
                {/* Rear Window (Split / Oval / Classic) */}
                {config.modelStyle === 'split' ? (
                  // Split Window
                  <g>
                    <path d="M 305 240 C 330 200, 365 190, 395 190 L 395 240 Z" fill="url(#glassGrad)" stroke="#2c3036" strokeWidth="2.5" />
                    <line x1="395" y1="188" x2="395" y2="242" stroke="url(#chromeGrad)" strokeWidth="4" />
                  </g>
                ) : config.modelStyle === 'oval' ? (
                  // Oval Window
                  <ellipse cx="355" cy="216" rx="42" ry="24" fill="url(#glassGrad)" stroke="url(#chromeGrad)" strokeWidth="3" transform="rotate(-15 355 216)" />
                ) : (
                  // Classic & 1303 Large Rear Quarter Window
                  <path
                    d="M 295 242 C 320 196, 365 186, 420 186 L 420 242 Z"
                    fill="url(#glassGrad)"
                    stroke="url(#chromeGrad)"
                    strokeWidth="3.5"
                  />
                )}

                {/* Front Side Window (Door) & Vent Wing (Kelebek Cam) */}
                <path
                  d="M 432 186 C 490 186, 560 196, 620 242 L 432 242 Z"
                  fill="url(#glassGrad)"
                  stroke="url(#chromeGrad)"
                  strokeWidth="3.5"
                />

                {/* Iconic Triangle Vent Wing (Kelebek Camı Çerçevesi) */}
                <line x1="575" y1="206" x2="575" y2="242" stroke="url(#chromeGrad)" strokeWidth="3" />
                <circle cx="578" cy="226" r="3" fill="#333" />
                <line x1="575" y1="206" x2="618" y2="242" stroke="url(#chromeGrad)" strokeWidth="1.5" />

                {/* Window glare reflection lines */}
                <line x1="450" y1="192" x2="490" y2="238" stroke="#ffffff" strokeWidth="3" opacity="0.6" strokeLinecap="round" />
                <line x1="465" y1="192" x2="505" y2="238" stroke="#ffffff" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
              </g>
            )}

            {/* DOOR LINE & CHROME HANDLE */}
            <path
              d="M 425 184 L 425 365 M 630 240 L 630 365"
              stroke="#222"
              strokeWidth="2"
              opacity="0.75"
            />
            {/* Chrome Door Handle */}
            <rect x="445" y="258" width="26" height="6" rx="3" fill="url(#chromeGrad)" stroke="#333" strokeWidth="1" />
            <circle cx="466" cy="261" r="2" fill="#222" />

            {/* SPECIAL DECALS & EDITIONS */}
            {config.decals === 'herbie' && (
              <g id="herbie-livery">
                {/* Red, White, Blue Racing Stripes along roof & hood */}
                <path
                  d="M 175 330 C 240 215, 380 156, 480 156 C 580 156, 680 200, 755 330"
                  stroke="#1a4f9c"
                  strokeWidth="18"
                  fill="none"
                />
                <path
                  d="M 175 330 C 240 215, 380 156, 480 156 C 580 156, 680 200, 755 330"
                  stroke="#ffffff"
                  strokeWidth="10"
                  fill="none"
                />
                <path
                  d="M 175 330 C 240 215, 380 156, 480 156 C 580 156, 680 200, 755 330"
                  stroke="#d62828"
                  strokeWidth="5"
                  fill="none"
                />
                {/* Herbie #53 Door Gumball Decal */}
                <circle cx="525" cy="295" r="32" fill="#ffffff" stroke="#1a4f9c" strokeWidth="3" />
                <text
                  x="525"
                  y="306"
                  fontFamily="'DM Serif Display', Georgia, serif"
                  fontSize="32"
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
                <g transform="translate(525, 295)">
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <ellipse
                      key={i}
                      cx="0"
                      cy="-22"
                      rx="8"
                      ry="15"
                      fill={['#f39c12', '#e74c3c', '#9b59b6', '#2ecc71', '#e91e63'][i % 5]}
                      transform={`rotate(${angle})`}
                    />
                  ))}
                  <circle cx="0" cy="0" r="11" fill="#f1c40f" stroke="#e67e22" strokeWidth="2" />
                </g>
                {/* Smaller Flowers on Fenders */}
                <g transform="translate(230, 310) scale(0.6)">
                  {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                    <ellipse key={i} cx="0" cy="-16" rx="6" ry="12" fill="#e91e63" transform={`rotate(${angle})`} />
                  ))}
                  <circle cx="0" cy="0" r="8" fill="#f1c40f" />
                </g>
                <g transform="translate(710, 310) scale(0.6)">
                  {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                    <ellipse key={i} cx="0" cy="-16" rx="6" ry="12" fill="#3498db" transform={`rotate(${angle})`} />
                  ))}
                  <circle cx="0" cy="0" r="8" fill="#ffffff" />
                </g>
              </g>
            )}

            {config.decals === 'two-tone' && (
              <path
                d="M 160 365 L 155 350 C 155 330, 200 310, 260 305 L 640 305 C 700 310, 755 330, 770 350 L 770 365 Z"
                fill="#f4ede2"
                opacity="0.9"
              />
            )}

            {config.decals === 'rally' && (
              <g>
                <rect x="475" y="270" width="80" height="50" rx="6" fill="#111" stroke="#f6b828" strokeWidth="3" />
                <text x="515" y="306" fontFamily="sans-serif" fontSize="30" fontWeight="900" fill="#f6b828" textAnchor="middle">
                  73
                </text>
              </g>
            )}

            {/* ICONIC BULBOUS FENDERS (Çamurluklar) */}
            {/* Rear Fender */}
            <path
              d="M 155 365 C 160 290, 220 280, 340 310 C 375 320, 390 355, 385 375 C 375 325, 240 325, 230 375 Z"
              fill="url(#bodyGrad)"
              stroke="#2c3036"
              strokeWidth="3"
            />
            {/* Rear Fender Chrome Beading */}
            <path
              d="M 160 355 C 175 295, 230 288, 345 315"
              stroke="url(#chromeGrad)"
              strokeWidth="3"
              fill="none"
            />

            {/* Front Fender */}
            <path
              d="M 590 375 C 595 325, 730 325, 745 375 C 770 375, 790 350, 780 320 C 765 285, 680 290, 600 355 Z"
              fill="url(#bodyGrad)"
              stroke="#2c3036"
              strokeWidth="3"
            />
            {/* Front Fender Chrome Beading */}
            <path
              d="M 605 348 C 685 288, 765 288, 775 330"
              stroke="url(#chromeGrad)"
              strokeWidth="3"
              fill="none"
            />

            {/* RUNNING BOARD WITH RUBBER RIBS (Basamak) */}
            <g id="running-board">
              <rect x="360" y="368" width="260" height="12" rx="3" fill="#1f2429" stroke="#111" strokeWidth="1.5" />
              {/* Chrome trim */}
              <rect x="360" y="376" width="260" height="4" rx="1" fill="url(#chromeGrad)" />
              {/* Rubber grips */}
              {[...Array(14)].map((_, i) => (
                <rect key={i} x={375 + i * 17} y="370" width="6" height="5" rx="1" fill="#333a42" />
              ))}
            </g>

            {/* HEADLIGHT (Ön Far) */}
            <g id="headlight-assembly" onClick={handleHeadlightClick} className="cursor-pointer">
              {/* Slanted Chrome Bucket */}
              <ellipse cx="760" cy="336" rx="22" ry="28" fill="url(#chromeGrad)" stroke="#333" strokeWidth="2" transform="rotate(12 760 336)" />
              <ellipse
                cx="762"
                cy="336"
                rx="16"
                ry="22"
                fill={config.headlightsOn ? '#fffae0' : '#d8e2ec'}
                stroke="#64748b"
                strokeWidth="1.5"
                transform="rotate(12 762 336)"
              />
              {/* Lens Fluting */}
              <line x1="756" y1="320" x2="756" y2="352" stroke="#94a3b8" strokeWidth="1.5" opacity="0.6" />
              <line x1="762" y1="316" x2="762" y2="356" stroke="#94a3b8" strokeWidth="1.5" opacity="0.6" />
              <line x1="768" y1="320" x2="768" y2="352" stroke="#94a3b8" strokeWidth="1.5" opacity="0.6" />

              {/* Headlight Eyelashes (Far Kirpikleri) */}
              {config.headlightEyelashes && (
                <g stroke="#111827" strokeWidth="3" strokeLinecap="round">
                  <line x1="772" y1="314" x2="795" y2="295" />
                  <line x1="766" y1="310" x2="784" y2="285" />
                  <line x1="758" y1="308" x2="770" y2="280" />
                  <line x1="750" y1="310" x2="756" y2="282" />
                </g>
              )}
            </g>

            {/* FRONT HOOD CHROME SPEAR & VW EMBLEM */}
            <path d="M 620 242 C 670 248, 730 270, 755 295" stroke="url(#chromeGrad)" strokeWidth="3.5" fill="none" />
            <circle cx="725" cy="275" r="9" fill="url(#chromeGrad)" stroke="#1e293b" strokeWidth="1.5" />
            <text x="725" y="278" fontSize="8" fontWeight="bold" fill="#1e293b" textAnchor="middle">VW</text>

            {/* BUMPERS (Tamponlar) */}
            {/* Rear Bumper */}
            <path
              d="M 125 365 C 130 355, 145 355, 155 365 L 155 385 C 145 390, 130 385, 125 375 Z"
              fill="url(#chromeGrad)"
              stroke="#2c3e50"
              strokeWidth="2"
            />
            {/* Pea-Shooter Exhausts */}
            <rect x="135" y="392" width="24" height="6" rx="2" fill="url(#chromeGrad)" stroke="#333" strokeWidth="1" />
            <rect x="135" y="401" width="24" height="6" rx="2" fill="url(#chromeGrad)" stroke="#333" strokeWidth="1" />

            {/* Front Bumper & Overriders */}
            <path
              d="M 770 365 C 780 355, 795 355, 805 365 L 805 385 C 795 390, 780 385, 770 375 Z"
              fill="url(#chromeGrad)"
              stroke="#2c3e50"
              strokeWidth="2"
            />

            {/* VINTAGE LICENSE PLATE */}
            <g transform="translate(765, 385)">
              <rect x="0" y="0" width="46" height="20" rx="3" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
              <rect x="2" y="2" width="10" height="16" rx="1" fill="#1d4ed8" />
              <text x="7" y="13" fontSize="8" fontWeight="bold" fill="#ffffff" textAnchor="middle">TR</text>
              <text x="28" y="14" fontSize="8" fontWeight="800" fill="#0f172a" textAnchor="middle">
                {config.licensePlate.length > 8 ? config.licensePlate.substring(0, 8) : config.licensePlate}
              </text>
            </g>

            {/* WHEELS (Tires, Whitewalls, Hubcaps, EMPI) */}
            {/* REAR WHEEL */}
            <g id="rear-wheel" transform="translate(310, 375)">
              {/* Outer Black Rubber Tire */}
              <circle cx="0" cy="0" r="54" fill="#1b1e22" stroke="#0a0c0e" strokeWidth="3" />
              <circle cx="0" cy="0" r="50" stroke="#2d3238" strokeWidth="3" fill="none" />

              {/* Whitewall Option */}
              {config.tireStyle === 'whitewall' ? (
                <circle cx="0" cy="0" r="42" fill="#faf9f6" stroke="#222" strokeWidth="1" />
              ) : null}

              {/* Inner Steel Rim */}
              <circle cx="0" cy="0" r="32" fill={config.bodyColor} stroke="#222" strokeWidth="2" />

              {/* Hubcap Styles */}
              {config.tireStyle === 'empi-rally' ? (
                <g>
                  {/* 8-Spoke EMPI Rally Rims */}
                  <circle cx="0" cy="0" r="28" fill="#1a1a1a" />
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => (
                    <rect key={i} x="-3" y="-26" width="6" height="14" rx="2" fill="url(#chromeGrad)" transform={`rotate(${ang})`} />
                  ))}
                  <circle cx="0" cy="0" r="10" fill="url(#chromeGrad)" />
                </g>
              ) : (
                // Classic Dome Chrome Hubcap with VW stamp
                <g>
                  <circle cx="0" cy="0" r="24" fill="url(#hubcapShine)" stroke="#4b5563" strokeWidth="1.5" />
                  <circle cx="0" cy="0" r="12" fill="none" stroke="#6b7280" strokeWidth="1" />
                  <circle cx="-5" cy="-5" r="4" fill="#ffffff" opacity="0.6" />
                  <text x="0" y="3" fontSize="7" fontWeight="bold" fill="#374151" textAnchor="middle">VW</text>
                </g>
              )}
            </g>

            {/* FRONT WHEEL */}
            <g id="front-wheel" transform="translate(670, 375)">
              <circle cx="0" cy="0" r="54" fill="#1b1e22" stroke="#0a0c0e" strokeWidth="3" />
              <circle cx="0" cy="0" r="50" stroke="#2d3238" strokeWidth="3" fill="none" />

              {config.tireStyle === 'whitewall' ? (
                <circle cx="0" cy="0" r="42" fill="#faf9f6" stroke="#222" strokeWidth="1" />
              ) : null}

              <circle cx="0" cy="0" r="32" fill={config.bodyColor} stroke="#222" strokeWidth="2" />

              {config.tireStyle === 'empi-rally' ? (
                <g>
                  <circle cx="0" cy="0" r="28" fill="#1a1a1a" />
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => (
                    <rect key={i} x="-3" y="-26" width="6" height="14" rx="2" fill="url(#chromeGrad)" transform={`rotate(${ang})`} />
                  ))}
                  <circle cx="0" cy="0" r="10" fill="url(#chromeGrad)" />
                </g>
              ) : (
                <g>
                  <circle cx="0" cy="0" r="24" fill="url(#hubcapShine)" stroke="#4b5563" strokeWidth="1.5" />
                  <circle cx="0" cy="0" r="12" fill="none" stroke="#6b7280" strokeWidth="1" />
                  <circle cx="-5" cy="-5" r="4" fill="#ffffff" opacity="0.6" />
                  <text x="0" y="3" fontSize="7" fontWeight="bold" fill="#374151" textAnchor="middle">VW</text>
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
