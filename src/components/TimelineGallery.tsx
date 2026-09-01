import React, { useState } from 'react';
import { Calendar, Cpu, Award, Zap, CheckCircle2, History, Info } from 'lucide-react';
import { TIMELINE_DATA } from '../data/vosvosData';
import { audioEngine } from '../utils/audioEngine';

export const TimelineGallery: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(2); // default to 60s Golden era

  const current = TIMELINE_DATA[selectedIdx];

  const FUN_FACTS = [
    {
      title: 'Su Üzerinde Yüzebilme Özelliği',
      desc: 'Taban sacı kusursuzca izole edilen orijinal Vosvoslar, gövde sızdırmazlığı sayesinde suya düştüğünde dakikalarca batmadan su üzerinde yüzebiliyordu.',
    },
    {
      title: 'Tarihin En Çok Üretilen Tek Platformu',
      desc: '1972 yılında 15.007.034\'üncü aracın üretimiyle Ford Model T\'nin rekorunu geride bırakarak dünya rekoru kırdı.',
    },
    {
      title: 'Radyatörsüz Hava Soğutma',
      desc: 'Donacak veya kaynayacak suyu olmayan hava soğutmalı motoru, hem Sahra Çölü\'nün sıcağında hem de Sibirya kışında sorunsuz çalışıyordu.',
    },
    {
      title: 'Sadece 4 Cıvatayla Motor Sökümü',
      desc: 'Bir Vosvos motoru yalnızca 4 adet ana cıvata sökülerek yarım saat içinde araçtan tamamen ayrılıp tamir edilebilecek kadar yalın tasarlanmıştı.',
    },
  ];

  return (
    <div className="w-full flex flex-col gap-10 py-4 text-[#4A443F]">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E9EDC9] border border-[#CCD5AE] text-[#5D554D] text-xs font-bold uppercase tracking-wider mb-3">
          <History className="w-3.5 h-3.5 text-[#8FA382]" />
          <span>1938’den 2003’e Efsanenin Evrimi</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#5D554D] font-serif-vintage tracking-tight">
          Vosvos Nesilleri & Zaman Çizelgesi
        </h2>
        <p className="mt-3 text-[#8C847C] text-base leading-relaxed">
          65 yıllık kesintisiz üretim serüveninde bölünmüş arka camlardan kavisli Super Beetle modellerine uzanan büyüleyici tasarım evrimi.
        </p>
      </div>

      {/* Interactive Year Selector Bar */}
      <div className="w-full overflow-x-auto pb-2">
        <div className="flex items-center justify-start sm:justify-center gap-2.5 min-w-max px-2">
          {TIMELINE_DATA.map((item, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <button
                key={idx}
                onClick={() => {
                  audioEngine.playClick(900 + idx * 50);
                  setSelectedIdx(idx);
                }}
                className={`px-4 py-3 rounded-2xl border transition-all text-left flex flex-col ${
                  isSelected
                    ? 'bg-[#8FA382] text-white border-[#7D8E74] shadow-md ring-2 ring-[#8FA382]/40 scale-102 font-bold'
                    : 'bg-[#FDFBF7] hover:bg-[#E9E4DB]/50 text-[#5D554D] border-[#E9E4DB] shadow-2xs'
                }`}
              >
                <span className="text-[11px] font-mono opacity-85">{item.yearRange}</span>
                <span className="text-sm font-bold truncate mt-0.5">{item.shortName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Era Deep Dive Card */}
      <div className="w-full bg-[#FDFBF7] rounded-[32px] border border-[#E9E4DB] shadow-sm p-6 sm:p-9 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Model Details */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#E9EDC9] text-[#5D554D] border border-[#CCD5AE] text-xs font-bold">
              {current.badge}
            </span>
            <span className="text-xs text-[#8C847C] font-mono">{current.yearRange}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#5D554D] font-serif-vintage">
            {current.title}
          </h3>

          <p className="text-[#5D554D] text-sm leading-relaxed bg-[#F7F3EE] p-4 rounded-2xl border border-[#E9E4DB]">
            {current.historicalNote}
          </p>

          <div>
            <h4 className="text-xs font-bold text-[#5D554D] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#8FA382]" />
              Bu Döneme Özgü Tasarım Özellikleri
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {current.features.map((feat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs text-[#5D554D] bg-[#F7F3EE] p-3 rounded-xl border border-[#E9E4DB] font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8FA382] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Engine & Performance Card */}
        <div className="lg:col-span-5 bg-[#3E3834] rounded-[28px] p-6 text-[#FDFBF7] border border-[#5D554D] shadow-md flex flex-col gap-4">
          <div className="flex items-center gap-2 text-[#CCD5AE] border-b border-[#5D554D] pb-3">
            <Cpu className="w-5 h-5 text-[#8FA382]" />
            <h4 className="font-bold text-sm tracking-wide uppercase font-mono">
              Teknik Özellikler & Boksör Motor
            </h4>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col">
              <span className="text-[11px] text-[#A89F96] uppercase tracking-wider">Motor Hacmi & Tipi</span>
              <span className="font-bold text-base text-[#E9EDC9]">{current.engine}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-[11px] text-[#A89F96] uppercase tracking-wider">Güç Değeri (Beygir)</span>
              <span className="font-bold text-base text-[#CCD5AE]">{current.horsepower}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-[11px] text-[#A89F96] uppercase tracking-wider">Soğutma Sistemi</span>
              <span className="font-bold text-sm text-[#FDFBF7]">Hava Soğutmalı Düz 4 Silindirli Boksör</span>
            </div>

            <div className="flex flex-col">
              <span className="text-[11px] text-[#A89F96] uppercase tracking-wider">Çekiş & Konum</span>
              <span className="font-bold text-sm text-[#FDFBF7]">Arkadan Motorlu & Arkadan İtişli (RR Layout)</span>
            </div>
          </div>

          <div className="mt-2 pt-3 border-t border-[#5D554D] flex items-center justify-between text-xs text-[#A89F96]">
            <span>Dönem Üretim Yeri:</span>
            <span className="font-bold text-[#E9EDC9]">Wolfsburg / Emden / Puebla</span>
          </div>
        </div>
      </div>

      {/* Did You Know? Trivia Section */}
      <div className="w-full bg-[#F7F3EE] border border-[#E9E4DB] rounded-[32px] p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-[#8FA382]" />
          <h3 className="text-xl font-bold font-serif-vintage text-[#5D554D]">
            Biliyor muydunuz? Vosvos Hakkında İnanılmaz Gerçekler
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FUN_FACTS.map((fact, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E9E4DB] shadow-2xs flex flex-col gap-1.5"
            >
              <span className="font-bold text-sm text-[#5D554D] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#E9EDC9] text-[#5D554D] text-xs flex items-center justify-center font-extrabold shrink-0">
                  {idx + 1}
                </span>
                {fact.title}
              </span>
              <p className="text-xs text-[#8C847C] leading-relaxed mt-1">
                {fact.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
