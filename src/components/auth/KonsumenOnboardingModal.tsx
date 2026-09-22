import React, { useState } from 'react';
import { Konsumen } from '../../types';
import { User, Phone, ArrowRight, ShieldCheck, X, Sparkles } from 'lucide-react';

interface KonsumenOnboardingModalProps {
  currentKonsumen: Konsumen | null;
  onSave: (konsumen: Konsumen) => void;
  onClose: () => void;
}

export const KonsumenOnboardingModal: React.FC<KonsumenOnboardingModalProps> = ({
  currentKonsumen,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(currentKonsumen?.name || '');
  const [phone, setPhone] = useState(currentKonsumen?.no_hp || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nama lengkap konsumen wajib diisi.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setError('Nomor HP/WhatsApp valid wajib diisi (minimal 8 digit).');
      return;
    }

    const updated: Konsumen = {
      id: currentKonsumen?.id || Date.now(),
      name: name.trim(),
      no_hp: phone.trim(),
      created_at: currentKonsumen?.created_at || new Date().toISOString(),
    };

    onSave(updated);
  };

  const handleFillDemo = (demoName: string, demoPhone: string) => {
    setName(demoName);
    setPhone(demoPhone);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-emerald-600 to-teal-800 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full text-emerald-100 hover:text-white hover:bg-emerald-500/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-3 border border-white/20">
            <User className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold">Identitas Konsumen</h2>
          <p className="text-xs text-emerald-100 mt-1">
            Masukkan nama & nomor HP untuk mulai memilih produk katalog dan memantau status pesanan di Koperasi El-Bayan.
          </p>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Nama Lengkap Konsumen / Santri *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder="Contoh: Muhammad Ilham"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Nomor WhatsApp / HP Aktif *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setError('');
                }}
                placeholder="Contoh: 081234567890"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                required
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Nomor ini digunakan kasir untuk memverifikasi pesanan Anda.
            </p>
          </div>

          {/* Quick Demo Fill Buttons */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
              Pilihan Cepat Akun Konsumen Demo:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo('Muhammad Ilham', '081234567890')}
                className="text-left p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-all text-xs"
              >
                <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">Muhammad Ilham</div>
                <div className="text-[10px] text-slate-500">081234567890</div>
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('Fatimah Az-Zahra', '085712345678')}
                className="text-left p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-all text-xs"
              >
                <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">Fatimah Az-Zahra</div>
                <div className="text-[10px] text-slate-500">085712345678</div>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-3 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
          >
            <span>Mulai Masuk Katalog Produk</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
