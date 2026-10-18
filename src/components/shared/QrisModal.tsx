import React, { useState, useEffect } from 'react';
import { StoreSettings } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { generateDefaultQrisDataUrl } from '../../utils/qrisGenerator';
import {
  X,
  Download,
  Printer,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ShieldCheck,
  Smartphone,
  Info,
} from 'lucide-react';

interface QrisModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StoreSettings;
  nominal?: number;
  orderNumber?: string;
  customerName?: string;
  title?: string;
}

export const QrisModal: React.FC<QrisModalProps> = ({
  isOpen,
  onClose,
  settings,
  nominal,
  orderNumber,
  customerName,
  title = 'Pembayaran Digital QRIS Koperasi El-Bayan',
}) => {
  const [displayQrUrl, setDisplayQrUrl] = useState<string>(settings.qrisImageUrl || '');
  const [copiedNominal, setCopiedNominal] = useState(false);
  const [copiedNmid, setCopiedNmid] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isGeneratingDefault, setIsGeneratingDefault] = useState(false);

  const merchantName = settings.qrisMerchantName || settings.namaKoperasi || 'KOPERASI EL-BAYAN';
  const nmid = settings.qrisNmid || 'ID1020260210001';

  // If no image uploaded yet, generate official high-res QRIS on the fly
  useEffect(() => {
    if (settings.qrisImageUrl) {
      setDisplayQrUrl(settings.qrisImageUrl);
    } else {
      setIsGeneratingDefault(true);
      generateDefaultQrisDataUrl({
        merchantName,
        nmid,
        nominal,
      }).then((url) => {
        setDisplayQrUrl(url);
        setIsGeneratingDefault(false);
      });
    }
  }, [settings.qrisImageUrl, merchantName, nmid, nominal]);

  if (!isOpen) return null;

  const handleCopyNominal = () => {
    if (nominal) {
      navigator.clipboard.writeText(String(nominal));
      setCopiedNominal(true);
      setTimeout(() => setCopiedNominal(false), 2000);
    }
  };

  const handleCopyNmid = () => {
    navigator.clipboard.writeText(nmid);
    setCopiedNmid(true);
    setTimeout(() => setCopiedNmid(false), 2000);
  };

  const handleDownload = () => {
    if (!displayQrUrl) return;
    const a = document.createElement('a');
    a.href = displayQrUrl;
    a.download = `QRIS-${merchantName.replace(/\s+/g, '-')}-${nominal ? `Rp${nominal}` : 'Resmi'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Standee QRIS - ${merchantName}</title>
          <style>
            @page { size: A5 portrait; margin: 10mm; }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; text-align: center; margin: 0; padding: 20px; background: #fff; color: #111; }
            .card { max-width: 480px; margin: 0 auto; border: 3px solid #111; border-radius: 16px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            .header { background: #C5221F; color: white; padding: 12px; border-radius: 8px; margin-bottom: 16px; }
            .header h1 { margin: 0; font-size: 32px; font-weight: 900; letter-spacing: 2px; }
            .header p { margin: 4px 0 0 0; font-size: 11px; font-weight: 700; letter-spacing: 1px; }
            .merchant { font-size: 20px; font-weight: 800; margin: 12px 0 4px 0; }
            .nmid { font-size: 14px; color: #4b5563; font-family: monospace; font-weight: 700; margin-bottom: 16px; }
            .qr-img { width: 100%; max-width: 340px; height: auto; display: block; margin: 0 auto; border-radius: 12px; }
            .nominal-box { margin: 16px 0; padding: 10px; background: #ecfdf5; border: 2px solid #059669; border-radius: 8px; font-size: 18px; font-weight: 800; color: #047857; }
            .footer { margin-top: 16px; font-size: 11px; color: #6b7280; font-weight: 600; line-height: 1.5; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h1>QRIS</h1>
              <p>PEMBAYARAN DIGITAL INDONESIA • GPN</p>
            </div>
            <div class="merchant">${merchantName}</div>
            <div class="nmid">NMID: ${nmid}</div>
            ${nominal ? `<div class="nominal-box">Total Bayar: ${formatRupiah(nominal)}</div>` : ''}
            <img src="${displayQrUrl}" class="qr-img" alt="QRIS Standee" />
            <div class="footer">
              <p>Mendukung Semua Pembayaran Digital:<br>BSI • BCA • Mandiri • BRI • BNI • GoPay • OVO • DANA • ShopeePay • LinkAja</p>
              <p style="margin-top: 8px; font-size: 9px;">Koperasi Santri Pondok Pesantren El-Bayan</p>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Modal Top Bar */}
        <div className="px-4 py-3 sm:px-5 sm:py-3.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-black text-xs tracking-wider">
              QRIS
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold leading-tight">{title}</h3>
              <p className="text-[10px] text-red-100 flex items-center gap-1">
                <span>Standar Nasional ASPI & Bank Indonesia</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            title="Tutup Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Order Info & Total (if supplied) */}
          {nominal !== undefined && (
            <div className="p-3 sm:p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block tracking-wider">
                  Total Tagihan Pembayaran
                </span>
                <span className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white font-mono">
                  {formatRupiah(nominal)}
                </span>
                {orderNumber && (
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                    No. Ref: {orderNumber} {customerName ? `• ${customerName}` : ''}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleCopyNominal}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 flex-shrink-0"
              >
                {copiedNominal ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedNominal ? 'Tersalin!' : 'Salin Nominal'}</span>
              </button>
            </div>
          )}

          {/* Merchant Credentials */}
          <div className="text-center space-y-0.5">
            <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">
              {merchantName}
            </h4>
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-mono font-medium">NMID: {nmid}</span>
              <button
                type="button"
                onClick={handleCopyNmid}
                className="hover:text-emerald-600 transition-colors"
                title="Salin NMID"
              >
                {copiedNmid ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* QRIS Display Container */}
          <div className="relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white border-2 border-slate-200 shadow-inner group">
            {isGeneratingDefault ? (
              <div className="w-64 h-64 flex flex-col items-center justify-center gap-2 text-slate-400">
                <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs">Memuat QRIS Resolusi Tinggi...</span>
              </div>
            ) : (
              <div className="relative max-w-full flex justify-center">
                <img
                  src={displayQrUrl}
                  alt={`QRIS ${merchantName}`}
                  className={`rounded-xl object-contain transition-all duration-200 select-none ${
                    isZoomed
                      ? 'w-full max-w-[420px] scale-105 cursor-zoom-out'
                      : 'w-full max-w-[280px] sm:max-w-[320px] cursor-zoom-in'
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                  style={{ imageRendering: 'pixelated' }}
                />

                {/* Quick zoom floating badge */}
                <button
                  type="button"
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-black/70 hover:bg-black text-white text-[10px] font-bold flex items-center gap-1 backdrop-blur-xs shadow-md transition-all"
                >
                  {isZoomed ? <ZoomOut className="w-3 h-3" /> : <ZoomIn className="w-3 h-3" />}
                  <span>{isZoomed ? 'Kecilkan' : 'Perbesar'}</span>
                </button>
              </div>
            )}
          </div>

          <p className="text-center text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kualitas tinggi & tajam: Dapat dipindai langsung dari kamera ponsel atau upload galeri</span>
          </p>

          {/* Action Buttons: Unduh, Cetak Standee */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleDownload}
              disabled={!displayQrUrl}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Unduh Gambar QRIS</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              disabled={!displayQrUrl}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-blue-600" />
              <span>Cetak Standee Meja</span>
            </button>
          </div>

          {/* Petunjuk Pembayaran Singkat */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 space-y-1.5">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Langkah Pembayaran QRIS:</span>
            </div>
            <ol className="list-decimal pl-4 space-y-1 text-slate-600 dark:text-slate-400">
              <li>Buka aplikasi m-Banking (BSI, BCA, Mandiri, BRI, dll) atau e-Wallet favorit Anda.</li>
              <li>Pilih menu <b>Scan / Bayar QRIS</b> dan arahkan kamera ke barcode di atas (atau unggah dari galeri jika diunduh).</li>
              <li>Pastikan nama merchant tertera: <b>{merchantName}</b>.</li>
              <li>Masukkan nominal tagihan {nominal ? <b>{formatRupiah(nominal)}</b> : 'sesuai belanjaan'}.</li>
              <li>Konfirmasi pembayaran dan simpan bukti transaksi untuk verifikasi kasir.</li>
            </ol>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-slate-900 hover:bg-black dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold rounded-xl transition-all"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
