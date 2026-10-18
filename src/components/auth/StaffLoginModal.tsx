import React, { useState } from 'react';
import { User } from '../../types';
import { Shield, Store, UserCheck, X, ArrowRight, Lock, CheckCircle, ArrowLeft, Sparkles } from 'lucide-react';

interface StaffLoginModalProps {
  initialRole?: 'admin' | 'kasir';
  onLoginSuccess: (user: User) => void;
  onClose: () => void;
  users: User[];
  onOpenTestingGuide?: () => void;
}

export const StaffLoginModal: React.FC<StaffLoginModalProps> = ({
  initialRole = 'admin',
  onLoginSuccess,
  onClose,
  users,
  onOpenTestingGuide,
}) => {
  const [targetRole, setTargetRole] = useState<'admin' | 'kasir'>(initialRole);
  const [username, setUsername] = useState(initialRole === 'admin' ? 'admin' : 'kasir');
  const [password, setPassword] = useState(initialRole === 'admin' ? 'admin123' : 'kasir123');
  const [error, setError] = useState('');

  const handleRoleChange = (role: 'admin' | 'kasir') => {
    setTargetRole(role);
    if (role === 'admin') {
      setUsername('admin');
      setPassword('admin123');
    } else {
      setUsername('kasir');
      setPassword('kasir123');
    }
    setError('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = users.find(
      (u) =>
        u.username.toLowerCase() === username.trim().toLowerCase() &&
        u.password_hash === password.trim()
    );

    if (!found) {
      setError('Username atau password salah. Silakan periksa kembali!');
      return;
    }

    if (found.role !== targetRole) {
      setError(`Akun ini memiliki role "${found.role}", bukan "${targetRole}". Silakan pilih tab role yang sesuai.`);
      return;
    }

    onLoginSuccess(found);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white relative border-b border-slate-700/50">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-xl bg-emerald-600/30 flex items-center justify-center mb-3 border border-emerald-500/40 text-emerald-400">
            {targetRole === 'admin' ? <Shield className="w-6 h-6" /> : <Store className="w-6 h-6" />}
          </div>
          <h2 className="text-xl font-bold">
            Login Petugas {targetRole === 'admin' ? 'Administrator' : 'Kasir / POS'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Pilih peran petugas di bawah ini untuk mengakses sistem kasir atau administrasi koperasi.
          </p>
        </div>

        {/* Tab Role Switch */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
            Pilih Peran Petugas (Role):
          </div>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-200/70 dark:bg-slate-900 rounded-xl">
            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                targetRole === 'admin'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin Koperasi</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('kasir')}
              className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                targetRole === 'kasir'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Petugas Kasir</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Username *
            </label>
            <div className="relative">
              <UserCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Quick Demo Info Pill */}
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs">
            <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Akun Demo Terverifikasi:</span>
            </div>
            <div className="mt-1 text-slate-600 dark:text-slate-300 space-y-0.5 font-mono text-[11px]">
              <div>
                {targetRole === 'admin' ? (
                  <>Nama: <b className="text-emerald-700 dark:text-emerald-400 font-sans">Fuad</b> | User: <b className="text-emerald-700 dark:text-emerald-400">admin</b> | Pass: <b className="text-emerald-700 dark:text-emerald-400">admin123</b></>
                ) : (
                  <>Nama: <b className="text-emerald-700 dark:text-emerald-400 font-sans">Sabiq</b> | User: <b className="text-emerald-700 dark:text-emerald-400">kasir</b> | Pass: <b className="text-emerald-700 dark:text-emerald-400">kasir123</b></>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <span>Masuk ke Panel {targetRole === 'admin' ? 'Admin Koperasi' : 'Kasir POS'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Katalog Konsumen</span>
            </button>

            {onOpenTestingGuide && (
              <button
                type="button"
                onClick={onOpenTestingGuide}
                className="mt-1 text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Buka Panduan Uji Skripsi (21 Skenario)</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
