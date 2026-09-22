import React from 'react';
import { Order, Transaksi, Produk, KasirTab } from '../../types';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';
import {
  Clock,
  Package,
  CheckCircle2,
  DollarSign,
  ShoppingCart,
  ArrowRight,
  TrendingUp,
  Store,
  Users,
  AlertCircle,
  FileText,
} from 'lucide-react';

interface KasirDashboardViewProps {
  orders: Order[];
  transactions: Transaksi[];
  products: Produk[];
  onNavigateTab: (tab: KasirTab) => void;
  onProcessOrderToPos: (order: Order) => void;
}

export const KasirDashboardView: React.FC<KasirDashboardViewProps> = ({
  orders,
  transactions,
  products,
  onNavigateTab,
  onProcessOrderToPos,
}) => {
  // Calculate today's stats
  const todayStr = new Date().toISOString().slice(0, 10);

  const todayTransactions = transactions.filter(
    (t) => t.tanggal_transaksi.slice(0, 10) === todayStr
  );
  const todayRevenue = todayTransactions.reduce((acc, t) => acc + t.total_bayar, 0);
  const todayItemsSold = todayTransactions.reduce(
    (acc, t) => acc + t.items.reduce((sum, it) => sum + it.jumlah, 0),
    0
  );

  const pendingOrders = orders.filter((o) => o.status === 'menunggu');
  const processingOrders = orders.filter((o) => o.status === 'diproses');

  return (
    <div className="space-y-6 pb-16">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-6 sm:p-7 rounded-3xl shadow-xl shadow-emerald-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-bold border border-emerald-400/30 mb-2">
            <Store className="w-3.5 h-3.5 text-emerald-300" />
            <span>Terminal Kasir / Point of Sales Koperasi El-Bayan</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Dashboard Operasional Kasir
          </h1>
          <p className="text-xs text-emerald-100 mt-1 max-w-xl">
            Pantau pesanan masuk dari katalog online konsumen, buka transaksi kasir baru, dan cetak struk resmi secara realtime.
          </p>
        </div>

        {/* Quick Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('pos')}
            className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Buka Transaksi POS Baru</span>
          </button>
        </div>
      </div>

      {/* 5 Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Pesanan Menunggu */}
        <div
          onClick={() => onNavigateTab('pesanan')}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/50 shadow-xs hover:shadow-md cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase">
              Pesanan Menunggu
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4 animate-spin-slow" />
            </div>
          </div>
          <div className="mt-3 font-mono font-extrabold text-2xl text-slate-900 dark:text-white">
            {pendingOrders.length}
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
            Menunggu konfirmasi kasir
          </p>
        </div>

        {/* Pesanan Diproses */}
        <div
          onClick={() => onNavigateTab('pesanan')}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-blue-200 dark:border-blue-900/50 shadow-xs hover:shadow-md cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase">
              Pesanan Diproses
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/80 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 font-mono font-extrabold text-2xl text-slate-900 dark:text-white">
            {processingOrders.length}
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
            Siap dilakukan pembayaran
          </p>
        </div>

        {/* Transaksi Hari Ini */}
        <div
          onClick={() => onNavigateTab('riwayat')}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">
              Transaksi Hari Ini
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 font-mono font-extrabold text-2xl text-slate-900 dark:text-white">
            {todayTransactions.length}
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
            Struk berhasil diterbitkan
          </p>
        </div>

        {/* Pendapatan Hari Ini */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
              Pendapatan Hari Ini
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 font-mono font-bold text-lg text-slate-900 dark:text-white truncate">
            {formatRupiah(todayRevenue)}
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
            Total penerimaan kasir
          </p>
        </div>

        {/* Total Item Terjual */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">
              Item Terjual
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 font-mono font-extrabold text-2xl text-slate-900 dark:text-white">
            {todayItemsSold} <span className="text-xs font-normal text-slate-400">pcs</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
            Volume barang keluar
          </p>
        </div>
      </div>

      {/* Main Grid: Antrean Pesanan Masuk & Transaksi Terkini */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Antrean Pesanan Masuk (Live Queue) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Antrean Pesanan Masuk Konsumen ({pendingOrders.length})
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('pesanan')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 mt-4 space-y-3 overflow-y-auto max-h-[360px]">
            {pendingOrders.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-500/50" />
                <p className="text-xs font-medium">Tidak ada antrean pesanan baru.</p>
                <span className="text-[11px] text-slate-500">
                  Semua pesanan katalog telah diproses.
                </span>
              </div>
            ) : (
              pendingOrders.map((order) => (
                <div
                  key={order.id_pesanan}
                  className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                        {order.no_pesanan}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        MENUNGGU
                      </span>
                    </div>
                    <div className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                      {order.nama_konsumen} •{' '}
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {formatRupiah(order.total)}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[280px]">
                      {order.items.map((it) => `${it.nama_produk} (${it.jumlah})`).join(', ')}
                    </div>
                  </div>

                  <button
                    onClick={() => onProcessOrderToPos(order)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all flex-shrink-0"
                  >
                    <span>Proses di POS</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Transaksi Terkini Kasir */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Transaksi Kasir Terakhir
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('riwayat')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Riwayat Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 mt-4 space-y-2.5 overflow-y-auto max-h-[360px]">
            {transactions.slice(0, 5).map((trx) => (
              <div
                key={trx.id_transaksi}
                className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                    {trx.no_transaksi}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {trx.nama_konsumen} • {formatDateIndo(trx.tanggal_transaksi)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                    {formatRupiah(trx.total_bayar)}
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {trx.metode_bayar}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
