import React, { useState } from 'react';
import { Transaksi } from '../../types';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';
import {
  Search,
  Printer,
  FileText,
  Calendar,
  CreditCard,
  Banknote,
  QrCode,
  DollarSign,
} from 'lucide-react';

interface KasirRiwayatTrxViewProps {
  transactions: Transaksi[];
  onOpenReceipt: (trxId: number) => void;
}

export const KasirRiwayatTrxView: React.FC<KasirRiwayatTrxViewProps> = ({
  transactions,
  onOpenReceipt,
}) => {
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('semua');

  const filteredTrx = transactions.filter((t) => {
    const matchesSearch =
      t.no_transaksi.toLowerCase().includes(search.toLowerCase()) ||
      t.nama_konsumen.toLowerCase().includes(search.toLowerCase()) ||
      (t.no_pesanan && t.no_pesanan.toLowerCase().includes(search.toLowerCase()));

    const matchesMethod = methodFilter === 'semua' || t.metode_bayar === methodFilter;
    return matchesSearch && matchesMethod;
  });

  const totalOmzet = filteredTrx.reduce((acc, t) => acc + t.total_bayar, 0);

  return (
    <div className="space-y-3 sm:space-y-6 pb-4 sm:pb-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Riwayat Transaksi Kasir Koperasi
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">
            Daftar transaksi pembayaran yang telah berhasil dicetak dan dibukukan ke sistem kasir.
          </p>
        </div>

        <div className="p-2.5 sm:p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-left sm:text-right">
          <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 block">
            TOTAL OMZET TAMPIL:
          </span>
          <span className="font-mono font-extrabold text-sm sm:text-base text-emerald-700 dark:text-emerald-400">
            {formatRupiah(totalOmzet)}
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-2.5 sm:gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari no. transaksi (TRX-...), no. pesanan, atau nama..."
            className="w-full pl-9 pr-3 py-2 sm:py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          {['semua', 'tunai', 'transfer', 'qris'].map((m) => (
            <button
              key={m}
              onClick={() => setMethodFilter(m)}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-xs font-bold uppercase whitespace-nowrap transition-all ${
                methodFilter === m
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List / Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        {/* Mobile View: Cards */}
        <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {filteredTrx.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              Tidak ada riwayat transaksi yang cocok.
            </div>
          ) : (
            filteredTrx.map((trx) => (
              <div key={trx.id_transaksi} className="p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="font-mono font-bold text-xs text-slate-900 dark:text-white block">
                      {trx.no_transaksi}
                    </span>
                    {trx.no_pesanan && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                        Pesanan: {trx.no_pesanan}
                      </span>
                    )}
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {trx.metode_bayar}
                  </span>
                </div>

                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Konsumen:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {trx.nama_konsumen}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Waktu:</span>
                    <span className="text-slate-600 dark:text-slate-300">
                      {formatDateIndo(trx.tanggal_transaksi)}
                    </span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 text-[11px] pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span className="font-semibold text-slate-500">Item: </span>
                    {trx.items.map((i) => `${i.nama_produk} (${i.jumlah})`).join(', ')}
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">Total Bayar:</span>
                    <span className="font-mono font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                      {formatRupiah(trx.total_bayar)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenReceipt(trx.id_transaksi)}
                  className="w-full py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Lihat / Cetak Ulang Struk</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3">No. Transaksi</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Konsumen</th>
                <th className="px-4 py-3">Item Dibeli</th>
                <th className="px-4 py-3">Metode</th>
                <th className="px-4 py-3">Total Bayar</th>
                <th className="px-4 py-3 text-right">Struk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTrx.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                    Tidak ada riwayat transaksi yang cocok.
                  </td>
                </tr>
              ) : (
                filteredTrx.map((trx) => (
                  <tr
                    key={trx.id_transaksi}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-mono font-bold text-slate-900 dark:text-white">
                        {trx.no_transaksi}
                      </div>
                      {trx.no_pesanan && (
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                          Pesanan: {trx.no_pesanan}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {formatDateIndo(trx.tanggal_transaksi)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">
                      {trx.nama_konsumen}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 max-w-[200px] truncate">
                      {trx.items.map((i) => `${i.nama_produk} (${i.jumlah})`).join(', ')}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {trx.metode_bayar}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {formatRupiah(trx.total_bayar)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onOpenReceipt(trx.id_transaksi)}
                        className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-300 hover:text-emerald-600 rounded-lg font-semibold flex items-center gap-1.5 ml-auto transition-colors"
                        title="Cetak Ulang Struk"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Struk</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
