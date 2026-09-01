import React from 'react';
import { Palette, Sparkles, Sliders, Shield, Tag, Compass } from 'lucide-react';
import { VosvosConfig, PresetVosvos } from '../types';
import { AUTHENTIC_COLORS, PRESET_VOSVOS_LIST } from '../data/vosvosData';
import { audioEngine } from '../utils/audioEngine';

interface CustomizerPanelProps {
  config: VosvosConfig;
  onChangeConfig: (updater: (prev: VosvosConfig) => VosvosConfig) => void;
  onApplyPreset: (preset: PresetVosvos) => void;
}

export const CustomizerPanel: React.FC<CustomizerPanelProps> = ({
  config,
  onChangeConfig,
  onApplyPreset,
}) => {
  const handleColorPick = (colorHex: string, name: string) => {
    audioEngine.playClick(950);
    onChangeConfig((prev) => ({
      ...prev,
      bodyColor: colorHex,
      colorName: name,
    }));
  };

  const handleRoofChange = (roof: VosvosConfig['roofRack']) => {
    audioEngine.playClick(850);
    onChangeConfig((prev) => ({ ...prev, roofRack: roof }));
  };

  const handleTireChange = (tire: VosvosConfig['tireStyle']) => {
    audioEngine.playClick(750);
    onChangeConfig((prev) => ({ ...prev, tireStyle: tire }));
  };

  const handleDecalChange = (decal: VosvosConfig['decals']) => {
    audioEngine.playClick(900);
    onChangeConfig((prev) => ({ ...prev, decals: decal }));
  };

  const handleModelStyleChange = (style: VosvosConfig['modelStyle']) => {
    audioEngine.playClick(800);
    onChangeConfig((prev) => ({ ...prev, modelStyle: style }));
  };

  return (
    <div className="w-full bg-[#F7F3EE] rounded-[32px] border border-[#E9E4DB] shadow-sm p-6 sm:p-8 flex flex-col gap-6 text-[#4A443F]">
      {/* Header & Quick Presets */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#8FA382]" />
            <h3 className="font-bold text-lg text-[#5D554D] font-serif-vintage tracking-tight">
              Efsanevi Vosvos Atölyesi & Koleksiyonlar
            </h3>
          </div>
          <span className="text-xs bg-[#E9EDC9] text-[#5D554D] font-semibold px-3 py-0.5 rounded-full border border-[#CCD5AE]">
            Özel Tasarım
          </span>
        </div>

        {/* Preset Cards Horizon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {PRESET_VOSVOS_LIST.map((preset) => {
            const isSelected = config.presetName === preset.config.presetName;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  audioEngine.playClick(1050);
                  onApplyPreset(preset);
                }}
                className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#8FA382] bg-[#E9EDC9]/50 shadow-xs ring-2 ring-[#8FA382]/30 font-bold'
                    : 'border-[#E9E4DB] bg-[#FDFBF7] hover:bg-[#E9E4DB]/40 hover:border-[#D6D1C7]'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-xs shrink-0"
                    style={{ backgroundColor: preset.config.bodyColor }}
                  />
                  <span className="font-bold text-xs text-[#5D554D] truncate">
                    {preset.name.split(' ')[0]} {preset.name.split(' ')[1] || ''}
                  </span>
                </div>
                <span className="text-[11px] text-[#8C847C] line-clamp-2 leading-tight">
                  {preset.tagline}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-[1px] bg-[#E9E4DB]" />

      {/* Main Configuration Tabs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Gövde Rengi (Authentic Classic VW Colors) */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5D554D] uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-[#8FA382]" />
              Orijinal Vosvos Renkleri
            </span>
            <span className="text-xs text-[#8C847C] font-medium">{config.colorName}</span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {AUTHENTIC_COLORS.map((c) => {
              const isCurrent = config.bodyColor.toLowerCase() === c.hex.toLowerCase();
              return (
                <button
                  key={c.hex}
                  onClick={() => handleColorPick(c.hex, c.name.split('(')[0].trim())}
                  className={`group relative h-11 rounded-xl flex items-center justify-center border-2 transition-all shadow-xs ${
                    isCurrent
                      ? 'border-[#5D554D] scale-105 shadow-md ring-2 ring-[#8FA382]/40'
                      : 'border-white/80 hover:scale-102 hover:border-[#D6D1C7]'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={`${c.name} (${c.year})`}
                >
                  {isCurrent && (
                    <span className="w-2.5 h-2.5 rounded-full bg-white shadow-md" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Custom Color Input */}
          <div className="flex items-center gap-2 mt-1">
            <input
              type="color"
              value={config.bodyColor}
              onChange={(e) => handleColorPick(e.target.value, 'Özel Renk')}
              className="w-8 h-8 rounded-lg border border-[#E9E4DB] cursor-pointer p-0 bg-transparent"
              title="Özel Renk Seç"
            />
            <span className="text-xs text-[#8C847C]">veya özel renk kodu belirleyin</span>
          </div>
        </div>

        {/* 2. Kasa Tipi & Çıkartmalar */}
        <div className="flex flex-col gap-4">
          <div>
            <span className="text-xs font-bold text-[#5D554D] uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Compass className="w-4 h-4 text-[#A67B5B]" />
              Kasa & Cam Modeli
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'classic', label: 'Klasik Büyük Cam (1960s)' },
                { id: '1303s', label: 'Super Beetle 1303S' },
                { id: 'oval', label: 'Oval Window (1953)' },
                { id: 'split', label: 'Split Window (1940s)' },
                { id: 'cabrio', label: 'Cabriolet (Üstü Açık)' },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => handleModelStyleChange(style.id as VosvosConfig['modelStyle'])}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                    config.modelStyle === style.id
                      ? 'bg-[#8FA382] text-white border-[#7D8E74] font-bold shadow-xs'
                      : 'bg-[#FDFBF7] hover:bg-[#E9E4DB]/50 text-[#5D554D] border-[#E9E4DB]'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Decals / Temalar */}
          <div>
            <span className="text-xs font-bold text-[#5D554D] uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Tag className="w-4 h-4 text-[#8FA382]" />
              Grafik & Özel Tema
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'none', label: 'Sade / Orijinal' },
                { id: 'herbie', label: 'Herbie #53 Yarış' },
                { id: 'flower-power', label: 'Flower Power 🌸' },
                { id: 'two-tone', label: 'Çift Renk (Two-Tone)' },
                { id: 'rally', label: 'Ralli #73' },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleDecalChange(d.id as VosvosConfig['decals'])}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    config.decals === d.id
                      ? 'bg-[#5D554D] text-[#FDFBF7] border-[#4A443F] font-bold'
                      : 'bg-[#FDFBF7] hover:bg-[#E9E4DB]/50 text-[#5D554D] border-[#E9E4DB]'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Tavan Portbagajı, Jantlar & Plaka */}
        <div className="flex flex-col gap-4">
          {/* Tavan Aksesuarları */}
          <div>
            <span className="text-xs font-bold text-[#5D554D] uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Sliders className="w-4 h-4 text-[#A67B5B]" />
              Tavan Portbagajı
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'none', label: 'Tavansız (Sade)' },
                { id: 'luggage', label: '🧳 Antika Bavul' },
                { id: 'surfboard', label: '🏄 Sörf Tahtası' },
                { id: 'skis', label: '🎿 Ahşap Kayaklar' },
                { id: 'flowers', label: '💐 Çiçek Sepeti' },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleRoofChange(r.id as VosvosConfig['roofRack'])}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border text-left transition-all ${
                    config.roofRack === r.id
                      ? 'bg-[#A67B5B] text-white border-[#8d6447] font-bold'
                      : 'bg-[#FDFBF7] hover:bg-[#E9E4DB]/50 text-[#5D554D] border-[#E9E4DB]'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Jant & Lastik Stili */}
          <div>
            <span className="text-xs font-bold text-[#5D554D] uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Shield className="w-4 h-4 text-[#8FA382]" />
              Jant & Yanak
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'whitewall', label: '🤍 Beyaz Yanak & Krom' },
                { id: 'classic-chrome', label: '🔘 Klasik Krom Kapak' },
                { id: 'empi-rally', label: '🏁 8-Kollu EMPI Ralli' },
                { id: 'moon-caps', label: '🌕 Moon Caps' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleTireChange(t.id as VosvosConfig['tireStyle'])}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border text-left transition-all ${
                    config.tireStyle === t.id
                      ? 'bg-[#5D554D] text-[#FDFBF7] border-[#4A443F] font-bold'
                      : 'bg-[#FDFBF7] hover:bg-[#E9E4DB]/50 text-[#5D554D] border-[#E9E4DB]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Far Kirpikleri & Özel Plaka */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-semibold text-[#5D554D] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={config.headlightEyelashes}
                onChange={(e) => {
                  audioEngine.playClick(1000);
                  onChangeConfig((prev) => ({ ...prev, headlightEyelashes: e.target.checked }));
                }}
                className="rounded text-[#8FA382] focus:ring-[#8FA382] w-4 h-4 accent-[#8FA382]"
              />
              <span>Far Kirpiği 👁️</span>
            </label>

            <div className="flex-1">
              <input
                type="text"
                maxLength={10}
                value={config.licensePlate}
                onChange={(e) => {
                  onChangeConfig((prev) => ({
                    ...prev,
                    licensePlate: e.target.value.toUpperCase(),
                  }));
                }}
                placeholder="Örn: 34 VOS 74"
                className="w-full px-3 py-1.5 bg-[#FDFBF7] border border-[#E9E4DB] rounded-xl text-xs font-bold font-mono uppercase focus:outline-hidden focus:border-[#8FA382] text-[#5D554D]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
