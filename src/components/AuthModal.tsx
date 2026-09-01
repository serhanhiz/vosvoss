import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Eye, EyeOff, AlertCircle, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalMode, closeAuthModal, openAuthModal, login, register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (authModalMode === 'register') {
      if (!name.trim()) {
        setError('Lütfen adınızı girin.');
        setIsSubmitting(false);
        return;
      }
      if (password.length < 6) {
        setError('Şifre en az 6 karakter olmalıdır.');
        setIsSubmitting(false);
        return;
      }
      const res = await register(name, email, password);
      if (!res.success) {
        setError(res.error || 'Kayıt başarısız oldu.');
      }
    } else {
      const res = await login(email, password);
      if (!res.success) {
        setError(res.error || 'Giriş yapılamadı.');
      }
    }
    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-[#FDFBF7] border border-[#E9E4DB] rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header Banner */}
          <div className="px-6 py-5 bg-[#8FA382] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">
                🚗
              </div>
              <div>
                <h3 className="font-bold text-base font-serif-vintage tracking-wide">
                  {authModalMode === 'login' ? 'Vosvos Kulübü Girişi' : 'Vosvos Ailesine Katıl'}
                </h3>
                <p className="text-xs text-white/80">
                  {authModalMode === 'login' ? 'Tasarım ve puanlarınıza erişin' : 'Kişiselleştirilmiş Vosvos deneyimi'}
                </p>
              </div>
            </div>
            <button
              onClick={closeAuthModal}
              className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex border-b border-[#E9E4DB] bg-[#F5F2EB]">
            <button
              type="button"
              onClick={() => {
                setError(null);
                openAuthModal('login');
              }}
              className={`flex-1 py-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authModalMode === 'login'
                  ? 'bg-[#FDFBF7] text-[#5D554D] border-b-2 border-[#8FA382]'
                  : 'text-[#8C847C] hover:text-[#5D554D]'
              }`}
            >
              <LogIn size={14} />
              Giriş Yap
            </button>
            <button
              type="button"
              onClick={() => {
                setError(null);
                openAuthModal('register');
              }}
              className={`flex-1 py-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authModalMode === 'register'
                  ? 'bg-[#FDFBF7] text-[#5D554D] border-b-2 border-[#8FA382]'
                  : 'text-[#8C847C] hover:text-[#5D554D]'
              }`}
            >
              <UserPlus size={14} />
              Kayıt Ol
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 text-xs rounded-xl bg-red-50 text-red-700 border border-red-200 flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {authModalMode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-[#5D554D] mb-1.5">
                  Adınız & Soyadınız
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C847C]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ahmet Yılmaz"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E9E4DB] rounded-xl text-sm text-[#4A443F] placeholder-[#B5AEA5] focus:outline-none focus:ring-2 focus:ring-[#8FA382] focus:border-transparent"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#5D554D] mb-1.5">
                E-posta Adresi
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C847C]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@vosvos.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E9E4DB] rounded-xl text-sm text-[#4A443F] placeholder-[#B5AEA5] focus:outline-none focus:ring-2 focus:ring-[#8FA382] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5D554D] mb-1.5">
                Şifre {authModalMode === 'register' && <span className="text-[#8C847C] font-normal">(en az 6 karakter)</span>}
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C847C]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#E9E4DB] rounded-xl text-sm text-[#4A443F] placeholder-[#B5AEA5] focus:outline-none focus:ring-2 focus:ring-[#8FA382] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C847C] hover:text-[#5D554D] cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 bg-[#8FA382] hover:bg-[#7D8E74] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : authModalMode === 'login' ? (
                <>
                  <LogIn size={16} />
                  Giriş Yap
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  Hesap Oluştur
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="p-4 bg-[#F5F2EB] border-t border-[#E9E4DB] text-center text-[11px] text-[#8C847C]">
            🔒 Şifreler PostgreSQL veritabanında Bcrypt ile güvenle korunmaktadır.
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
