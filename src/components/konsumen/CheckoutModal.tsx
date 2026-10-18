import React, { useState } from 'react';
import { CartItem, Konsumen, PaymentMethod, Order, DetailPesanan } from '../../types';
import { formatRupiah, generateOrderNumber } from '../../utils/formatters';
import { ImageUploader } from '../shared/ImageUploader';
import {
  X,
  CreditCard,
  User,
  Phone,
  Banknote,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface CheckoutModalProps {
  cart: CartItem[];
  currentKonsumen: Konsumen | null;
  onClose: () => void;
  onConfirmOrder: (newOrder: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  cart,
  currentKonsumen,
  onClose,
  onConfirmOrder,
}) => {
  const [name, setName] = useState(currentKonsumen?.name || '');
  const [phone, setPhone] = useState(currentKonsumen?.no_hp || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('tunai');
  const [paymentProof, setPaymentProof] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = cart.reduce((acc, it) => acc + it.product.harga * it.jumlah, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nama lengkap pemesan wajib diisi.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setError('Nomor HP/WhatsApp aktif wajib diisi.');
      return;
    }
    if (cart.length === 0) {
      setError('Keranjang belanja kosong.');
      return;
    }

    setIsSubmitting(true);

    const orderId = Date.now();
    const orderNo = generateOrderNumber();
    const now = new Date().toISOString();

    const orderItems: DetailPesanan[] = cart.map((it, idx) => {
      const item: DetailPesanan = {
        id_detail: orderId + idx,
        id_pesanan: orderId,
        id_produk: it.product.id_produk,
        nama_produk: it.product.nama,
        jumlah: it.jumlah,
        harga: it.product.harga,
        subtotal: it.product.harga * it.jumlah,
      };
      if (it.product.gambar) {
        item.gambar = it.product.gambar;
      }
      return item;
    });

    const newOrder: Order = {
      id_pesanan: orderId,
      no_pesanan: orderNo,
      id_konsumen: currentKonsumen?.id || Date.now(),
      nama_konsumen: name.trim(),
      no_hp: phone.trim(),
      tanggal_pesanan: now,
      total,
      status: 'menunggu',
      metode_pembayaran: paymentMethod,
      catatan: notes.trim() || '',
      items: orderItems,
      ...(paymentProof.trim() ? { bukti_pembayaran: paymentProof.trim() } : {}),
    };

    setTimeout(() => {
      onConfirmOrder(newOrder);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold">Konfirmasi Pesanan Konsumen</h2>
              <p className="text-[11px] text-emerald-100">
                Pemesanan terintegrasi langsung ke sistem kasir Koperasi El-Bayan
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

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section: Data Konsumen */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              1. Identitas Pemesan
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Nama Pemesan *
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError('');
                    }}
                    placeholder="Nama Anda"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Nomor HP / WhatsApp *
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setError('');
                    }}
                    placeholder="081234567890"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Ringkasan Item */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              2. Ringkasan Produk ({cart.length} Jenis)
            </h4>
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-200 dark:border-slate-700/80 divide-y divide-slate-200 dark:divide-slate-700/60 text-xs">
              {cart.map((it) => (
                <div key={it.product.id_produk} className="py-1.5 flex justify-between items-center">
                  <div className="min-w-0 pr-2">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                      {it.product.nama}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {it.jumlah} x {formatRupiah(it.product.harga)}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {formatRupiah(it.product.harga * it.jumlah)}
                  </span>
                </div>
              ))}
              <div className="pt-2 flex justify-between font-bold text-sm text-slate-900 dark:text-white">
                <span>Total Pesanan:</span>
                <span className="text-emerald-600 dark:text-emerald-400">{formatRupiah(total)}</span>
              </div>
            </div>
          </div>

          {/* Section: Metode Pembayaran */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              3. Pilih Metode Pembayaran
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <label
                className={`p-3 rounded-xl border flex flex-col items-center text-center cursor-pointer transition-all ${
                  paymentMethod === 'tunai'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="tunai"
                  checked={paymentMethod === 'tunai'}
                  onChange={() => setPaymentMethod('tunai')}
                  className="sr-only"
                />
                <Banknote className="w-5 h-5 mb-1 text-emerald-600" />
                <span className="text-xs font-bold">Tunai</span>
                <span className="text-[9px] text-slate-500 mt-0.5">Bayar di Kasir</span>
              </label>

              <label
                className={`p-3 rounded-xl border flex flex-col items-center text-center cursor-pointer transition-all ${
                  paymentMethod === 'transfer'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="transfer"
                  checked={paymentMethod === 'transfer'}
                  onChange={() => setPaymentMethod('transfer')}
                  className="sr-only"
                />
                <CreditCard className="w-5 h-5 mb-1 text-blue-600" />
                <span className="text-xs font-bold">Transfer</span>
                <span className="text-[9px] text-slate-500 mt-0.5">BSI Syariah</span>
              </label>

              <label
                className={`p-3 rounded-xl border flex flex-col items-center text-center cursor-pointer transition-all ${
                  paymentMethod === 'qris'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="qris"
                  checked={paymentMethod === 'qris'}
                  onChange={() => setPaymentMethod('qris')}
                  className="sr-only"
                />
                <QrCode className="w-5 h-5 mb-1 text-purple-600" />
                <span className="text-xs font-bold">QRIS</span>
                <span className="text-[9px] text-slate-500 mt-0.5">Scan Instan</span>
              </label>
            </div>

            {/* Upload Bukti Pembayaran if Transfer or QRIS */}
            {paymentMethod !== 'tunai' && (
              <div className="pt-2">
                <ImageUploader
                  id="checkout-payment-proof"
                  value={paymentProof}
                  onChange={(url) => setPaymentProof(url)}
                  label="Unggah Bukti Transfer / Resi QRIS (Opsional)"
                  description="Lampirkan foto struk pembayaran atau tangkapan layar m-banking untuk verifikasi kasir."
                  presets={[]}
                />
              </div>
            )}
          </div>

          {/* Section: Catatan */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Catatan Pesanan (Opsional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Titip di asrama santri kamar 5 atau diambil jam 16.00"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" />
            <span>
              Pesanan langsung masuk ke antrean dashboard kasir dengan status <b>MENUNGGU</b>. Anda dapat memantau prosesnya di menu Pesanan Saya.
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitting ? 'Memproses Pesanan...' : 'Konfirmasi & Kirim Pesanan'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
