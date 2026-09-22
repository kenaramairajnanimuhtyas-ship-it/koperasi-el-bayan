import React, { useState } from 'react';
import { StoreSettings } from '../../types';
import {
  Settings,
  Store,
  MapPin,
  Phone,
  FileText,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface AdminPengaturanViewProps {
  settings: StoreSettings;
  onSaveSettings: (settings: StoreSettings) => void;
  onResetDemoData: () => void;
}

export const AdminPengaturanView: React.FC<AdminPengaturanViewProps> = ({
  settings,
  onSaveSettings,
  onResetDemoData,
}) => {
  const [formData, setFormData] = useState<StoreSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    if (
      confirm(
        'Apakah Anda yakin ingin mereset seluruh database ke data demo awal? Semua produk baru dan transaksi akan dikembalikan ke kondisi default.'
      )
    ) {
      onResetDemoData();
      alert('Data sistem koperasi berhasil direset ke kondisi awal!');
    }
  };

  return (
    <div className="space-y-3 sm:space-y-6 pb-4 sm:pb-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
          Pengaturan Sistem Koperasi El-Bayan
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">
          Sesuaikan profil identitas koperasi, format struk cetak, serta opsi pemulihan data untuk keperluan pengujian skripsi.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 sm:p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Pengaturan koperasi berhasil disimpan!</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-6 shadow-xs space-y-3 sm:space-y-4 text-xs"
      >
        <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white pb-2.5 sm:pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <Store className="w-4 h-4 text-emerald-600" />
          <span>Profil Identitas Koperasi & Header Struk</span>
        </h3>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Nama Resmi Koperasi *
          </label>
          <input
            type="text"
            value={formData.namaKoperasi}
            onChange={(e) => setFormData({ ...formData, namaKoperasi: e.target.value })}
            className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Alamat Koperasi *
          </label>
          <input
            type="text"
            value={formData.alamat}
            onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
            className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Nomor Telepon / WhatsApp Koperasi *
          </label>
          <input
            type="text"
            value={formData.noHp}
            onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
            className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Catatan Kaki Struk Pembelian (Footer Nota) *
          </label>
          <input
            type="text"
            value={formData.strukFooter}
            onChange={(e) => setFormData({ ...formData, strukFooter: e.target.value })}
            className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div className="pt-2 sm:pt-3 flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan Pengaturan</span>
          </button>
        </div>
      </form>

      {/* Danger Zone: Reset Data */}
      <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-rose-200 dark:border-rose-900/40 p-3.5 sm:p-6 shadow-xs space-y-2.5 sm:space-y-3">
        <div className="flex items-center gap-2 text-rose-600">
          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
          <h3 className="text-xs sm:text-sm font-bold">Zona Pengujian & Reset Database</h3>
        </div>
        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
          Gunakan tombol di bawah ini jika ingin mengulang pengujian 21 langkah dari awal dengan data produk dan transaksi bawaan yang bersih.
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="w-full sm:w-auto px-3.5 sm:px-4 py-2 sm:py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Seluruh Data ke Default Skripsi</span>
        </button>
      </div>
    </div>
  );
};
