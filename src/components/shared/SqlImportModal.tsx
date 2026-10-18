import React, { useState } from 'react';
import {
  Database,
  Download,
  Copy,
  Check,
  X,
  AlertTriangle,
  CheckCircle2,
  Code,
  Terminal,
  ExternalLink,
} from 'lucide-react';
import { KOPERASI_ELBAYAN_SQL, downloadKoperasiSqlFile } from '../../utils/sqlExporter';

interface SqlImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SqlImportModal: React.FC<SqlImportModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'cara_cepat' | 'preview_sql'>('cara_cepat');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(KOPERASI_ELBAYAN_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    downloadKoperasiSqlFile('koperasi_elbayan.sql');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <Database className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black leading-tight">
                Panduan Mengatasi Error phpMyAdmin #1064
              </h3>
              <p className="text-xs text-blue-100 mt-0.5">
                Solusi impor skema database MySQL / MariaDB Koperasi El-Bayan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-blue-100 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Diagnostic Banner */}
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border-b border-rose-200 dark:border-rose-900/50 flex-shrink-0 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-rose-800 dark:text-rose-200 block">
              Penyebab Error: phpMyAdmin menerima file HTML (<code className="px-1 py-0.5 bg-rose-200/60 dark:bg-rose-900/80 rounded">&lt;!doctype html&gt;</code>), bukan teks SQL!
            </span>
            <span className="text-rose-700 dark:text-rose-300 block mt-0.5">
              Hal ini terjadi jika browser mengunduh halaman web, bukan isi skrip database. Gunakan salah satu dari 2 cara di bawah untuk langsung menyelesaikannya.
            </span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="px-4 sm:px-6 pt-3 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <button
            onClick={() => setActiveTab('cara_cepat')}
            className={`pb-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'cara_cepat'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Cara 1: Copy-Paste ke Tab SQL (Paling Mudah & Rekomendasi)</span>
          </button>
          <button
            onClick={() => setActiveTab('preview_sql')}
            className={`pb-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'preview_sql'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Cara 2: Download File .SQL Murni</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {activeTab === 'cara_cepat' ? (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 rounded-2xl p-4 space-y-3">
                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Langkah Praktis (Hanya Butuh 3 Langkah):</span>
                  <span className="text-[10px] px-2 py-0.5 bg-blue-600 text-white rounded-full font-bold">
                    Anti Gagal
                  </span>
                </div>

                <ol className="space-y-2 text-slate-700 dark:text-slate-300 list-decimal list-inside pl-1 leading-relaxed">
                  <li>
                    Klik tombol <strong>"Salin Seluruh Kode SQL"</strong> di bawah ini.
                  </li>
                  <li>
                    Buka phpMyAdmin Anda di browser (biasanya <code>http://localhost/phpmyadmin</code>), lalu klik menu <strong>[SQL]</strong> di tab bagian atas.
                  </li>
                  <li>
                    Tempelkan / Paste (<kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[11px] font-mono">Ctrl + V</kbd>) ke dalam kotak teks, lalu klik tombol <strong>"Kirim" / "Go"</strong> di pojok kanan bawah.
                  </li>
                </ol>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={handleCopy}
                    className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs shadow-blue-600/30 flex items-center justify-center gap-2 transition-all"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Berhasil Disalin! Silakan Paste di phpMyAdmin' : 'Salin Seluruh Kode SQL'}</span>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  Apa yang akan dibuat otomatis oleh query ini?
                </div>
                <ul className="text-slate-500 dark:text-slate-400 space-y-1 list-disc list-inside">
                  <li>Database <code>koperasi_elbayan</code> (jika belum ada).</li>
                  <li>9 Tabel: <code>users</code>, <code>konsumen</code>, <code>kategori</code>, <code>produk</code>, <code>pesanan</code>, <code>detail_pesanan</code>, <code>transaksi</code>, <code>detail_transaksi</code>, <code>pengaturan_toko</code>.</li>
                  <li>Akun awal: <strong>Admin (Fuad)</strong> dan <strong>Kasir (Sabiq)</strong>.</li>
                  <li>3 View laporan: <code>v_laporan_penjualan_harian</code>, <code>v_produk_terlaris</code>, <code>v_stok_menipis</code>.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="font-bold text-slate-900 dark:text-white">
                  Unduh Berkas .SQL Asli (Via Memory Blob)
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  Tombol di bawah ini membuat file <code>koperasi_elbayan.sql</code> langsung dari memori aplikasi, sehingga <strong>dijamin 100% berkas teks SQL murni</strong> dan tidak akan pernah menjadi berkas HTML.
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs shadow-emerald-600/30 flex items-center gap-2 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download File koperasi_elbayan.sql (Murni)</span>
                  </button>

                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Tersalin!' : 'Salin Teks SQL'}</span>
                  </button>
                </div>
              </div>

              {/* SQL Preview Box */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                  <span>Pratinjau Kode SQL:</span>
                  <span>346 baris query</span>
                </div>
                <pre className="p-3 bg-slate-950 text-slate-200 rounded-xl font-mono text-[11px] h-48 overflow-y-auto leading-relaxed border border-slate-800">
                  {KOPERASI_ELBAYAN_SQL}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="text-[11px] text-slate-500">
            Koperasi El-Bayan &bull; MySQL / MariaDB Compatible
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl transition-all"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
