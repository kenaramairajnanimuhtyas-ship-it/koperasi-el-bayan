import React, { useState, useMemo } from 'react';
import { Transaksi, Produk } from '../../types';
import { formatRupiah, formatDateIndo, formatDateOnly } from '../../utils/formatters';
import {
  Calendar,
  FileSpreadsheet,
  Printer,
  TrendingUp,
  CreditCard,
  DollarSign,
  Package,
  CheckCircle2,
  Download,
  Filter,
} from 'lucide-react';

interface AdminLaporanViewProps {
  transactions: Transaksi[];
  products: Produk[];
}

export const AdminLaporanView: React.FC<AdminLaporanViewProps> = ({
  transactions,
  products,
}) => {
  const [dateFilter, setDateFilter] = useState<'semua' | 'hari_ini' | 'kemarin' | '7_hari' | 'bulan_ini'>('semua');
  const [methodFilter, setMethodFilter] = useState<string>('semua');

  // Filter transactions based on date & method
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    const currentMonthStr = now.toISOString().slice(0, 7);

    return transactions.filter((t) => {
      const trxDate = t.tanggal_transaksi.slice(0, 10);
      const trxDateObj = new Date(t.tanggal_transaksi);

      let matchesDate = true;
      if (dateFilter === 'hari_ini') matchesDate = trxDate === todayStr;
      if (dateFilter === 'kemarin') matchesDate = trxDate === yesterdayStr;
      if (dateFilter === '7_hari') matchesDate = trxDateObj >= sevenDaysAgo;
      if (dateFilter === 'bulan_ini') matchesDate = trxDate.startsWith(currentMonthStr);

      let matchesMethod = true;
      if (methodFilter !== 'semua') matchesMethod = t.metode_bayar === methodFilter;

      return matchesDate && matchesMethod;
    });
  }, [transactions, dateFilter, methodFilter]);

  // Aggregate Metrics
  const totalOmzet = filteredTransactions.reduce((acc, t) => acc + t.total_bayar, 0);
  const totalTransactionsCount = filteredTransactions.length;
  const totalItemsSold = filteredTransactions.reduce(
    (acc, t) => acc + t.items.reduce((s, it) => s + it.jumlah, 0),
    0
  );

  // Method Breakdown
  const methodStats = useMemo(() => {
    const stats: Record<string, { count: number; total: number }> = {
      tunai: { count: 0, total: 0 },
      transfer: { count: 0, total: 0 },
      qris: { count: 0, total: 0 },
    };

    filteredTransactions.forEach((t) => {
      const m = t.metode_bayar.toLowerCase();
      if (!stats[m]) stats[m] = { count: 0, total: 0 };
      stats[m].count += 1;
      stats[m].total += t.total_bayar;
    });

    return stats;
  }, [filteredTransactions]);

  // Top Selling Products
  const topProducts = useMemo(() => {
    const map = new Map<string, { nama: string; qty: number; totalRupiah: number }>();

    filteredTransactions.forEach((t) => {
      t.items.forEach((it) => {
        const existing = map.get(it.nama_produk) || {
          nama: it.nama_produk,
          qty: 0,
          totalRupiah: 0,
        };
        existing.qty += it.jumlah;
        existing.totalRupiah += it.subtotal;
        map.set(it.nama_produk, existing);
      });
    });

    return Array.from(map.values()).sort((a, b) => b.qty - a.qty);
  }, [filteredTransactions]);

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = [
      'No. Transaksi',
      'No. Pesanan',
      'Tanggal',
      'Kasir',
      'Konsumen',
      'Metode Bayar',
      'Total Bayar',
      'Nominal Dibayar',
      'Kembalian',
    ];

    const rows = filteredTransactions.map((t) => [
      `"${t.no_transaksi}"`,
      `"${t.no_pesanan || '-'}"`,
      `"${t.tanggal_transaksi}"`,
      `"${t.nama_kasir}"`,
      `"${t.nama_konsumen}"`,
      `"${t.metode_bayar.toUpperCase()}"`,
      t.total_bayar,
      t.nominal_dibayar,
      t.kembalian,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Laporan_Koperasi_El_Bayan_${dateFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-3 sm:space-y-6 pb-4 sm:pb-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Laporan Penjualan & Pendapatan Koperasi
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">
            Rekapitulasi transaksi, total omzet, metode pembayaran, dan produk terlaris Koperasi El-Bayan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex-1 sm:flex-initial px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            title="Download CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="flex-1 sm:flex-initial px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Laporan</span>
          </button>
        </div>
      </div>

      {/* Date & Method Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          <span className="text-[11px] sm:text-xs font-bold text-slate-500 mr-1 flex items-center gap-1 flex-shrink-0">
            <Calendar className="w-3.5 h-3.5" />
            <span>Periode:</span>
          </span>
          {[
            { id: 'semua', label: 'Semua Waktu' },
            { id: 'hari_ini', label: 'Hari Ini' },
            { id: 'kemarin', label: 'Kemarin' },
            { id: '7_hari', label: '7 Hari' },
            { id: 'bulan_ini', label: 'Bulan Ini' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDateFilter(tab.id as any)}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                dateFilter === tab.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className="text-[11px] sm:text-xs font-bold text-slate-500 mr-1">Metode:</span>
          {['semua', 'tunai', 'transfer', 'qris'].map((m) => (
            <button
              key={m}
              onClick={() => setMethodFilter(m)}
              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-bold uppercase transition-all ${
                methodFilter === m
                  ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* 3 Summary Big Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
        {/* Total Omzet */}
        <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-lg shadow-emerald-700/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-emerald-100 uppercase tracking-wider">
              Total Omzet Penjualan
            </span>
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-200" />
          </div>
          <div className="mt-2 sm:mt-3 font-mono font-extrabold text-xl sm:text-2xl lg:text-3xl">
            {formatRupiah(totalOmzet)}
          </div>
          <p className="text-[10px] sm:text-[11px] text-emerald-100 mt-1">
            Dari {totalTransactionsCount} transaksi pada filter terpilih
          </p>
        </div>

        {/* Total Transaksi */}
        <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Transaksi Sukses
            </span>
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
          </div>
          <div className="mt-2 sm:mt-3 font-mono font-extrabold text-xl sm:text-2xl lg:text-3xl text-slate-900 dark:text-white">
            {totalTransactionsCount}
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1">
            Struk diterbitkan oleh kasir
          </p>
        </div>

        {/* Total Item Terjual */}
        <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Unit Terjual
            </span>
            <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>
          <div className="mt-2 sm:mt-3 font-mono font-extrabold text-xl sm:text-2xl lg:text-3xl text-slate-900 dark:text-white">
            {totalItemsSold} <span className="text-xs sm:text-sm font-normal text-slate-400">pcs</span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1">
            Volume stok berkurang dari gudang
          </p>
        </div>
      </div>

      {/* Grid: Breakdown Metode Pembayaran & Produk Terlaris */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6">
        {/* Breakdown Metode Pembayaran (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-5 shadow-xs">
          <div className="flex items-center gap-2 pb-2.5 sm:pb-3 border-b border-slate-100 dark:border-slate-800">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              Penerimaan per Metode Bayar
            </h3>
          </div>

          <div className="mt-3 space-y-2 sm:space-y-3">
            {[
              { id: 'tunai', label: 'Tunai di Kasir', color: 'emerald' },
              { id: 'transfer', label: 'Transfer Bank (BSI)', color: 'blue' },
              { id: 'qris', label: 'QRIS Dinamis', color: 'purple' },
            ].map((m) => {
              const stat = methodStats[m.id] || { count: 0, total: 0 };
              const percent = totalOmzet > 0 ? Math.round((stat.total / totalOmzet) * 100) : 0;

              return (
                <div
                  key={m.id}
                  className="p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg sm:rounded-xl border border-slate-100 dark:border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{m.label}</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {formatRupiah(stat.total)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400">
                    <span>{stat.count} Transaksi</span>
                    <span>{percent}% dari omzet</span>
                  </div>

                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Produk Terlaris (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-5 shadow-xs">
          <div className="flex items-center gap-2 pb-2.5 sm:pb-3 border-b border-slate-100 dark:border-slate-800">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              Peringkat Produk Terlaris
            </h3>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800 pb-1">
                <tr>
                  <th className="pb-2">Peringkat & Nama Produk</th>
                  <th className="pb-2 text-center">Unit Terjual</th>
                  <th className="pb-2 text-right">Total Pendapatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {topProducts.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-slate-400">
                      Belum ada penjualan di periode ini.
                    </td>
                  </tr>
                ) : (
                  topProducts.slice(0, 5).map((p, idx) => (
                    <tr key={idx} className="py-2">
                      <td className="py-2 font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                            idx === 0
                              ? 'bg-amber-400 text-slate-950'
                              : idx === 1
                              ? 'bg-slate-300 text-slate-800'
                              : idx === 2
                              ? 'bg-amber-700 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span className="truncate max-w-[180px] sm:max-w-[200px]">{p.nama}</span>
                      </td>
                      <td className="py-2 text-center font-mono font-bold text-slate-900 dark:text-white">
                        {p.qty} pcs
                      </td>
                      <td className="py-2 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {formatRupiah(p.totalRupiah)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Table of Transactions in Report */}
      <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-3 sm:p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
            Daftar Detail Transaksi ({filteredTransactions.length})
          </h3>
          <span className="text-[11px] sm:text-xs text-slate-500 font-mono">
            Subtotal: {formatRupiah(totalOmzet)}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold">
              <tr>
                <th className="px-4 py-3">No. Transaksi</th>
                <th className="px-4 py-3">Tanggal & Jam</th>
                <th className="px-4 py-3">Kasir</th>
                <th className="px-4 py-3">Konsumen</th>
                <th className="px-4 py-3">Barang & Qty</th>
                <th className="px-4 py-3">Metode</th>
                <th className="px-4 py-3 text-right">Total Transaksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    Tidak ada transaksi pada filter periode ini.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((trx) => (
                  <tr key={trx.id_transaksi} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">
                      {trx.no_transaksi}
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {formatDateIndo(trx.tanggal_transaksi)}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">
                      {trx.nama_kasir}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      {trx.nama_konsumen}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 max-w-[220px] truncate">
                      {trx.items.map((it) => `${it.nama_produk} (${it.jumlah})`).join(', ')}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {trx.metode_bayar}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {formatRupiah(trx.total_bayar)}
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
