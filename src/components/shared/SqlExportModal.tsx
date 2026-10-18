import React, { useState, useEffect } from 'react';
import {
  Database,
  X,
  Copy,
  Check,
  Download,
  AlertTriangle,
  CheckCircle2,
  FileCode,
  Terminal,
} from 'lucide-react';
import { fetchCleanSqlScript, downloadCleanSqlFile } from '../../utils/sqlDownloader';

interface SqlExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SqlExportModal: React.FC<SqlExportModalProps> = ({ isOpen, onClose }) => {
  const [sqlContent, setSqlContent] = useState<string>('Memuat skrip SQL...');
  const [copied, setCopied] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      fetchCleanSqlScript().then((text) => setSqlContent(text));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sqlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    await downloadCleanSqlFile();
    setTimeout(() => setDownloading(false), 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Skrip Database MySQL Koperasi El-Bayan</h2>
              <p className="text-xs text-blue-200">
                Gunakan tab <b>SQL</b> di phpMyAdmin untuk menghindari error <code>#1064 &lt;!doctype html&gt;</code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning & Instructions */}
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/60 flex-shrink-0 space-y-2">
          <div className="flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Kenapa Muncul Error #1064 near '&lt;!doctype html&gt;' di phpMyAdmin?</span>
              <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                Error tersebut terjadi jika file yang di-import adalah <b>halaman web HTML</b> (bukan file database SQL murni). Cara termudah dan paling aman tanpa perlu upload file adalah dengan <b>Copy-Paste skrip SQL</b> di bawah ini langsung ke tab <b>SQL</b> di phpMyAdmin.
              </p>
            </div>
          </div>
        </div>

        {/* Step-by-step Guide */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex-shrink-0">
          <div className="font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-emerald-500" />
            <span>3 Langkah Cepat Eksekusi di phpMyAdmin:</span>
          </div>
          <ol className="list-decimal list-inside text-[11px] space-y-0.5 text-slate-600 dark:text-slate-400">
            <li>Klik tombol <b>"Salin Seluruh Skrip SQL"</b> di bawah.</li>
            <li>Buka <b>phpMyAdmin</b> (<code>http://localhost/phpmyadmin</code>) lalu klik tab <b>SQL</b> di menu atas.</li>
            <li>Tempelkan (Paste / <code>Ctrl + V</code>) ke dalam kotak teks, lalu klik tombol <b>Kirim / Go</b> di kanan bawah.</li>
          </ol>
        </div>

        {/* Action bar */}
        <div className="p-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs shadow-emerald-600/30 transition-all"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Berhasil Disalin ke Clipboard!' : 'Salin Seluruh Skrip SQL'}</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs shadow-blue-600/30 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Mengunduh...' : 'Unduh File .SQL Murni'}</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-400 font-mono">
            koperasi_elbayan.sql (~19 KB)
          </span>
        </div>

        {/* SQL Code Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-950 font-mono text-xs text-emerald-400 leading-relaxed select-all">
          <pre>{sqlContent}</pre>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Mendukung MariaDB 10.3+ / MySQL 5.7+ / MySQL 8.0+</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
