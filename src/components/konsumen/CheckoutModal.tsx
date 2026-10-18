import React, { useState, useEffect } from 'react';
import { CartItem, Konsumen, PaymentMethod, Order, DetailPesanan, StoreSettings } from '../../types';
import { formatRupiah, generateOrderNumber } from '../../utils/formatters';
import { ImageUploader } from '../shared/ImageUploader';
import { QrisModal } from '../shared/QrisModal';
import { generateDefaultQrisDataUrl } from '../../utils/qrisGenerator';
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
  Copy,
  Check,
  Maximize2,
  Download,
  Info,
} from 'lucide-react';

interface CheckoutModalProps {
  cart: CartItem[];
  currentKonsumen: Konsumen | null;
  storeSettings?: StoreSettings;
  onClose: () => void;
  onConfirmOrder: (newOrder: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  cart,
  currentKonsumen,
  storeSettings,
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
  const [isQrisZoomOpen, setIsQrisZoomOpen] = useState(false);
  const [qrisDisplayUrl, setQrisDisplayUrl] = useState<string>(storeSettings?.qrisImageUrl || '');
  const [copiedBank, setCopiedBank] = useState(false);
  const [copiedTotal, setCopiedTotal] = useState(false);

  const total = cart.reduce((acc, it) => acc + it.product.harga * it.jumlah, 0);

  const merchantName =
    storeSettings?.qrisMerchantName || storeSettings?.namaKoperasi || 'KOPERASI EL-BAYAN';
  const nmid = storeSettings?.qrisNmid || 'ID1020260210001';

  // Ensure high-resolution QRIS is ready for display
  useEffect(() => {
    if (storeSettings?.qrisImageUrl) {
      setQrisDisplayUrl(storeSettings.qrisImageUrl);
    } else {
      generateDefaultQrisDataUrl({
        merchantName,
        nmid,
        nominal: total,
      }).then((url) => {
        setQrisDisplayUrl(url);
      });
    }
  }, [storeSettings?.qrisImageUrl, merchantName, nmid, total]);

  const handleCopyTotal = () => {
    navigator.clipboard.writeText(String(total));
    setCopiedTotal(true);
    setTimeout(() => setCopiedTotal(false), 2000);
  };

  const handleCopyBankAcc = () => {
    if (storeSettings?.rekeningBank?.nomor) {
      navigator.clipboard.writeText(storeSettings.rekeningBank.nomor);
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2000);
    }
  };

  const handleDownloadQris = () => {
    if (!qrisDisplayUrl) return;
    const a = document.createElement('a');
    a.href = qrisDisplayUrl;
    a.download = `QRIS-${merchantName.replace(/\s+/g, '-')}-Rp${total}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nama lengkap pemesan wajib diisi.');
      return;
    }
    if (!phone.trim()) {
      setError('Nomor WhatsApp / HP wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const orderNumber = generateOrderNumber();
      const orderItems: DetailPesanan[] = cart.map((c, idx) => ({
        id_detail: Date.now() + idx,
        id_pesanan: 0,
        id_produk: c.product.id_produk,
        nama_produk: c.product.nama,
        gambar: c.product.gambar,
        jumlah: c.jumlah,
        harga: c.product.harga,
        subtotal: c.product.harga * c.jumlah,
      }));

      const newOrder: Order = {
        id_pesanan: Date.now(),
        no_pesanan: orderNumber,
        id_konsumen: currentKonsumen?.id || Date.now(),
        nama_konsumen: name.trim(),
        no_hp: phone.trim(),
        tanggal_pesanan: new Date().toISOString(),
        total,
        status: 'menunggu',
        metode_pembayaran: paymentMethod,
        catatan: notes.trim() || undefined,
        bukti_pembayaran: paymentProof || undefined,
        items: orderItems,
      };

      onConfirmOrder(newOrder);
    } catch (err) {
      setError('Gagal membuat pesanan. Silakan periksa kembali formulir.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Modal */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Formulir Konfirmasi Checkout
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Lengkapi identitas pemesan & metode pembayaran Anda
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section: Identitas Pemesan */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span>1. Identitas Pemesan (Santri / Ustadz / Wali)</span>
            </h4>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Nama Lengkap *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Muhammad Ilham (Kamar Al-Ghazali)"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Nomor WhatsApp Aktif *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* Section: Ringkasan Item */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                2. Ringkasan Belanja ({cart.reduce((a, c) => a + c.jumlah, 0)} Barang)
              </span>
              <span className="text-slate-500 text-[11px]">Subtotal</span>
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {cart.map((it) => (
                <div key={it.product.id_produk} className="flex justify-between items-center text-xs">
                  <div className="truncate pr-2">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{it.product.nama}</span>
                    <span className="text-slate-400 block text-[10px]">
                      {it.jumlah} x {formatRupiah(it.product.harga)}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {formatRupiah(it.product.harga * it.jumlah)}
                  </span>
                </div>
              ))}
              <div className="pt-2 flex justify-between font-bold text-sm text-slate-900 dark:text-white">
                <span>Total Tagihan:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono">{formatRupiah(total)}</span>
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
                <span className="text-[9px] text-slate-500 mt-0.5">Bank Syariah</span>
              </label>

              <label
                className={`p-3 rounded-xl border flex flex-col items-center text-center cursor-pointer transition-all ${
                  paymentMethod === 'qris'
                    ? 'border-red-600 bg-red-50 dark:bg-red-950/50 text-red-800 dark:text-red-300 ring-2 ring-red-500/20'
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
                <QrCode className="w-5 h-5 mb-1 text-red-600" />
                <span className="text-xs font-bold">QRIS</span>
                <span className="text-[9px] text-slate-500 mt-0.5">Scan Instan</span>
              </label>
            </div>

            {/* DETAIL PEMBAYARAN QRIS: TAMPIL JELAS, TAJAM & BISA DI-SCAN/DIUNDUH */}
            {paymentMethod === 'qris' && (
              <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-red-200 dark:border-red-900/60 shadow-sm space-y-3 animate-fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-red-100 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-black text-[11px] bg-red-600 text-white tracking-wider">
                      QRIS
                    </span>
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      {merchantName}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">NMID: {nmid}</span>
                </div>

                {/* Box Nominal & Salin */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs">
                  <div>
                    <span className="text-[10px] text-red-600 dark:text-red-400 font-bold block">
                      Nominal Pembayaran:
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white font-mono">
                      {formatRupiah(total)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyTotal}
                    className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold flex items-center gap-1 transition-all"
                  >
                    {copiedTotal ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedTotal ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>

                {/* Container Gambar QRIS Resolusi Tinggi */}
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-slate-200 shadow-inner">
                  {qrisDisplayUrl ? (
                    <img
                      src={qrisDisplayUrl}
                      alt={`QRIS ${merchantName}`}
                      className="max-h-56 w-auto object-contain rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
                      style={{ imageRendering: 'pixelated' }}
                      onClick={() => setIsQrisZoomOpen(true)}
                    />
                  ) : (
                    <div className="py-8 flex flex-col items-center text-slate-400">
                      <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin mb-2" />
                      <span>Memuat Barcode QRIS...</span>
                    </div>
                  )}

                  <span className="text-[10px] text-slate-400 mt-2 text-center">
                    Klik gambar untuk memperbesar layar penuh agar mudah dipindai kamera
                  </span>
                </div>

                {/* Tombol Perbesar & Unduh */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsQrisZoomOpen(true)}
                    className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-red-600" />
                    <span>Perbesar QRIS</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadQris}
                    className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Unduh Gambar</span>
                  </button>
                </div>

                <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    Cara Bayar via Aplikasi Apapun:
                  </p>
                  <p>
                    1. Buka m-Banking (BSI, BCA, Mandiri, BRI) atau e-Wallet (GoPay, OVO, ShopeePay, DANA).
                  </p>
                  <p>
                    2. Scan QRIS di atas langsung dari kamera atau pilih dari <b>Galeri</b> jika gambar sudah diunduh.
                  </p>
                  <p>
                    3. Periksa nama penerima: <b>{merchantName}</b>, bayar sesuai nominal, lalu unggah struk di bawah.
                  </p>
                </div>
              </div>
            )}

            {/* DETAIL PEMBAYARAN TRANSFER BANK */}
            {paymentMethod === 'transfer' && (
              <div className="p-3 sm:p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-2.5 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-blue-900 dark:text-blue-300">
                    Rekening Pembayaran Resmi:
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold">
                    {storeSettings?.rekeningBank?.bank || 'Bank Syariah Indonesia'}
                  </span>
                </div>

                <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-blue-100 dark:border-blue-900 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Nomor Rekening:</span>
                    <span className="font-mono font-extrabold text-sm text-slate-900 dark:text-white">
                      {storeSettings?.rekeningBank?.nomor || '712-3456-789'}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      a.n. {storeSettings?.rekeningBank?.atasNama || 'KOPERASI EL-BAYAN'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyBankAcc}
                    className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 transition-all"
                  >
                    {copiedBank ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedBank ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>
            )}

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
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Memproses Pesanan...' : 'Konfirmasi & Kirim Pesanan'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Lightbox Modal QRIS Resolusi Penuh */}
      {storeSettings && (
        <QrisModal
          isOpen={isQrisZoomOpen}
          onClose={() => setIsQrisZoomOpen(false)}
          settings={storeSettings}
          nominal={total}
          title="Scan Kode QRIS untuk Bayar Pesanan"
        />
      )}
    </div>
  );
};
