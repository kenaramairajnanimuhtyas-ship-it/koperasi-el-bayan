import React, { useRef } from 'react';
import { Transaksi, StoreSettings } from '../../types';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';
import { Printer, Copy, Check, X, Download, Share2 } from 'lucide-react';

interface StrukModalProps {
  transaksi: Transaksi;
  storeSettings: StoreSettings;
  onClose: () => void;
  onNewTransaction?: () => void;
}

export const StrukModal: React.FC<StrukModalProps> = ({
  transaksi,
  storeSettings,
  onClose,
  onNewTransaction,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const textReceipt = `
========================================
           ${storeSettings.namaKoperasi}
   ${storeSettings.alamat}
       Telp: ${storeSettings.noHp}
========================================
No. Transaksi : ${transaksi.no_transaksi}
${transaksi.no_pesanan ? `No. Pesanan   : ${transaksi.no_pesanan}\n` : ''}Tanggal       : ${formatDateIndo(transaksi.tanggal_transaksi)}
Kasir         : ${transaksi.nama_kasir}
Konsumen      : ${transaksi.nama_konsumen}
========================================
ITEM BELANJA:
${transaksi.items
  .map(
    (it) =>
      `${it.nama_produk}\n  ${it.jumlah} x ${formatRupiah(it.harga)} = ${formatRupiah(it.subtotal)}`
  )
  .join('\n')}
----------------------------------------
Total Belanja : ${formatRupiah(transaksi.total_bayar)}
Bayar         : ${formatRupiah(transaksi.nominal_dibayar)}
Kembalian     : ${formatRupiah(transaksi.kembalian)}
Metode Bayar  : ${transaksi.metode_bayar.toUpperCase()}
========================================
${storeSettings.strukFooter}
========================================
    `;

    navigator.clipboard.writeText(textReceipt.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="p-4 bg-emerald-700 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 font-bold text-sm">
            <Printer className="w-4 h-4" />
            <span>Struk Resmi Pembelian Koperasi</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Thermal Receipt Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100 dark:bg-slate-950 flex justify-center">
          <div
            id="printable-thermal-receipt"
            className="w-full max-w-[340px] bg-white text-slate-900 p-6 rounded-xl shadow-md border border-slate-200 font-mono text-xs leading-relaxed"
          >
            {/* Header Struk */}
            <div className="text-center pb-3 border-b border-dashed border-slate-400">
              <h2 className="text-sm font-extrabold uppercase tracking-wide">
                {storeSettings.namaKoperasi}
              </h2>
              <p className="text-[10px] text-slate-600 mt-0.5">{storeSettings.alamat}</p>
              <p className="text-[10px] text-slate-600">Telp: {storeSettings.noHp}</p>
              <div className="mt-1 text-[9px] font-bold text-emerald-700 uppercase tracking-widest">
                Unit Usaha Pondok Pesantren
              </div>
            </div>

            {/* Meta Transaksi */}
            <div className="py-2.5 border-b border-dashed border-slate-400 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">No. Trx:</span>
                <span className="font-bold">{transaksi.no_transaksi}</span>
              </div>
              {transaksi.no_pesanan && (
                <div className="flex justify-between">
                  <span className="text-slate-500">No. Pesanan:</span>
                  <span className="font-bold text-emerald-700">{transaksi.no_pesanan}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Tanggal:</span>
                <span>{formatDateIndo(transaksi.tanggal_transaksi)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kasir:</span>
                <span>{transaksi.nama_kasir}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Konsumen:</span>
                <span className="font-semibold">{transaksi.nama_konsumen}</span>
              </div>
            </div>

            {/* Daftar Produk */}
            <div className="py-2.5 border-b border-dashed border-slate-400 space-y-2 text-[11px]">
              {transaksi.items.map((it, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="font-semibold text-slate-900">{it.nama_produk}</span>
                  <div className="flex justify-between text-slate-600 pl-2">
                    <span>
                      {it.jumlah} x {formatRupiah(it.harga)}
                    </span>
                    <span className="font-semibold text-slate-900">
                      {formatRupiah(it.subtotal)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Perhitungan Total */}
            <div className="py-2.5 border-b border-dashed border-slate-400 space-y-1 text-[11px]">
              <div className="flex justify-between text-slate-700">
                <span>Subtotal:</span>
                <span>{formatRupiah(transaksi.total_bayar)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-slate-900 pt-1">
                <span>Total:</span>
                <span>{formatRupiah(transaksi.total_bayar)}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Bayar:</span>
                <span>{formatRupiah(transaksi.nominal_dibayar)}</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-700">
                <span>Kembalian:</span>
                <span>{formatRupiah(transaksi.kembalian)}</span>
              </div>
              <div className="flex justify-between text-slate-700 pt-0.5">
                <span>Metode Pembayaran:</span>
                <span className="uppercase font-bold">{transaksi.metode_bayar}</span>
              </div>
            </div>

            {/* Footer Struk */}
            <div className="text-center pt-3 text-[10px] text-slate-600">
              <p className="font-bold text-slate-800 uppercase">-- Terima Kasih --</p>
              <p className="mt-0.5 leading-snug">{storeSettings.strukFooter}</p>
              <p className="mt-1.5 text-[8px] text-slate-400">
                Barang yang sudah dibeli tidak dapat ditukar kecuali perjanjian.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 flex-shrink-0">
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
          </button>

          <div className="flex items-center gap-2">
            {onNewTransaction && (
              <button
                onClick={onNewTransaction}
                className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors"
              >
                Transaksi Baru
              </button>
            )}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/30 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Struk</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
