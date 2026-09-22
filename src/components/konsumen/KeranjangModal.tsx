import React from 'react';
import { CartItem } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import {
  X,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  AlertTriangle,
  Package,
} from 'lucide-react';

interface KeranjangModalProps {
  isOpen: boolean;
  cart: CartItem[];
  onClose: () => void;
  onUpdateQty: (productId: number, newQty: number) => void;
  onRemoveItem: (productId: number) => void;
  onProceedCheckout: () => void;
}

export const KeranjangModal: React.FC<KeranjangModalProps> = ({
  isOpen,
  cart,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onProceedCheckout,
}) => {
  if (!isOpen) return null;

  const totalItems = cart.reduce((acc, it) => acc + it.jumlah, 0);
  const totalPrice = cart.reduce((acc, it) => acc + it.product.harga * it.jumlah, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 bg-emerald-700 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold">Keranjang Belanja</h2>
              <p className="text-[11px] text-emerald-100">
                {totalItems} item produk terpilih
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Package className="w-16 h-16 mb-3 text-slate-300 dark:text-slate-700" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Keranjang Masih Kosong
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-[240px]">
                Silakan jelajahi katalog produk Koperasi El-Bayan dan pilih barang yang Anda butuhkan.
              </p>
            </div>
          ) : (
            cart.map((item) => {
              const { product, jumlah } = item;
              const subtotal = product.harga * jumlah;
              const isMaxStock = jumlah >= product.stok;

              return (
                <div
                  key={product.id_produk}
                  className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex gap-3 items-center group transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl bg-slate-200 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                    <img
                      src={product.gambar}
                      alt={product.nama}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {product.nama}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(product.id_produk)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                        title="Hapus dari keranjang"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {formatRupiah(product.harga)}
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200 dark:border-slate-700/60">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onUpdateQty(product.id_produk, jumlah - 1)}
                          className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 font-bold active:scale-95 transition-all"
                          aria-label="Kurangi jumlah"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-mono font-bold text-slate-900 dark:text-white">
                          {jumlah}
                        </span>
                        <button
                          onClick={() => onUpdateQty(product.id_produk, jumlah + 1)}
                          disabled={isMaxStock}
                          className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 font-bold disabled:opacity-40 active:scale-95 transition-all"
                          title={isMaxStock ? 'Batas stok tercapai' : 'Tambah'}
                          aria-label="Tambah jumlah"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                        {formatRupiah(subtotal)}
                      </div>
                    </div>

                    {isMaxStock && (
                      <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Mencapai stok maksimal ({product.stok} pcs)</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 space-y-3 flex-shrink-0">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Total Item Belanja:</span>
                <span className="font-semibold">{totalItems} pcs</span>
              </div>
              <div className="flex justify-between text-slate-800 dark:text-slate-200 font-bold text-base pt-1 border-t border-slate-200 dark:border-slate-800">
                <span>Total Bayar:</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  {formatRupiah(totalPrice)}
                </span>
              </div>
            </div>

            <button
              onClick={onProceedCheckout}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <span>Lanjut ke Checkout Pesanan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
