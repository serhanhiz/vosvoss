import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Gauge, Key, Volume2, Flame, Lightbulb, Zap, Radio } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface SoundCockpitProps {
  isEngineRunning: boolean;
  onEngineStateChange: (running: boolean) => void;
  rpm: number;
  onRpmChange: (rpm: number) => void;
  headlightsOn: boolean;
  onToggleLights: () => void;
}

export const SoundCockpit: React.FC<SoundCockpitProps> = ({
  isEngineRunning,
  onEngineStateChange,
  rpm,
  onRpmChange,
  headlightsOn,
  onToggleLights,
}) => {
  const [ignitionState, setIgnitionState] = useState<'off' | 'on' | 'cranking'>('off');
  const [hazardsOn, setHazardsOn] = useState(false);
  const [isPressingGas, setIsPressingGas] = useState(false);
  const revIntervalRef = useRef<number | null>(null);

  // Sync internal state with prop
  useEffect(() => {
    if (!isEngineRunning && ignitionState !== 'off') {
      setIgnitionState('off');
    }
  }, [isEngineRunning, ignitionState]);

  // Handle Ignition Turning
  const handleKeyTurn = () => {
    if (isEngineRunning) {
      // Turn off
      audioEngine.playClick(450);
      audioEngine.stopEngine();
      onEngineStateChange(false);
      setIgnitionState('off');
      onRpmChange(850);
    } else {
      // Start cranking
      audioEngine.playClick(900);
      setIgnitionState('cranking');

      audioEngine.playStarterCrank(() => {
        audioEngine.startEngine(950);
        onEngineStateChange(true);
        setIgnitionState('on');
        onRpmChange(950);
      });
    }
  };

  // Hold-to-Rev Gas Pedal
  const handleGasStart = () => {
    if (!isEngineRunning) return;
    setIsPressingGas(true);

    if (revIntervalRef.current) clearInterval(revIntervalRef.current);
    revIntervalRef.current = window.setInterval(() => {
      onRpmChange(Math.min(4200, (audioEngine.getCurrentRpm() || 900) + 250));
      audioEngine.setRpm(Math.min(4200, (audioEngine.getCurrentRpm() || 900) + 250));
    }, 40);
  };

  const handleGasEnd = () => {
    setIsPressingGas(false);
    if (revIntervalRef.current) clearInterval(revIntervalRef.current);

    revIntervalRef.current = window.setInterval(() => {
      const current = audioEngine.getCurrentRpm() || 900;
      if (current > 920) {
        const next = Math.max(900, current - 180);
        onRpmChange(next);
        audioEngine.setRpm(next);
      } else {
        if (revIntervalRef.current) clearInterval(revIntervalRef.current);
      }
    }, 30);
  };

  // Speed calculation from RPM (simulated 3rd gear)
  const simulatedSpeed = isEngineRunning ? Math.round(((rpm - 800) / 3200) * 85) : 0;

  return (
    <div className="w-full rounded-[32px] bg-[#3E3834] border border-[#5D554D] p-5 sm:p-7 text-[#FDFBF7] shadow-xl relative overflow-hidden">
      {/* Natural Tone Bezel Strip Accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#8FA382] via-[#E9EDC9] to-[#A67B5B] opacity-90" />

      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-[#5D554D] pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#8FA382]/20 border border-[#8FA382]/40 flex items-center justify-center text-[#CCD5AE]">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#FDFBF7] font-serif-vintage tracking-wide">
              VDO Kokpit & Boksör Motor Simülatörü
            </h3>
            <p className="text-xs text-[#D6D1C7]">
              1.3L / 1.6L Hava Soğutmalı Düz 4 Silindir Boksör Ses Motoru
            </p>
          </div>
        </div>

        {/* Engine status pill */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold border transition-colors ${
              isEngineRunning
                ? 'bg-[#8FA382]/30 text-[#E9EDC9] border-[#8FA382]/60 shadow-xs'
                : 'bg-[#2D2825] text-[#A89F96] border-[#5D554D]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isEngineRunning ? 'bg-[#CCD5AE] animate-ping' : 'bg-[#8C847C]'
              }`}
            />
            {isEngineRunning ? 'MOTOR ÇALIŞIYOR' : 'KONTAK KAPALI'}
          </span>
        </div>
      </div>

      {/* Main Gauges and Control Cluster */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Gauge: Vintage Round VDO Speedometer */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-[24px] bg-[#2D2825] border border-[#5D554D] relative">
          <div className="w-44 h-44 rounded-full bg-gradient-to-b from-[#3E3834] to-[#1E1B19] border-4 border-[#8FA382]/60 shadow-inner flex flex-col items-center justify-center relative">
            {/* Speedometer Ring Ticks */}
            <div className="absolute inset-2 rounded-full border border-[#5D554D]/60" />
            <span className="text-[10px] uppercase tracking-wider text-[#A89F96] font-bold -mt-2">
              VDO GERMANY
            </span>

            {/* Needle Gauge */}
            <div className="my-1">
              <span className="text-4xl font-extrabold text-[#FDFBF7] font-mono tracking-tight">
                {simulatedSpeed}
              </span>
              <span className="text-xs text-[#D4A373] ml-1 font-bold">km/s</span>
            </div>

            {/* Odometer */}
            <div className="bg-[#1E1B19] px-2.5 py-0.5 rounded border border-[#5D554D] font-mono text-xs text-[#E9EDC9] tracking-widest mt-1">
              074529
            </div>

            {/* Warning Lights */}
            <div className="flex gap-4 mt-2">
              {/* Oil Light */}
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  !isEngineRunning && ignitionState !== 'off'
                    ? 'bg-rose-500 shadow-rose-500 shadow-xs'
                    : 'bg-[#5D554D]'
                }`}
                title="Yağ Basıncı"
              />
              {/* Gen/Battery Light */}
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  !isEngineRunning && ignitionState !== 'off'
                    ? 'bg-[#D4A373] shadow-[#D4A373] shadow-xs'
                    : 'bg-[#5D554D]'
                }`}
                title="Şarj Dinamosu"
              />
              {/* Turn / Hazard Light */}
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  hazardsOn ? 'bg-[#8FA382] shadow-[#8FA382] shadow-xs animate-pulse' : 'bg-[#5D554D]'
                }`}
                title="Sinyal"
              />
            </div>
          </div>
          <span className="text-xs text-[#D6D1C7] mt-2 font-medium">Hız Göstergesi</span>
        </div>

        {/* Center: Tachometer (Devir Saati) & Throttle Pedal */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-[24px] bg-[#2D2825] border border-[#5D554D]">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#D6D1C7] flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-[#D4A373]" />
              Boksör Motor Devri (RPM)
            </span>
            <span className="font-mono text-[#E9EDC9] font-bold text-sm">{Math.round(rpm)} devir</span>
          </div>

          {/* RPM Bar Meter */}
          <div className="w-full h-5 bg-[#1E1B19] rounded-full border border-[#5D554D] overflow-hidden p-0.5 relative mb-4">
            <div
              className="h-full rounded-full transition-all duration-75 bg-gradient-to-r from-[#8FA382] via-[#D4A373] to-[#A67B5B]"
              style={{ width: `${Math.min(100, ((rpm - 700) / 4000) * 100)}%` }}
            />
          </div>

          {/* Throttle Controls: Interactive Gas Pedal & Slider */}
          <div className="w-full flex flex-col sm:flex-row items-center gap-3">
            {/* Hold to Rev Gas Pedal Button */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onMouseDown={handleGasStart}
              onMouseUp={handleGasEnd}
              onTouchStart={handleGasStart}
              onTouchEnd={handleGasEnd}
              disabled={!isEngineRunning}
              className={`flex-1 w-full py-3.5 px-4 rounded-full font-bold flex items-center justify-center gap-2 border shadow-md select-none transition-all ${
                !isEngineRunning
                  ? 'bg-[#3E3834] text-[#8C847C] border-[#5D554D] cursor-not-allowed'
                  : isPressingGas
                  ? 'bg-[#A67B5B] text-white border-[#8d6447] shadow-[#A67B5B]/30'
                  : 'bg-[#3E3834] hover:bg-[#4A443F] text-[#E9EDC9] border-[#5D554D] hover:border-[#8FA382]'
              }`}
            >
              <Flame className={`w-5 h-5 ${isPressingGas ? 'animate-bounce text-[#E9EDC9]' : 'text-[#D4A373]'}`} />
              <span>{isPressingGas ? 'GAZ VERİLİYOR! 💨' : 'Gaza Bas (Basılı Tut)'}</span>
            </motion.button>
          </div>
          <p className="text-[11px] text-[#A89F96] mt-2">
            Hava soğutmalı motorun torkunu ve patırtısını dinlemek için pedala basılı tutun
          </p>
        </div>

        {/* Right: Vintage Switches & Chrome Horn */}
        <div className="md:col-span-3 flex flex-col gap-3">
          {/* Ignition Key Button */}
          <button
            onClick={handleKeyTurn}
            disabled={ignitionState === 'cranking'}
            className={`w-full py-3 px-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 border transition-all shadow-md active:scale-95 ${
              isEngineRunning
                ? 'bg-[#A67B5B]/80 hover:bg-[#A67B5B] text-white border-[#8d6447]'
                : ignitionState === 'cranking'
                ? 'bg-[#D4A373] text-[#4A443F] border-[#E9EDC9] animate-pulse'
                : 'bg-[#8FA382] hover:bg-[#7D8E74] text-white border-[#6c7d63]'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>
              {ignitionState === 'cranking'
                ? 'Marş Basıyor...'
                : isEngineRunning
                ? 'Kontak Kapat'
                : 'Kontak Aç & Marşa Bas'}
            </span>
          </button>

          {/* Big Chrome Klakson Horn */}
          <button
            onClick={() => {
              audioEngine.playHorn();
            }}
            className="w-full py-3 px-4 rounded-full font-bold text-sm bg-[#FDFBF7] hover:bg-[#E9E4DB] text-[#4A443F] border-2 border-[#D6D1C7] shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Volume2 className="w-4 h-4 text-[#A67B5B]" />
            <span>Krom Klakson (Korna)</span>
          </button>

          {/* Toggle Headlights & Hazards */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                audioEngine.playClick(1200);
                onToggleLights();
              }}
              className={`py-2 px-2.5 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                headlightsOn
                  ? 'bg-[#8FA382] text-white border-[#7D8E74] font-bold'
                  : 'bg-[#2D2825] text-[#D6D1C7] border-[#5D554D] hover:bg-[#3E3834]'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{headlightsOn ? 'Farlar Açık' : 'Far Çekme'}</span>
            </button>

            <button
              onClick={() => {
                audioEngine.playClick(650);
                setHazardsOn(!hazardsOn);
              }}
              className={`py-2 px-2.5 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                hazardsOn
                  ? 'bg-[#A67B5B] text-white border-[#8d6447] font-bold'
                  : 'bg-[#2D2825] text-[#D6D1C7] border-[#5D554D] hover:bg-[#3E3834]'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Dörtlü Flaşör</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
