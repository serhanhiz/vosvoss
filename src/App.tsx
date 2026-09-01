/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Sparkles,
  Volume2,
  Compass,
  Palette,
  History,
  Gamepad2,
  HelpCircle,
  Share2,
  Download,
  Info,
  Car,
  Lightbulb,
  Radio,
} from 'lucide-react';
import { VosvosConfig, PresetVosvos } from './types';
import { PRESET_VOSVOS_LIST } from './data/vosvosData';
import { VosvosCanvas } from './components/VosvosCanvas';
import { SoundCockpit } from './components/SoundCockpit';
import { CustomizerPanel } from './components/CustomizerPanel';
import { WhyMostBeautiful } from './components/WhyMostBeautiful';
import { TimelineGallery } from './components/TimelineGallery';
import { VosvosQuiz } from './components/VosvosQuiz';
import { VosvosGame } from './components/VosvosGame';
import { audioEngine } from './utils/audioEngine';

export default function App() {
  // Main Vosvos Configuration State
  const [config, setConfig] = useState<VosvosConfig>(PRESET_VOSVOS_LIST[0].config);
  const [isEngineRunning, setIsEngineRunning] = useState(false);
  const [rpm, setRpm] = useState(850);
  const [activeTab, setActiveTab] = useState<'studio' | 'why' | 'history' | 'quiz' | 'game'>('studio');
  const [showShareModal, setShowShareModal] = useState(false);

  // Stop engine safely if unmounting
  useEffect(() => {
    return () => {
      audioEngine.stopEngine();
    };
  }, []);

  const handleApplyPreset = (preset: PresetVosvos) => {
    setConfig(preset.config);
  };

  const handleToggleLights = () => {
    setConfig((prev) => ({ ...prev, headlightsOn: !prev.headlightsOn }));
  };

  const handleHonk = () => {
    audioEngine.playHorn();
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#4A443F] flex flex-col selection:bg-[#E9EDC9] selection:text-[#4A443F]">
      {/* Top Banner Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#E9E4DB] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#8FA382] text-white flex items-center justify-center font-bold shadow-xs border border-[#7D8E74]">
              <span className="text-xl">🚗</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-base sm:text-lg text-[#5D554D] font-serif-vintage tracking-tight italic">
                  Vosvos Kulübü
                </h1>
                <span className="text-[10px] bg-[#E9EDC9] text-[#5D554D] font-bold px-2 py-0.5 rounded-full border border-[#CCD5AE]">
                  Type 1 Efsanesi
                </span>
              </div>
              <p className="text-[11px] text-[#8C847C] font-medium hidden sm:block">
                Dünyanın En Güzel Ruhu & Otomobili
              </p>
            </div>
          </div>

          {/* Navigation Pill Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {[
              { id: 'studio', label: 'Tasarım & Ses', icon: Palette },
              { id: 'why', label: 'Neden En Güzel?', icon: Heart },
              { id: 'history', label: 'Tarihçe & Motor', icon: History },
              { id: 'quiz', label: 'Kişilik Testi', icon: HelpCircle },
              { id: 'game', label: 'Sarı Vosvos Oyunu', icon: Gamepad2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    audioEngine.playClick(900);
                    setActiveTab(tab.id as typeof activeTab);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-all shrink-0 ${
                    isActive
                      ? 'bg-[#8FA382] text-[#FDFBF7] shadow-xs'
                      : 'text-[#8C847C] hover:text-[#4A443F] hover:bg-[#F7F3EE]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Sound/Share Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                audioEngine.playClick(1000);
                setShowShareModal(true);
              }}
              className="px-3.5 py-1.5 rounded-full bg-[#F7F3EE] hover:bg-[#E9E4DB] text-[#5D554D] border border-[#E9E4DB] text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
              title="Vosvos Kartını Paylaş"
            >
              <Share2 className="w-3.5 h-3.5 text-[#A67B5B]" />
              <span className="hidden md:inline">Kartımı Paylaş</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 flex flex-col gap-8 w-full">
        {/* TOP INTERACTIVE HERO SECTION (Always Visible or Primary in Studio) */}
        <section className="w-full flex flex-col gap-6">
          {/* Main Visual Display */}
          <VosvosCanvas
            config={config}
            isEngineRunning={isEngineRunning}
            rpm={rpm}
            onHonk={handleHonk}
            onToggleLights={handleToggleLights}
          />

          {/* Sound Cockpit & Boxer Engine Simulator */}
          <SoundCockpit
            isEngineRunning={isEngineRunning}
            onEngineStateChange={setIsEngineRunning}
            rpm={rpm}
            onRpmChange={setRpm}
            headlightsOn={config.headlightsOn}
            onToggleLights={handleToggleLights}
          />
        </section>

        {/* Dynamic Tab Views */}
        <section className="w-full">
          {activeTab === 'studio' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-8"
            >
              {/* Customizer Panel */}
              <CustomizerPanel
                config={config}
                onChangeConfig={setConfig}
                onApplyPreset={handleApplyPreset}
              />

              {/* Quick Cultural Highlight Preview */}
              <div className="w-full bg-[#8FA382] text-[#FDFBF7] rounded-[32px] border border-[#7D8E74] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#FDFBF7]/20 text-[#FDFBF7] flex items-center justify-center font-bold text-2xl shadow-xs shrink-0 border border-[#FDFBF7]/30">
                    ☮️
                  </div>
                  <div>
                    <span className="text-[#E9EDC9] text-xs font-bold uppercase tracking-widest block mb-1">
                      01. Felsefe & Yaşam Tarzı
                    </span>
                    <h4 className="font-bold font-serif-vintage text-lg sm:text-xl text-[#FDFBF7]">
                      "Bence Dünyanın En Güzel Arabası Vosvos’tur"
                    </h4>
                    <p className="text-xs text-[#FDFBF7]/85 mt-1 max-w-xl leading-relaxed">
                      Gülümseyen tasarımı, sevgi dolu topluluğu ve asla eskimeyen hatlarıyla bir otomobilden çok daha fazlası; yollardaki dost canlısı ruh.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    audioEngine.playClick(950);
                    setActiveTab('why');
                  }}
                  className="px-6 py-3 rounded-full bg-[#FDFBF7] text-[#5D554D] hover:bg-[#E9EDC9] font-bold text-xs uppercase tracking-wider transition-all shrink-0 shadow-xs"
                >
                  Hikayeyi Keşfet →
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'why' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <WhyMostBeautiful />
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <TimelineGallery />
            </motion.div>
          )}

          {activeTab === 'quiz' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <VosvosQuiz onApplyPreset={handleApplyPreset} />
            </motion.div>
          )}

          {activeTab === 'game' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <VosvosGame />
            </motion.div>
          )}
        </section>
      </main>

      {/* Share / Card Modal */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-50 bg-[#4A443F]/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#FDFBF7] rounded-[32px] p-6 sm:p-8 border border-[#E9E4DB] shadow-2xl flex flex-col gap-4 text-center relative text-[#4A443F]"
            >
              <button
                onClick={() => setShowShareModal(false)}
                className="absolute top-5 right-5 text-[#8C847C] hover:text-[#4A443F] w-8 h-8 rounded-full bg-[#F7F3EE] border border-[#E9E4DB] flex items-center justify-center text-sm font-bold transition-all"
              >
                ✕
              </button>

              <div className="w-14 h-14 rounded-full bg-[#8FA382] text-white flex items-center justify-center mx-auto text-2xl font-bold shadow-xs">
                🚗
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#A67B5B] uppercase tracking-widest">
                  Özel Vosvos Koleksiyon Kartı
                </span>
                <h3 className="text-2xl font-extrabold text-[#5D554D] font-serif-vintage mt-1">
                  {config.presetName || 'Özel Üretim Vosvos'}
                </h3>
              </div>

              {/* Card preview badge */}
              <div className="p-4 rounded-[20px] bg-[#F7F3EE] border border-[#E9E4DB] text-left flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#8C847C]">Gövde Rengi:</span>
                  <span className="text-[#5D554D] flex items-center gap-1.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20"
                      style={{ backgroundColor: config.bodyColor }}
                    />
                    {config.colorName}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#8C847C]">Kasa Stili:</span>
                  <span className="text-[#5D554D] uppercase font-mono">{config.modelStyle}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#8C847C]">Plaka:</span>
                  <span className="bg-[#5D554D] text-[#FDFBF7] px-2.5 py-0.5 rounded font-mono font-bold text-[11px]">
                    {config.licensePlate}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#8C847C]">Tavan Ekipmanı:</span>
                  <span className="text-[#5D554D]">{config.roofRack}</span>
                </div>
              </div>

              <p className="text-xs text-[#8C847C] italic leading-relaxed">
                "Dünyanın en güzel arabasını tasarladınız! Sevgi ve hava soğutmalı boksör motor sesiyle yollarda kalın."
              </p>

              <button
                onClick={() => {
                  audioEngine.playHorn();
                  setShowShareModal(false);
                }}
                className="w-full py-3.5 rounded-full bg-[#A67B5B] hover:bg-[#8f684c] text-white font-bold text-sm shadow-sm transition-all active:scale-95 uppercase tracking-wider"
              >
                Harika! Yola Çıkalım 🌿
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="w-full bg-[#4A443F] text-[#D6D1C7] border-t border-[#5D554D] py-10 px-4 sm:px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#8FA382] text-white flex items-center justify-center text-xl font-bold">
              V
            </div>
            <div>
              <p className="text-sm font-bold text-[#FDFBF7] font-serif-vintage tracking-tight">
                Vosvos Kulübü • Volkswagen Beetle Type 1
              </p>
              <p className="text-xs text-[#A89F96]">
                1938 – 2003 • 21.529.464 Adet Efsanevi Üretim • Hava Soğutmalı Boksör Mirası
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs text-[#D6D1C7] font-medium">
            <span>© Vosvos Sevenler Cemiyeti</span>
            <span className="text-[#8FA382]">Klaksonla Selam Verin ✌️</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
