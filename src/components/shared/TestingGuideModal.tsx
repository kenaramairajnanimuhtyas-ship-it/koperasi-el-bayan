import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  X,
  ExternalLink,
  Sparkles,
  BookOpen,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { AppRole, AdminTab, KasirTab, KonsumenTab } from '../../types';

interface TestingGuideModalProps {
  onClose: () => void;
  onNavigateRole: (role: AppRole, subTab?: string) => void;
}

interface StepItem {
  id: number;
  title: string;
  role: AppRole;
  subTab?: string;
  desc: string;
}

const steps: StepItem[] = [
  { id: 1, title: 'Admin login', role: 'admin', subTab: 'dashboard', desc: 'Login menggunakan username "admin" dan password "admin123".' },
  { id: 2, title: 'Admin membuat kategori', role: 'admin', subTab: 'kategori', desc: 'Buka menu Kategori, tambah kategori baru (contoh: "Kitab Pesantren").' },
  { id: 3, title: 'Admin membuat produk dengan stok 20', role: 'admin', subTab: 'produk', desc: 'Tambah produk baru dengan nama unik, pilih kategori, isi harga dan set stok tepat 20.' },
  { id: 4, title: 'Produk otomatis muncul di katalog', role: 'konsumen', subTab: 'katalog', desc: 'Beralih ke Katalog Konsumen, periksa bahwa produk baru tampil secara realtime.' },
  { id: 5, title: 'Konsumen masuk menggunakan nama dan nomor HP', role: 'konsumen', subTab: 'katalog', desc: 'Masukkan identitas konsumen santri (nama dan nomor WhatsApp).' },
  { id: 6, title: 'Konsumen melihat produk', role: 'konsumen', subTab: 'katalog', desc: 'Gunakan fitur pencarian atau filter kategori untuk menemukan produk.' },
  { id: 7, title: 'Konsumen membuka detail produk', role: 'konsumen', subTab: 'katalog', desc: 'Klik card produk untuk membuka modal detail produk lengkap.' },
  { id: 8, title: 'Konsumen membeli 2 produk', role: 'konsumen', subTab: 'katalog', desc: 'Pilih jumlah 2 pcs dan klik tombol "Tambah ke Keranjang".' },
  { id: 9, title: 'Konsumen checkout', role: 'konsumen', subTab: 'katalog', desc: 'Buka keranjang belanja, periksa subtotal, lalu klik "Lanjut ke Checkout".' },
  { id: 10, title: 'Pesanan masuk ke sistem', role: 'konsumen', subTab: 'pesanan_saya', desc: 'Konfirmasi pesanan. Nomor pesanan unik otomatis terbit dengan status "MENUNGGU".' },
  { id: 11, title: 'Kasir login', role: 'kasir', subTab: 'dashboard', desc: 'Login sebagai Kasir menggunakan username "kasir" dan password "kasir123".' },
  { id: 12, title: 'Kasir melihat pesanan baru', role: 'kasir', subTab: 'pesanan_masuk', desc: 'Buka menu "Pesanan Masuk", pesanan konsumen tadi muncul dalam antrean.' },
  { id: 13, title: 'Kasir membuka detail pesanan', role: 'kasir', subTab: 'pesanan_masuk', desc: 'Klik detail pesanan untuk memverifikasi item belanja dan identitas pemesan.' },
  { id: 14, title: 'Kasir memproses pesanan', role: 'kasir', subTab: 'pesanan_masuk', desc: 'Ubah status menjadi "DIPROSES" atau klik "Proses di POS Kasir".' },
  { id: 15, title: 'Kasir melakukan pembayaran', role: 'kasir', subTab: 'pos', desc: 'Input nominal pembayaran tunai/transfer, periksa kalkulasi kembalian otomatis.' },
  { id: 16, title: 'Transaksi berhasil', role: 'kasir', subTab: 'pos', desc: 'Selesaikan transaksi, sistem menerbitkan nomor struk TRX resmi Koperasi El-Bayan.' },
  { id: 17, title: 'Status pesanan menjadi selesai', role: 'kasir', subTab: 'pesanan_masuk', desc: 'Status pesanan pada sistem kasir otomatis ter-update menjadi "SELESAI".' },
  { id: 18, title: 'Stok berkurang dari 20 menjadi 18', role: 'admin', subTab: 'produk', desc: 'Periksa daftar stok produk; stok produk berkurang tepat 2 unit secara konsisten.' },
  { id: 19, title: 'Konsumen melihat status pesanan terbaru', role: 'konsumen', subTab: 'pesanan_saya', desc: 'Buka menu Pesanan Saya di sisi konsumen, status telah berubah menjadi "SELESAI".' },
  { id: 20, title: 'Transaksi masuk ke laporan admin', role: 'admin', subTab: 'laporan', desc: 'Buka menu Laporan Penjualan di panel Admin; transaksi tercatat rapi.' },
  { id: 21, title: 'Dashboard admin memperbarui statistik', role: 'admin', subTab: 'dashboard', desc: 'Grafik penjualan dan card total pendapatan ter-update secara otomatis.' },
];

export const TestingGuideModal: React.FC<TestingGuideModalProps> = ({
  onClose,
  onNavigateRole,
}) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('elbayan_completed_steps');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleStep = (id: number) => {
    setCompletedSteps((prev) => {
      const next = prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id];
      localStorage.setItem('elbayan_completed_steps', JSON.stringify(next));
      return next;
    });
  };

  const handleResetProgress = () => {
    setCompletedSteps([]);
    localStorage.removeItem('elbayan_completed_steps');
  };

  const progressPercent = Math.round((completedSteps.length / steps.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-900 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Panduan Pengujian Alur Skripsi (21 Langkah)</h2>
              <p className="text-xs text-emerald-100">
                Verifikasi integrasi penuh: Katalog → Pesanan → Kasir/POS → Stok → Laporan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-slate-700 dark:text-slate-300">
              Progress Verifikasi: {completedSteps.length} dari {steps.length} Langkah
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Step List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 divide-y divide-slate-100 dark:divide-slate-800/60">
          {steps.map((st) => {
            const isDone = completedSteps.includes(st.id);

            const roleBadges: Record<AppRole, { label: string; color: string }> = {
              admin: { label: 'Admin', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' },
              kasir: { label: 'Kasir', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
              konsumen: { label: 'Konsumen', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
            };

            return (
              <div
                key={st.id}
                className={`pt-2.5 flex items-start justify-between gap-3 group transition-colors rounded-xl p-2 ${
                  isDone ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleStep(st.id)}
                    className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                    )}
                  </button>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {st.id}. {st.title}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${roleBadges[st.role].color}`}>
                        {roleBadges[st.role].label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{st.desc}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onNavigateRole(st.role, st.subTab);
                    onClose();
                  }}
                  className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition-all"
                  title={`Buka tampilan ${st.role}`}
                >
                  <span>Buka</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
          <button
            onClick={handleResetProgress}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Progress Checklist</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
