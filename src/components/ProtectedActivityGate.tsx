import React from 'react';
import { motion } from 'motion/react';
import { Lock, Sparkles, Trophy, Gamepad2, HelpCircle, UserCheck, LogIn, UserPlus, ShieldCheck, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProtectedActivityGateProps {
  activityType: 'game' | 'quiz' | 'general';
}

export const ProtectedActivityGate: React.FC<ProtectedActivityGateProps> = ({ activityType }) => {
  const { openAuthModal } = useAuth();

  const activityInfo = {
    game: {
      title: 'Sarı Vosvos Gördüm Oyunu',
      subtitle: 'Klasik yol oyunu şimdi dijital refleks mücadelesiyle karşınızda!',
      icon: Gamepad2,
      badge: '🎮 KULÜP REFLEKS OYUNU',
      description: 'Trafikte akan rengarenk Vosvoslar arasından sarı olanları anında yakala, kombo serisi yakala ve liderlik tablosuna adını yazdır.',
    },
    quiz: {
      title: 'Vosvos Kişilik & Ruh Eşi Testi',
      subtitle: 'Hangi model yılı, rengi ve ruhu senin karakterini yansıtıyor?',
      icon: HelpCircle,
      badge: '🧩 KİŞİLİK & RUH EŞİ ETKİNLİĞİ',
      description: '5 özel soruyla senin yaşam tarzını ve ruhunu analiz ediyor, sana en uygun efsanevi Type 1 modelini ve rengini buluyoruz.',
    },
    general: {
      title: 'Vosvos Oyun & Etkinlik Alanı',
      subtitle: 'Oyun ve testlere katılmak için giriş yapmanız gerekmektedir.',
      icon: Trophy,
      badge: '🔒 ÜYELERE ÖZEL ETKİNLİKLER',
      description: 'Vosvos Kulübü topluluk etkinliklerine katılmak, skorlarınızı kaydetmek ve özel garajınızı oluşturmak için oturum açın.',
    },
  }[activityType];

  const Icon = activityInfo.icon;

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-[#FDFBF7] border-2 border-[#E9E4DB] rounded-[36px] p-6 sm:p-10 shadow-xl overflow-hidden text-center"
      >
        {/* Background Vintage Watermark */}
        <div className="absolute -right-12 -bottom-12 select-none pointer-events-none opacity-5 text-[#8FA382]">
          <span className="text-[200px] font-bold font-serif-vintage">1967</span>
        </div>

        {/* Top Lock Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E9EDC9] border border-[#CCD5AE] text-[#5D554D] text-xs font-bold uppercase tracking-wider mb-6 shadow-2xs">
          <Lock size={13} className="text-[#8FA382]" />
          <span>{activityInfo.badge}</span>
        </div>

        {/* Big Icon & Headline */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-[#8FA382] text-white flex items-center justify-center shadow-lg border-2 border-[#7D8E74] mb-6">
          <Icon size={40} className="stroke-[1.75]" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#5D554D] font-serif-vintage tracking-tight mb-3">
          {activityInfo.title}
        </h2>
        <p className="text-sm sm:text-base text-[#8C847C] max-w-xl mx-auto mb-8 leading-relaxed">
          {activityInfo.description}
        </p>

        {/* Membership Perks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left max-w-2xl mx-auto">
          <div className="bg-white/80 p-4 rounded-2xl border border-[#E9E4DB] shadow-2xs flex flex-col gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E9EDC9] text-[#5D554D] flex items-center justify-center font-bold text-sm">
              🏆
            </div>
            <h4 className="font-bold text-xs text-[#5D554D]">Liderlik Tablosu</h4>
            <p className="text-[11px] text-[#8C847C] leading-snug">
              En yüksek refleks skorunu kaydet ve kulüp sıralamasında yerini al.
            </p>
          </div>

          <div className="bg-white/80 p-4 rounded-2xl border border-[#E9E4DB] shadow-2xs flex flex-col gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E9EDC9] text-[#5D554D] flex items-center justify-center font-bold text-sm">
              🎨
            </div>
            <h4 className="font-bold text-xs text-[#5D554D]">Ruh Eşi Vosvos</h4>
            <p className="text-[11px] text-[#8C847C] leading-snug">
              Test sonucunda sana çıkan özel Vosvos tasarımını profiline bağla.
            </p>
          </div>

          <div className="bg-white/80 p-4 rounded-2xl border border-[#E9E4DB] shadow-2xs flex flex-col gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E9EDC9] text-[#5D554D] flex items-center justify-center font-bold text-sm">
              ✨
            </div>
            <h4 className="font-bold text-xs text-[#5D554D]">Ücretsiz & Hızlı</h4>
            <p className="text-[11px] text-[#8C847C] leading-snug">
              Kayıt olmak sadece 10 saniye sürer, hiçbir kart veya onay gerektirmez.
            </p>
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
          <button
            onClick={() => openAuthModal('login')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#8FA382] hover:bg-[#7D8E74] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <LogIn size={16} />
            <span>Giriş Yap</span>
          </button>

          <button
            onClick={() => openAuthModal('register')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#F7F3EE] hover:bg-[#E9E4DB] text-[#5D554D] border border-[#CCD5AE] font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <UserPlus size={16} />
            <span>Ücretsiz Kayıt Ol</span>
          </button>
        </div>

        <p className="text-[11px] text-[#8C847C] mt-6 flex items-center justify-center gap-1.5">
          <ShieldCheck size={14} className="text-[#8FA382]" />
          <span>Güvenli oturum ile tüm tasarım ve oyun ilerlemeleriniz korunur.</span>
        </p>
      </motion.div>
    </div>
  );
};
