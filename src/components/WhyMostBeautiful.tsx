import React from 'react';
import { Heart, Smile, Wind, Globe, Sparkles, HandMetal, CheckCircle, Compass } from 'lucide-react';
import { WHY_MOST_BEAUTIFUL_REASONS, GLOBAL_NAMES } from '../data/vosvosData';

// Import our generated high-fidelity vintage photos
import coastalImg from '../assets/images/vosvos_classic_coastal_1788252749894.jpg';
import autumnImg from '../assets/images/vosvos_autumn_sunshine_1788252768433.jpg';
import sunsetImg from '../assets/images/vosvos_sunset_cabriolet_1788252783220.jpg';

export const WhyMostBeautiful: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smile':
        return <Smile className="w-6 h-6 text-[#A67B5B]" />;
      case 'Heart':
        return <Heart className="w-6 h-6 text-[#8FA382]" />;
      case 'Wind':
        return <Wind className="w-6 h-6 text-[#7D8E74]" />;
      case 'Globe':
        return <Globe className="w-6 h-6 text-[#8FA382]" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-[#D4A373]" />;
      case 'HandMetal':
        return <HandMetal className="w-6 h-6 text-[#A67B5B]" />;
      default:
        return <CheckCircle className="w-6 h-6 text-[#8FA382]" />;
    }
  };

  return (
    <div className="w-full flex flex-col gap-12 py-4 text-[#4A443F]">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E9EDC9] border border-[#CCD5AE] text-[#5D554D] text-xs font-bold uppercase tracking-wider mb-3">
          <Heart className="w-3.5 h-3.5 fill-[#8FA382] text-[#8FA382]" />
          <span>Bir Tutku & Yaşam Tarzı</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#5D554D] font-serif-vintage tracking-tight">
          Neden Dünyanın En Güzel Arabası Vosvos’tur?
        </h2>
        <p className="mt-3 text-[#8C847C] text-base leading-relaxed">
          O sadece 4 tekerlekli bir taşıt değil; gülümseyen yuvarlak hatları, hava soğutmalı boksör motorunun tatlı pırıltısı ve insanlara yaşattığı saf mutlulukla otomobil tarihinin yaşayan en büyük efsanesidir.
        </p>
      </div>

      {/* 6 Reasons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {WHY_MOST_BEAUTIFUL_REASONS.map((item, idx) => (
          <div
            key={idx}
            className="p-6 rounded-[28px] bg-[#FDFBF7] border border-[#E9E4DB] shadow-xs hover:shadow-md hover:border-[#8FA382] transition-all flex flex-col gap-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#E9EDC9]/50 border border-[#CCD5AE] flex items-center justify-center group-hover:scale-110 transition-transform">
              {getIcon(item.icon)}
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#5D554D] font-serif-vintage">
                {item.title}
              </h3>
              <span className="text-xs font-semibold text-[#A67B5B] block mt-0.5">
                {item.short}
              </span>
            </div>
            <p className="text-sm text-[#8C847C] leading-relaxed mt-1">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Generated Cinematic Photo Gallery with Stories */}
      <div className="w-full rounded-[32px] bg-[#3E3834] text-[#FDFBF7] p-6 sm:p-10 border border-[#5D554D] shadow-xl overflow-hidden relative">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E9EDC9] flex items-center gap-1.5 mb-2">
            <Compass className="w-4 h-4 text-[#CCD5AE]" />
            Nostalji & Yolculuk Günlükleri
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold font-serif-vintage text-[#FDFBF7]">
            Her Köşesinde Bir Masal, Her Renginde Bir Anı
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-[24px] overflow-hidden bg-[#2D2825] border border-[#5D554D] flex flex-col group">
            <div className="relative aspect-16/10 overflow-hidden">
              <img
                src={coastalImg}
                alt="Turkuaz Vosvos Sahil Yolu"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#1E1B19]/80 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-bold text-[#E9EDC9] border border-[#5D554D]">
                1962 Klasik Ege Sahili
              </div>
            </div>
            <div className="p-4 flex flex-col gap-1.5 flex-1">
              <h4 className="font-bold text-base text-[#CCD5AE]">Ege Rüzgarı & Turkuaz Huzur</h4>
              <p className="text-xs text-[#D6D1C7] leading-relaxed">
                Mavi gökyüzü, tuzlu deniz meltemi ve arkada tıkır tıkır çalışan hava soğutmalı motor eşliğinde virajlı kıyı yollarında sonsuz bir özgürlük.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-[24px] overflow-hidden bg-[#2D2825] border border-[#5D554D] flex flex-col group">
            <div className="relative aspect-16/10 overflow-hidden">
              <img
                src={autumnImg}
                alt="Güneş Sarısı Vosvos Sonbahar"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#1E1B19]/80 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-bold text-[#E9EDC9] border border-[#5D554D]">
                1974 Güneş Sarısı Nostalji
              </div>
            </div>
            <div className="p-4 flex flex-col gap-1.5 flex-1">
              <h4 className="font-bold text-base text-[#CCD5AE]">Yeşilçam Sıcaklığı & Sarı Efsane</h4>
              <p className="text-xs text-[#D6D1C7] leading-relaxed">
                Tavanındaki deri bavuluyla Arnavut kaldırımlı sokaklardan geçen, herkesin dönüp gülümsediği sıcacık bir sonbahar hatırası.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-[24px] overflow-hidden bg-[#2D2825] border border-[#5D554D] flex flex-col group">
            <div className="relative aspect-16/10 overflow-hidden">
              <img
                src={sunsetImg}
                alt="Bebek Mavisi Vosvos Gün Batımı"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#1E1B19]/80 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-bold text-[#E9EDC9] border border-[#5D554D]">
                1968 Çiçek Çocuk & Sörf
              </div>
            </div>
            <div className="p-4 flex flex-col gap-1.5 flex-1">
              <h4 className="font-bold text-base text-[#CCD5AE]">Gün Batımı & Barış Ruhu</h4>
              <p className="text-xs text-[#D6D1C7] leading-relaxed">
                Woodstock'tan ilham alan çiçek desenleri, üstü açık gökyüzü ve kumsalda yakılan kamp ateşinin en vefalı eşlikçisi.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Worldwide Naming & Cultural Cards */}
      <div className="w-full bg-[#FDFBF7] rounded-[32px] border border-[#E9E4DB] p-6 sm:p-8 shadow-xs">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8FA382]">
            Küresel Fenomen
          </span>
          <h3 className="text-2xl font-bold font-serif-vintage text-[#5D554D] mt-1">
            Dünya Dillerinde Vosvos İsimleri
          </h3>
          <p className="text-xs text-[#8C847C] mt-1">
            Her ülke ona kendi dilinde en sevimli hayvanın veya nesnenin adını vermiştir.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {GLOBAL_NAMES.map((g, i) => (
            <div
              key={i}
              className="p-4 rounded-[20px] bg-[#F7F3EE] border border-[#E9E4DB] flex flex-col gap-1 hover:border-[#8FA382] hover:bg-[#E9EDC9]/30 transition-all text-center"
            >
              <span className="text-2xl mb-0.5">{g.flag}</span>
              <span className="font-bold text-xs text-[#5D554D]">{g.country}</span>
              <span className="font-bold text-sm text-[#A67B5B] font-serif-vintage">{g.name}</span>
              <span className="text-[10px] text-[#8C847C] leading-tight mt-0.5">{g.meaning}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
