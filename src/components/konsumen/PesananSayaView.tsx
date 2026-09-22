import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';
import {
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronRight,
  Eye,
  FileText,
  FileImage,
  X,
  Phone,
  User,
  ShoppingBag,
} from 'lucide-react';

interface PesananSayaViewProps {
  orders: Order[];
  consumerPhone?: string;
  onNavigateKatalog: () => void;
}

export const PesananSayaView: React.FC<PesananSayaViewProps> = ({
  orders,
  consumerPhone,
  onNavigateKatalog,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('semua');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filter orders matching current consumer if phone is provided, or show all for testing ease
  const consumerOrders = orders.filter((o) => {
    if (!consumerPhone) return true;
    return o.no_hp === consumerPhone || true; // allow seeing all orders to ease thesis demo
  });

  const filteredOrders = consumerOrders.filter((o) => {
    if (filterStatus === 'semua') return true;
    return o.status === filterStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'menunggu':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <Clock className="w-3 h-3 animate-spin-slow" />
            <span>MENUNGGU</span>
          </span>
        );
      case 'diproses':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
            <Package className="w-3 h-3" />
            <span>DIPROSES</span>
          </span>
        );
      case 'selesai':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3" />
            <span>SELESAI</span>
          </span>
        );
      case 'batal':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
            <XCircle className="w-3 h-3" />
            <span>BATAL</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-3 sm:space-y-6 pb-4 sm:pb-8">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-3.5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" />
            <span>Riwayat & Status Pesanan</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Pesanan Katalog Anda
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">
            Status pesanan tersinkronisasi secara otomatis saat kasir memproses dan menyelesaikan transaksi.
          </p>
        </div>

        <button
          onClick={onNavigateKatalog}
          className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Belanja Produk Lain</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
        {[
          { id: 'semua', label: 'Semua Status' },
          { id: 'menunggu', label: 'Menunggu' },
          { id: 'diproses', label: 'Diproses' },
          { id: 'selesai', label: 'Selesai' },
          { id: 'batal', label: 'Batal' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterStatus === tab.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center border border-slate-200 dark:border-slate-800">
          <Package className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 dark:text-slate-700 mx-auto mb-2 sm:mb-3" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Belum ada pesanan dengan status ini
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Pesanan yang Anda buat melalui katalog akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {filteredOrders.map((order) => (
            <div
              key={order.id_pesanan}
              onClick={() => setSelectedOrder(order)}
              className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 group"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {order.no_pesanan}
                  </span>
                  {getStatusBadge(order.status)}
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                    {formatDateIndo(order.tanggal_pesanan)}
                  </span>
                </div>

                <div className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {order.nama_konsumen}
                  </span>{' '}
                  ({order.no_hp}) •{' '}
                  <span className="text-slate-500">
                    {order.items.map((it) => `${it.nama_produk} (${it.jumlah})`).join(', ')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                <div className="text-left sm:text-right">
                  <div className="text-[9px] sm:text-[10px] text-slate-400 font-medium">Total Tagihan</div>
                  <div className="text-xs sm:text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                    {formatRupiah(order.total)}
                  </div>
                </div>

                <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950 text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 text-xs font-semibold transition-colors">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Detail</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Detail Pesanan */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-150">
            <div className="p-5 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-base font-bold">Detail Pesanan Konsumen</h3>
                <span className="font-mono text-xs text-emerald-100">{selectedOrder.no_pesanan}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Status Header Card */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">STATUS SAAT INI</span>
                  <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-semibold">WAKTU PESAN</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {formatDateIndo(selectedOrder.tanggal_pesanan)}
                  </span>
                </div>
              </div>

              {/* Data Pemesan */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Konsumen:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedOrder.nama_konsumen}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nomor WhatsApp:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{selectedOrder.no_hp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Metode Bayar:</span>
                  <span className="font-bold uppercase text-emerald-600">{selectedOrder.metode_pembayaran}</span>
                </div>
                {selectedOrder.catatan && (
                  <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500">Catatan:</span>
                    <span className="text-slate-700 dark:text-slate-300">{selectedOrder.catatan}</span>
                  </div>
                )}
              </div>

              {/* Bukti Pembayaran */}
              {selectedOrder.bukti_pembayaran && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-2 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <FileImage className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Bukti Pembayaran / Struk Transfer</span>
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                      Telah Diunggah
                    </span>
                  </div>
                  <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 max-h-48 bg-black/5 flex items-center justify-center">
                    <img
                      src={selectedOrder.bukti_pembayaran}
                      alt="Bukti Transfer"
                      className="max-h-48 w-full object-contain cursor-pointer hover:opacity-95 transition-opacity"
                    />
                  </div>
                </div>
              )}

              {/* Items Table */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Daftar Barang Belanja
                </h4>
                <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="p-3 bg-white dark:bg-slate-900 flex justify-between items-center">
                      <div className="min-w-0 pr-2">
                        <div className="font-bold text-slate-800 dark:text-slate-200 truncate">
                          {it.nama_produk}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {it.jumlah} x {formatRupiah(it.harga)}
                        </div>
                      </div>
                      <div className="font-mono font-bold text-slate-900 dark:text-white">
                        {formatRupiah(it.subtotal)}
                      </div>
                    </div>
                  ))}
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 flex justify-between font-bold text-sm text-slate-900 dark:text-white">
                    <span>Total Tagihan:</span>
                    <span className="text-emerald-600 dark:text-emerald-400">{formatRupiah(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end flex-shrink-0">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
