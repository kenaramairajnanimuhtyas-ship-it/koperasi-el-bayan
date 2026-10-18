import React, { useState, useEffect } from 'react';
import { StoreSettings } from '../../types';
import { generateDefaultQrisDataUrl } from '../../utils/qrisGenerator';
import { QrisModal } from '../shared/QrisModal';
import {
  QrCode,
  Maximize2,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  Smartphone,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface QrisKonsumenCardProps {
  settings: StoreSettings;
  className?: string;
  variant?: 'banner' | 'compact' | 'card';
}

export const QrisKonsumenCard: React.FC<QrisKonsumenCardProps> = ({
  settings,
  className = '',
  variant = 'card',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrisSrc, setQrisSrc] = useState<string>(settings.qrisImageUrl || '');
  const [copiedNmid, setCopiedNmid] = useState(false);

  const merchantName = settings.qrisMerchantName || settings.namaKoperasi || 'KOPERASI EL-BAYAN';
  const nmid = settings.qrisNmid || 'ID1020260210001';

  // Ensure high quality image fallback if not custom-uploaded
  useEffect(() => {
    if (settings.qrisImageUrl) {
      setQrisSrc(settings.qrisImageUrl);
    } else {
      generateDefaultQrisDataUrl({
        merchantName,
        nmid,
      }).then((url) => {
        setQrisSrc(url);
      });
    }
  }, [settings.qrisImageUrl, merchantName, nmid]);

  const handleCopyNmid = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(nmid);
    setCopiedNmid(true);
    setTimeout(() => setCopiedNmid(false), 2000);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!qrisSrc) return;
    const a = document.createElement('a');
    a.href = qrisSrc;
    a.download = `QRIS_${merchantName.replace(/\s+/g, '_')}_ElBayan.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <div
        className={`bg-white dark:bg-slate-900 rounded-2xl border-2 border-red-500/20 dark:border-red-500/30 shadow-md hover:shadow-lg transition-all overflow-hidden ${className}`}
      >
        {/* Top Header Bar with Red QRIS National Standard Style */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white px-3.5 sm:px-5 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white text-red-600 font-black text-[10px] sm:text-xs px-2 py-0.5 rounded tracking-wider shadow-xs">
              QRIS
            </div>
            <span className="font-extrabold text-xs sm:text-sm tracking-tight">
              Pembayaran Digital Koperasi
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold bg-white/15 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>Resmi & Bebas Biaya</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-3.5 sm:p-5 flex flex-col md:flex-row items-center gap-4 sm:gap-6">
          {/* QR Code Frame with Glow & Interaction */}
          <div className="relative group flex-shrink-0 flex flex-col items-center">
            <div
              onClick={() => setIsModalOpen(true)}
              className="w-40 h-40 sm:w-48 sm:h-48 p-2.5 bg-white rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center cursor-pointer transition-transform group-hover:scale-[1.02] relative"
              title="Klik untuk memperbesar QRIS layar penuh"
            >
              {qrisSrc ? (
                <img
                  src={qrisSrc}
                  alt={`QRIS ${merchantName}`}
                  className="w-full h-full object-contain"
                  style={{ imageRendering: 'pixelated' }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 gap-1.5">
                  <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px]">Memuat QRIS...</span>
                </div>
              )}

              {/* Hover overlay hint */}
              <div className="absolute inset-0 bg-slate-900/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1 backdrop-blur-[1px]">
                <Maximize2 className="w-4 h-4" />
                <span>Perbesar</span>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-2 text-[11px] font-bold text-red-600 dark:text-red-400 hover:text-red-700 flex items-center gap-1 transition-colors"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Ketuk untuk Zoom Layar Penuh</span>
            </button>
          </div>

          {/* Details & Action Guide */}
          <div className="flex-1 space-y-3 w-full text-left">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {merchantName}
                </h3>
                <span className="text-[10px] bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300 font-bold px-2 py-0.5 rounded-full border border-red-200 dark:border-red-900/50">
                  GPN Interoperable
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Scan langsung dari ponsel Anda saat berada di depan kasir atau selesaikan pesanan online dengan cepat.
              </p>
            </div>

            {/* NMID & Merchant Info Tag */}
            <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-2.5 border border-slate-200 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-medium">NMID:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {nmid}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyNmid}
                className="px-2 py-1 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-[11px] font-semibold flex items-center gap-1 hover:bg-slate-100 transition-colors"
              >
                {copiedNmid ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedNmid ? 'Tersalin' : 'Salin NMID'}</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex-1 min-w-[140px] px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
              >
                <QrCode className="w-4 h-4" />
                <span>Buka QRIS Layar Penuh</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-all active:scale-95"
                title="Unduh QRIS untuk discan dari galeri ponsel"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Unduh Gambar</span>
              </button>
            </div>

            {/* Supported Banks & E-Wallets Badges */}
            <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
              <div className="text-[10px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <Smartphone className="w-3 h-3 text-emerald-600" />
                <span>Mendukung Semua Aplikasi Pembayaran Indonesia:</span>
              </div>
              <div className="flex flex-wrap gap-1 text-[10px] font-bold">
                {['BSI Mobile', 'BCA', 'BRImo', 'Livin', 'GoPay', 'OVO', 'DANA', 'ShopeePay', 'LinkAja'].map(
                  (app) => (
                    <span
                      key={app}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      {app}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox / Scanner Modal */}
      {isModalOpen && (
        <QrisModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          settings={settings}
          title="QRIS Pembayaran Digital Resmi - Koperasi El-Bayan"
        />
      )}
    </>
  );
};
