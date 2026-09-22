import React from 'react';
import {
  Produk,
  Kategori,
  Order,
  Transaksi,
  AdminTab,
} from '../../types';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';
import {
  Package,
  Layers,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Shield,
  Plus,
  BarChart3,
  Calendar,
} from 'lucide-react';

interface AdminDashboardViewProps {
  products: Produk[];
  categories: Kategori[];
  orders: Order[];
  transactions: Transaksi[];
  onNavigateTab: (tab: AdminTab) => void;
  onOpenAddProduct: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  products,
  categories,
  orders,
  transactions,
  onNavigateTab,
  onOpenAddProduct,
}) => {
  // Calculations
  const totalOmzet = transactions.reduce((acc, t) => acc + t.total_bayar, 0);
  const pendingOrders = orders.filter((o) => o.status === 'menunggu');
  const processingOrders = orders.filter((o) => o.status === 'diproses');
  const lowStockProducts = products.filter((p) => p.stok <= 5);

  // Group transactions for simple 7-day chart visualization
  const last7Days: { dateStr: string; label: string; total: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const dayLabel = new Intl.DateTimeFormat('id-ID', { weekday: 'short', day: 'numeric' }).format(d);

    const dayTotal = transactions
      .filter((t) => t.tanggal_transaksi.slice(0, 10) === dateStr)
      .reduce((acc, t) => acc + t.total_bayar, 0);

    last7Days.push({ dateStr, label: dayLabel, total: dayTotal });
  }

  const maxDailyRevenue = Math.max(...last7Days.map((d) => d.total), 100000);

  return (
    <div className="space-y-3 sm:space-y-6 pb-4 sm:pb-8">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-4 sm:p-7 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] sm:text-xs font-bold border border-emerald-400/30 mb-1.5 sm:mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Panel Administrator Koperasi El-Bayan</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight">
            Ringkasan Statistik & Kinerja Koperasi
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Semua data katalog, pesanan konsumen, kasir, pergerakan stok, dan laporan keuangan terpusat dalam satu kendali terpadu.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenAddProduct}
            className="w-full sm:w-auto px-3.5 py-2 sm:px-4 sm:py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-700/30 flex items-center justify-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Produk Baru</span>
          </button>
        </div>
      </div>

      {/* 8 Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        {/* Total Produk */}
        <div
          onClick={() => onNavigateTab('produk')}
          className="bg-white dark:bg-slate-900 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase">Total Produk</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-emerald-50 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600">
              <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 font-mono font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white">
            {products.length}
          </div>
          <span className="text-[9px] sm:text-[10px] text-slate-400">Di semua kategori</span>
        </div>

        {/* Total Kategori */}
        <div
          onClick={() => onNavigateTab('kategori')}
          className="bg-white dark:bg-slate-900 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase">Total Kategori</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-blue-50 dark:bg-blue-950/80 flex items-center justify-center text-blue-600">
              <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 font-mono font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white">
            {categories.length}
          </div>
          <span className="text-[9px] sm:text-[10px] text-slate-400">Pengelompokan barang</span>
        </div>

        {/* Total Pesanan */}
        <div
          onClick={() => onNavigateTab('pesanan')}
          className="bg-white dark:bg-slate-900 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase">Total Pesanan</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-purple-50 dark:bg-purple-950/80 flex items-center justify-center text-purple-600">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 font-mono font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white">
            {orders.length}
          </div>
          <span className="text-[9px] sm:text-[10px] text-slate-400">Dari katalog online</span>
        </div>

        {/* Total Transaksi */}
        <div
          onClick={() => onNavigateTab('laporan')}
          className="bg-white dark:bg-slate-900 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase">Total Transaksi</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-teal-50 dark:bg-teal-950/80 flex items-center justify-center text-teal-600">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 font-mono font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white">
            {transactions.length}
          </div>
          <span className="text-[9px] sm:text-[10px] text-slate-400">Kasir berhasil</span>
        </div>

        {/* Pesanan Menunggu */}
        <div
          onClick={() => onNavigateTab('pesanan')}
          className="bg-white dark:bg-slate-900 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-amber-200 dark:border-amber-900/60 shadow-xs hover:border-amber-500 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase">
              Pesanan Menunggu
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin-slow" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 font-mono font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white">
            {pendingOrders.length}
          </div>
          <span className="text-[9px] sm:text-[10px] text-amber-600 dark:text-amber-400">Perlu diproses kasir</span>
        </div>

        {/* Pesanan Diproses */}
        <div
          onClick={() => onNavigateTab('pesanan')}
          className="bg-white dark:bg-slate-900 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-blue-200 dark:border-blue-900/60 shadow-xs hover:border-blue-500 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase">
              Pesanan Diproses
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 font-mono font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white">
            {processingOrders.length}
          </div>
          <span className="text-[9px] sm:text-[10px] text-blue-600 dark:text-blue-400">Siap bayar di POS</span>
        </div>

        {/* Stok Menipis */}
        <div
          onClick={() => onNavigateTab('produk')}
          className="bg-white dark:bg-slate-900 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-rose-200 dark:border-rose-900/60 shadow-xs hover:border-rose-500 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-rose-700 dark:text-rose-400 uppercase">
              Stok Menipis (≤5)
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 font-mono font-extrabold text-xl sm:text-2xl text-rose-600 dark:text-rose-400">
            {lowStockProducts.length}
          </div>
          <span className="text-[9px] sm:text-[10px] text-rose-500">Perlu pengadaan stok</span>
        </div>

        {/* Total Penjualan (Rupiah) */}
        <div
          onClick={() => onNavigateTab('laporan')}
          className="bg-white dark:bg-slate-900 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-emerald-300 dark:border-emerald-800 shadow-xs hover:border-emerald-500 cursor-pointer transition-all bg-emerald-50/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">
              Total Penjualan
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
              <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 font-mono font-extrabold text-base sm:text-lg text-emerald-700 dark:text-emerald-300 truncate">
            {formatRupiah(totalOmzet)}
          </div>
          <span className="text-[9px] sm:text-[10px] text-emerald-600">Semua penerimaan kasir</span>
        </div>
      </div>

      {/* Chart Section: 7-Hari Tren Penjualan */}
      <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              Grafik Penjualan 7 Hari Terakhir
            </h3>
          </div>
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500">
            Koperasi El-Bayan POS
          </span>
        </div>

        <div className="mt-4 sm:mt-6 flex items-end justify-between gap-1.5 sm:gap-2 h-36 sm:h-44 pt-2 sm:pt-4 px-1 sm:px-2">
          {last7Days.map((item, idx) => {
            const heightPercent = Math.max(8, Math.round((item.total / maxDailyRevenue) * 100));

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 sm:gap-2 h-full justify-end group">
                <span className="text-[9px] sm:text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {formatRupiah(item.total)}
                </span>
                <div className="w-full max-w-[48px] bg-slate-100 dark:bg-slate-800 rounded-t-lg sm:rounded-t-xl overflow-hidden h-full flex items-end">
                  <div
                    className="w-full bg-emerald-600 dark:bg-emerald-500 rounded-t-lg sm:rounded-t-xl group-hover:bg-emerald-400 transition-all duration-300"
                    style={{ height: `${heightPercent}%` }}
                  ></div>
                </div>
                <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2 Split Columns: Peringatan Stok Menipis & Transaksi Terkini */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
        {/* Stok Menipis Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Peringatan Stok Menipis ({lowStockProducts.length})
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('produk')}
              className="text-[11px] sm:text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
            >
              <span>Kelola Stok</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 mt-2.5 sm:mt-3 space-y-1.5 sm:space-y-2 max-h-[300px] overflow-y-auto">
            {lowStockProducts.length === 0 ? (
              <div className="p-6 sm:p-8 text-center text-slate-400">
                <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 mx-auto mb-2 text-emerald-500" />
                <p className="text-xs font-medium">Semua stok produk dalam batas aman.</p>
              </div>
            ) : (
              lowStockProducts.map((p) => (
                <div
                  key={p.id_produk}
                  className="p-2.5 sm:p-3 bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-lg sm:rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <img
                      src={p.gambar}
                      alt={p.nama}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-cover"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{p.nama}</div>
                      <div className="text-[10px] text-slate-500">{formatRupiah(p.harga)}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-mono font-extrabold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                    Sisa {p.stok}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Transaksi Terbaru Admin Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Transaksi Kasir Terakhir
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('laporan')}
              className="text-[11px] sm:text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
            >
              <span>Semua Laporan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 mt-2.5 sm:mt-3 space-y-1.5 sm:space-y-2 max-h-[300px] overflow-y-auto">
            {transactions.slice(0, 5).map((trx) => (
              <div
                key={trx.id_transaksi}
                className="p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg sm:rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                    {trx.no_transaksi}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500">
                    {trx.nama_konsumen} • {formatDateIndo(trx.tanggal_transaksi)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                    {formatRupiah(trx.total_bayar)}
                  </div>
                  <span className="text-[9px] uppercase font-bold text-slate-400">
                    Kasir: {trx.nama_kasir}
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
