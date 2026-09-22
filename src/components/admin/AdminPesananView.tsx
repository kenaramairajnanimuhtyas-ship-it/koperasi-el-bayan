import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';
import {
  Search,
  Clock,
  Package,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  FileText,
  FileImage,
} from 'lucide-react';

interface AdminPesananViewProps {
  orders: Order[];
  onUpdateStatus: (orderId: number, newStatus: OrderStatus) => void;
}

export const AdminPesananView: React.FC<AdminPesananViewProps> = ({
  orders,
  onUpdateStatus,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('semua');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.no_pesanan.toLowerCase().includes(search.toLowerCase()) ||
      o.nama_konsumen.toLowerCase().includes(search.toLowerCase()) ||
      o.no_hp.includes(search);

    const matchesStatus = statusFilter === 'semua' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'menunggu':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            <Clock className="w-3 h-3 animate-spin-slow" />
            <span>MENUNGGU</span>
          </span>
        );
      case 'diproses':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            <Package className="w-3 h-3" />
            <span>DIPROSES</span>
          </span>
        );
      case 'selesai':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <CheckCircle2 className="w-3 h-3" />
            <span>SELESAI</span>
          </span>
        );
      case 'batal':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
            <XCircle className="w-3 h-3" />
            <span>BATAL</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-3 sm:space-y-6 pb-4 sm:pb-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Kelola Seluruh Pesanan Konsumen
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">
            Data pesanan yang masuk melalui website katalog terintegrasi langsung dengan inventaris dan kasir.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nomor pesanan, nama konsumen, atau WhatsApp..."
            className="w-full pl-9 pr-3 py-2 sm:py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          {[
            { id: 'semua', label: 'Semua' },
            { id: 'menunggu', label: 'Menunggu' },
            { id: 'diproses', label: 'Diproses' },
            { id: 'selesai', label: 'Selesai' },
            { id: 'batal', label: 'Batal' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List / Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        {/* Mobile View: Cards */}
        <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {filteredOrders.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              Tidak ditemukan data pesanan yang sesuai filter.
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id_pesanan} className="p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                    {order.no_pesanan}
                  </span>
                  {getStatusBadge(order.status)}
                </div>

                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-[11px]">Konsumen:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {order.nama_konsumen} ({order.no_hp})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-[11px]">Waktu:</span>
                    <span className="text-slate-600 dark:text-slate-300 text-[11px]">
                      {formatDateIndo(order.tanggal_pesanan)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-[11px]">Item:</span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {order.items.reduce((sum, it) => sum + it.jumlah, 0)} produk
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1.5 border-t border-slate-100 dark:border-slate-800">
                    <span className="font-semibold text-slate-600 dark:text-slate-400 text-xs">Total:</span>
                    <span className="font-mono font-extrabold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">
                      {formatRupiah(order.total)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedOrder(order)}
                  className="w-full py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat Detail & Ubah Status</span>
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
                <th className="px-4 py-3">No. Pesanan</th>
                <th className="px-4 py-3">Waktu</th>
                <th className="px-4 py-3">Konsumen</th>
                <th className="px-4 py-3">Total Belanja</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                    Tidak ditemukan data pesanan yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id_pesanan}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">
                      {order.no_pesanan}
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {formatDateIndo(order.tanggal_pesanan)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {order.nama_konsumen}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">{order.no_hp}</div>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {formatRupiah(order.total)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{getStatusBadge(order.status)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg font-semibold flex items-center gap-1.5 ml-auto transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detail</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Admin Pesanan */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-base font-bold">Detail Pesanan Konsumen</h3>
                <span className="font-mono text-xs text-emerald-100">{selectedOrder.no_pesanan}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg text-emerald-100 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">STATUS</span>
                  <div className="mt-0.5">{getStatusBadge(selectedOrder.status)}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold block">METODE</span>
                  <span className="font-bold text-emerald-600 uppercase">{selectedOrder.metode_pembayaran}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Pemesan:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedOrder.nama_konsumen}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nomor HP / WhatsApp:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{selectedOrder.no_hp}</span>
                </div>
                {selectedOrder.catatan && (
                  <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500">Catatan:</span>
                    <span className="text-slate-700 dark:text-slate-300">{selectedOrder.catatan}</span>
                  </div>
                )}
              </div>

              {/* Bukti Pembayaran / Transfer */}
              {selectedOrder.bukti_pembayaran && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-2 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <FileImage className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Lampiran Bukti Pembayaran</span>
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                      Terlampir
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

              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
                  Daftar Barang Belanja
                </h4>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="p-2.5 flex justify-between items-center bg-white dark:bg-slate-900">
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">{it.nama_produk}</div>
                        <div className="text-[11px] text-slate-500">
                          {it.jumlah} x {formatRupiah(it.harga)}
                        </div>
                      </div>
                      <div className="font-mono font-bold text-slate-900 dark:text-white">
                        {formatRupiah(it.subtotal)}
                      </div>
                    </div>
                  ))}
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-950 flex justify-between font-bold text-sm">
                    <span>Total Pesanan:</span>
                    <span className="text-emerald-600">{formatRupiah(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Status Update Options */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-2">
                  Ubah Status Pesanan (Hak Akses Admin):
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['menunggu', 'diproses', 'selesai', 'batal'] as OrderStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        onUpdateStatus(selectedOrder.id_pesanan, st);
                        setSelectedOrder({ ...selectedOrder, status: st });
                      }}
                      className={`py-1.5 rounded-lg font-bold text-[10px] uppercase transition-all ${
                        selectedOrder.status === st
                          ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900 ring-2 ring-emerald-500'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end flex-shrink-0">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200"
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
