import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Play, RotateCcw, Sparkles, Volume2, Flame, Award, Car, User as UserIcon } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { useAuth } from '../context/AuthContext';

interface GameCar {
  id: number;
  color: string;
  isYellow: boolean;
  name: string;
  speed: number; // seconds to cross
  lane: number; // 0, 1, 2
  clicked: boolean;
}

export const VosvosGame: React.FC = () => {
  const { user, updateUserData } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState(user?.highScore || 0);
  const [cars, setCars] = useState<GameCar[]>([]);
  const [feedback, setFeedback] = useState<{ text: string; positive: boolean } | null>(null);

  const timerRef = useRef<number | null>(null);
  const spawnerRef = useRef<number | null>(null);

  useEffect(() => {
    if (user?.highScore && user.highScore > highScore) {
      setHighScore(user.highScore);
    }
  }, [user?.highScore]);

  const CAR_COLORS = [
    { color: '#f6b828', isYellow: true, name: 'Sarı Vosvos' },
    { color: '#3aa89b', isYellow: false, name: 'Turkuaz Vosvos' },
    { color: '#ba2d32', isYellow: false, name: 'Kırmızı Vosvos' },
    { color: '#6ca8d8', isYellow: false, name: 'Mavi Vosvos' },
    { color: '#f4ede2', isYellow: false, name: 'Krem Vosvos' },
    { color: '#eb6828', isYellow: false, name: 'Turuncu Vosvos' },
  ];

  const startGame = () => {
    audioEngine.playHorn();
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(30);
    setStreak(0);
    setCars([]);
    setFeedback(null);
  };

  // Game timer loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Car spawner
      spawnerRef.current = window.setInterval(() => {
        const randomType = CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)];
        // 35% chance to be yellow for excitement
        const isForceYellow = Math.random() < 0.35;
        const chosen = isForceYellow ? CAR_COLORS[0] : randomType;

        const newCar: GameCar = {
          id: Date.now() + Math.random(),
          color: chosen.color,
          isYellow: chosen.isYellow,
          name: chosen.name,
          speed: 3.5 + Math.random() * 2.5,
          lane: Math.floor(Math.random() * 2),
          clicked: false,
        };

        setCars((prev) => [...prev.slice(-6), newCar]);
      }, 900);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnerRef.current) clearInterval(spawnerRef.current);
    };
  }, [isPlaying]);

  const endGame = () => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (spawnerRef.current) clearInterval(spawnerRef.current);
    const newHigh = Math.max(highScore, score);
    setHighScore(newHigh);
    if (user && newHigh > (user.highScore || 0)) {
      updateUserData({ highScore: newHigh });
    }
  };

  const handleCarClick = (car: GameCar) => {
    if (!isPlaying || car.clicked) return;

    // Mark as clicked
    setCars((prev) => prev.map((c) => (c.id === car.id ? { ...c, clicked: true } : c)));

    if (car.isYellow) {
      // Correct!
      audioEngine.playClick(1400);
      const points = 10 + streak * 2;
      setScore((s) => s + points);
      setStreak((st) => st + 1);
      setFeedback({ text: `+${points} SARI VOSVOS! 💛`, positive: true });
    } else {
      // Wrong!
      audioEngine.playClick(300);
      setScore((s) => Math.max(0, s - 5));
      setStreak(0);
      setFeedback({ text: '-5 O sarı değildi! 😅', positive: false });
    }

    setTimeout(() => setFeedback(null), 800);
  };

  return (
    <div className="w-full bg-[#FDFBF7] rounded-[32px] border border-[#E9E4DB] shadow-sm p-6 sm:p-8 flex flex-col gap-6 text-[#4A443F]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E9E4DB] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#E9EDC9] text-[#5D554D] border border-[#CCD5AE] flex items-center justify-center font-bold">
              💛
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#5D554D] font-serif-vintage">
              Efsane Yol Oyunu: "Sarı Vosvos Gördüm!"
            </h3>
          </div>
          <p className="text-xs text-[#8C847C] mt-1 flex items-center gap-2">
            <span>Yoldan geçen arabalar arasından sadece <strong>Sarı Vosvosları</strong> yakala ve puanları topla!</span>
            {user && (
              <span className="hidden md:inline-flex items-center gap-1 bg-[#E9EDC9] text-[#5D554D] px-2 py-0.5 rounded-full font-bold text-[10px]">
                <UserIcon size={11} /> Sürücü: {user.name || user.email.split('@')[0]}
              </span>
            )}
          </p>
        </div>

        {/* Scoreboard */}
        <div className="flex items-center gap-3">
          <div className="bg-[#E9EDC9] border border-[#CCD5AE] px-3.5 py-1.5 rounded-2xl text-center">
            <span className="text-[10px] uppercase font-bold text-[#5D554D] block">Puan</span>
            <span className="text-xl font-extrabold text-[#4A443F] font-mono">{score}</span>
          </div>

          <div className="bg-[#F7F3EE] border border-[#E9E4DB] px-3.5 py-1.5 rounded-2xl text-center">
            <span className="text-[10px] uppercase font-bold text-[#8C847C] block">Süre</span>
            <span className="text-xl font-extrabold text-[#5D554D] font-mono">{timeLeft}s</span>
          </div>

          <div className="bg-[#F7F3EE] border border-[#E9E4DB] px-3.5 py-1.5 rounded-2xl text-center">
            <span className="text-[10px] uppercase font-bold text-[#8C847C] block">En Yüksek</span>
            <span className="text-xl font-extrabold text-[#5D554D] font-mono">{highScore}</span>
          </div>
        </div>
      </div>

      {/* Game Stage Arena */}
      <div className="relative w-full h-64 sm:h-72 rounded-[28px] bg-gradient-to-b from-[#E9EDC9]/60 via-[#F7F3EE] to-[#D6D1C7] overflow-hidden border border-[#E9E4DB] shadow-inner flex flex-col justify-end">
        {/* Sky, Sun & Clouds */}
        <div className="absolute top-4 left-8 w-12 h-12 rounded-full bg-[#E9EDC9] blur-xs opacity-80" />
        <div className="absolute top-6 right-24 text-2xl opacity-60">☁️</div>
        <div className="absolute top-10 left-36 text-xl opacity-50">☁️</div>

        {/* Rolling Green Hills in background */}
        <div className="absolute bottom-28 left-0 right-0 h-16 bg-[#8FA382]/30 rounded-t-[100%]" />
        <div className="absolute bottom-24 -left-12 -right-12 h-16 bg-[#8FA382]/20 rounded-t-[80%]" />

        {/* Highway Asphalt Road */}
        <div className="relative w-full h-28 bg-[#3E3834] border-t-4 border-[#5D554D] flex flex-col justify-around py-1">
          {/* Road Center Dashed Line */}
          <div className="w-full h-0 border-t-2 border-dashed border-[#E9EDC9] opacity-70" />

          {/* Active Passing Cars */}
          {isPlaying &&
            cars.map((car) => {
              if (car.clicked && car.isYellow) return null;
              return (
                <motion.div
                  key={car.id}
                  initial={{ x: 800 }}
                  animate={{ x: -200 }}
                  transition={{ duration: car.speed, ease: 'linear' }}
                  onClick={() => handleCarClick(car)}
                  className="absolute cursor-pointer select-none group"
                  style={{
                    bottom: car.lane === 0 ? '12px' : '60px',
                    zIndex: car.lane === 0 ? 20 : 10,
                  }}
                >
                  {/* Mini Vosvos Car */}
                  <div
                    className="relative px-3 py-1.5 rounded-full border-2 border-stone-900 shadow-md flex items-center gap-1.5 transition-transform active:scale-95 group-hover:scale-105"
                    style={{ backgroundColor: car.color }}
                  >
                    <span className="text-base font-bold">🚗</span>
                    <span className="text-[10px] font-bold text-stone-900 bg-white/80 px-1 rounded-sm">
                      {car.name.split(' ')[0]}
                    </span>
                  </div>
                </motion.div>
              );
            })}
        </div>

        {/* Floating Feedback message */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1.1, y: -20 }}
              exit={{ opacity: 0 }}
              className={`absolute top-12 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-sm font-bold shadow-lg border z-40 ${
                feedback.positive
                  ? 'bg-[#8FA382] text-white border-[#7D8E74]'
                  : 'bg-[#A67B5B] text-white border-[#8d6447]'
              }`}
            >
              {feedback.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Start / Game Over Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-[#2D2825]/85 backdrop-blur-xs flex flex-col items-center justify-center text-center p-4 z-30 text-[#FDFBF7]">
            <span className="text-4xl mb-2">🚗💛</span>
            <h4 className="text-2xl font-bold font-serif-vintage text-[#FDFBF7]">
              {score > 0 ? `Tebrikler! Toplam: ${score} Puan` : 'Sarı Vosvos Avı Başlasın!'}
            </h4>
            <p className="text-xs text-[#D6D1C7] max-w-sm mt-1 mb-4">
              Yoldan sadece sarı renkli Vosvoslar geçerken üzerlerine tıkla, seriyi bozma!
            </p>
            <button
              onClick={startGame}
              className="px-6 py-3 rounded-2xl bg-[#8FA382] hover:bg-[#7D8E74] text-white font-extrabold text-sm flex items-center gap-2 shadow-lg active:scale-95 transition-all border border-[#CCD5AE]"
            >
              <Play className="w-4 h-4 fill-white text-white" />
              <span>{score > 0 ? 'Yeniden Oyna' : 'Oyunu Başlat'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
