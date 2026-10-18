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
  Database,
  Download,
  Copy,
  Code,
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

      {/* MySQL Database Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-blue-200 dark:border-blue-900/40 p-3.5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Database MySQL Koperasi El-Bayan
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Skema tabel relasional lengkap (InnoDB, Foreign Key, Views & Seed Data) untuk phpMyAdmin / MySQL Workbench.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/koperasi_elbayan.sql"
              download="koperasi_elbayan.sql"
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs shadow-blue-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download File .SQL</span>
            </a>
          </div>
        </div>

        {/* Tabel Ringkasan Skema */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>users</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">Admin & Kasir</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Autentikasi role, username, password_hash</p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>produk & kategori</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">Katalog</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Stok, harga, relasi foreign key kategori</p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>pesanan & detail</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">Order Online</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Nomor pesanan, santri/konsumen, item beli</p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>transaksi & detail</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">Kasir POS</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Struk POS, kasir, tunai/transfer/QRIS, kembalian</p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>pengaturan_toko</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">Konfigurasi</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Nama profil koperasi, alamat, footer nota</p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>3 SQL Views</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300">Laporan</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Omset harian, produk terlaris, stok menipis</p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30 text-[11px] text-blue-900 dark:text-blue-300 flex items-start gap-2">
          <Code className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
          <div>
            <p className="font-semibold">Cara Import ke phpMyAdmin / XAMPP / Laragon:</p>
            <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
              1. Buka <strong>phpMyAdmin</strong> (<code className="px-1 py-0.5 bg-blue-100/60 dark:bg-blue-900/60 rounded">http://localhost/phpmyadmin</code>) &rarr; klik tab <strong>Import</strong> &rarr; pilih file <strong>koperasi_elbayan.sql</strong> yang telah didownload &rarr; klik <strong>Go / Kirim</strong>. Database <code className="px-1 py-0.5 bg-blue-100/60 dark:bg-blue-900/60 rounded">koperasi_elbayan</code> akan langsung terbuat secara otomatis.
            </p>
          </div>
        </div>
      </div>

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
