import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  Sparkles,
  Waves,
  Flower2,
  Trophy,
  Gauge,
  Music,
  Sun,
  Flame,
  Volume2,
  Briefcase,
  Smile,
  ShieldCheck,
  Heart,
  Compass,
  Zap,
  Award,
  ArrowRight,
  RotateCcw,
  CheckCircle,
} from 'lucide-react';
import { QUIZ_QUESTIONS, QUIZ_RESULTS, PRESET_VOSVOS_LIST } from '../data/vosvosData';
import { QuizResult, PresetVosvos } from '../types';
import { audioEngine } from '../utils/audioEngine';

interface VosvosQuizProps {
  onApplyPreset: (preset: PresetVosvos) => void;
}

export const VosvosQuiz: React.FC<VosvosQuizProps> = ({ onApplyPreset }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);

  const getOptionIcon = (iconName: string) => {
    switch (iconName) {
      case 'Waves':
        return <Waves className="w-5 h-5 text-sky-600" />;
      case 'Flower2':
        return <Flower2 className="w-5 h-5 text-rose-500" />;
      case 'Gauge':
        return <Gauge className="w-5 h-5 text-amber-600" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'Music':
        return <Music className="w-5 h-5 text-purple-600" />;
      case 'Sun':
        return <Sun className="w-5 h-5 text-amber-500" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-orange-600" />;
      case 'Volume2':
        return <Volume2 className="w-5 h-5 text-stone-700" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-amber-800" />;
      case 'Smile':
        return <Smile className="w-5 h-5 text-emerald-600" />;
      case 'Trophy':
        return <Trophy className="w-5 h-5 text-amber-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-indigo-600" />;
      case 'Heart':
        return <Heart className="w-5 h-5 text-rose-500" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-teal-600" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-amber-500" />;
      case 'Award':
        return <Award className="w-5 h-5 text-blue-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-500" />;
    }
  };

  const handleSelectOption = (archetype: string) => {
    audioEngine.playClick(1000 + currentStep * 80);
    const newAnswers = [...answers, archetype];
    setAnswers(newAnswers);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate winner archetype
      const counts: Record<string, number> = {};
      newAnswers.forEach((a) => {
        counts[a] = (counts[a] || 0) + 1;
      });

      let winner = 'purist';
      let maxCount = 0;
      Object.keys(counts).forEach((key) => {
        if (counts[key] > maxCount) {
          maxCount = counts[key];
          winner = key;
        }
      });

      const finalResult = QUIZ_RESULTS[winner] || QUIZ_RESULTS.purist;
      setResult(finalResult);

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f6b828', '#3aa89b', '#6ca8d8', '#e74c3c'],
        });
      } catch {
        // safe
      }
    }
  };

  const handleReset = () => {
    audioEngine.playClick(600);
    setCurrentStep(0);
    setAnswers([]);
    setResult(null);
  };

  const handleApplyToStudio = () => {
    if (!result) return;
    const targetPreset = PRESET_VOSVOS_LIST.find((p) => p.id === result.suggestedPreset) || PRESET_VOSVOS_LIST[0];
    onApplyPreset(targetPreset);
    audioEngine.playHorn();

    // Scroll smoothly to studio top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-[#FDFBF7] rounded-[32px] border border-[#E9E4DB] shadow-sm p-6 sm:p-9 text-[#4A443F]">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E9EDC9] border border-[#CCD5AE] text-[#5D554D] text-xs font-bold uppercase tracking-wider mb-2">
          <HelpCircle className="w-3.5 h-3.5 text-[#8FA382]" />
          <span>Kişilik & Ruh Eşi Testi</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#5D554D] font-serif-vintage">
          Hangi Vosvos Modeli Senin Ruhunu Yansıtıyor?
        </h3>
        <p className="text-xs sm:text-sm text-[#8C847C] mt-1">
          4 nostaljik soruyla senin için en mükemmel Vosvos karakterini ve rengini keşfet.
        </p>
      </div>

      {!result ? (
        <div className="max-w-2xl mx-auto">
          {/* Progress indicators */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-[#5D554D]">
              Soru {currentStep + 1} / {QUIZ_QUESTIONS.length}
            </span>
            <div className="flex gap-1.5">
              {QUIZ_QUESTIONS.map((_, i) => (
                <span
                  key={i}
                  className={`w-7 h-2 rounded-full transition-all ${
                    i <= currentStep ? 'bg-[#8FA382]' : 'bg-[#E9E4DB]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Question Card with AnimatePresence */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              <div className="bg-[#F7F3EE] p-5 rounded-[24px] border border-[#E9E4DB]">
                <h4 className="text-lg sm:text-xl font-bold text-[#5D554D] font-serif-vintage">
                  {QUIZ_QUESTIONS[currentStep].question}
                </h4>
                <p className="text-xs text-[#8C847C] mt-0.5">
                  {QUIZ_QUESTIONS[currentStep].subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {QUIZ_QUESTIONS[currentStep].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(opt.archetype)}
                    className="p-4 rounded-2xl border border-[#E9E4DB] hover:border-[#8FA382] bg-[#FDFBF7] hover:bg-[#E9EDC9]/30 text-left transition-all flex items-start gap-3 group active:scale-98 shadow-2xs"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#F7F3EE] border border-[#E9E4DB] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      {getOptionIcon(opt.icon)}
                    </div>
                    <span className="text-sm font-semibold text-[#5D554D] leading-snug group-hover:text-[#4A443F] mt-1">
                      {opt.text}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        /* Result Screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto flex flex-col items-center text-center p-6 sm:p-8 rounded-[32px] bg-gradient-to-b from-[#F7F3EE] to-[#FDFBF7] border-2 border-[#8FA382] shadow-lg"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md mb-4 text-white"
            style={{ backgroundColor: result.suggestedColor }}
          >
            <Trophy className="w-8 h-8 text-white" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-[#5D554D] bg-[#E9EDC9] border border-[#CCD5AE] px-3.5 py-1 rounded-full mb-2">
            Senin Ruh Eşin Bulundu!
          </span>

          <h4 className="text-2xl sm:text-3xl font-extrabold text-[#5D554D] font-serif-vintage">
            {result.title}
          </h4>

          <span className="text-sm font-bold text-[#A67B5B] mt-1">
            "{result.tagline}"
          </span>

          <p className="text-sm text-[#5D554D] leading-relaxed max-w-lg mt-3 bg-[#FDFBF7] p-4 rounded-2xl border border-[#E9E4DB] shadow-2xs">
            {result.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 w-full max-w-md">
            <button
              onClick={handleApplyToStudio}
              className="flex-1 w-full py-3.5 px-5 rounded-2xl bg-[#8FA382] hover:bg-[#7D8E74] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-[#E9EDC9]" />
              <span>Bu Vosvosu Atölyede Canlandır</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleReset}
              className="py-3.5 px-4 rounded-2xl bg-[#F7F3EE] hover:bg-[#E9E4DB] text-[#5D554D] font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-[#E9E4DB]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Testi Tekrar Çöz</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
