import React, { useState, useEffect } from 'react';
import {
  Produk,
  Kategori,
  CartItem,
  Order,
  PaymentMethod,
  ProcessPaymentResult,
} from '../../types';
import { formatRupiah } from '../../utils/formatters';
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  DollarSign,
  CreditCard,
  QrCode,
  Banknote,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  User,
  X,
  Package,
  Sparkles,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

interface KasirPosViewProps {
  products: Produk[];
  categories: Kategori[];
  importedOrder: Order | null;
  onClearImportedOrder: () => void;
  onProcessPayment: (payload: {
    orderId?: number;
    customerName: string;
    items: { productId: number; qty: number }[];
    total: number;
    paymentMethod: PaymentMethod;
    paidAmount: number;
    cashierName: string;
  }) => ProcessPaymentResult;
  onOpenReceipt: (trxId: number) => void;
  cashierName: string;
}

export const KasirPosView: React.FC<KasirPosViewProps> = ({
  products,
  categories,
  importedOrder,
  onClearImportedOrder,
  onProcessPayment,
  onOpenReceipt,
  cashierName,
}) => {
  // Search & filter for products in POS
  const [productSearch, setProductSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<number | null>(null);

  // Active POS Cart
  const [posCart, setPosCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('Pelanggan Umum');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('tunai');
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [mobilePosTab, setMobilePosTab] = useState<'katalog' | 'transaksi'>('katalog');

  // If an order is passed from Catalog, initialize POS cart from it!
  useEffect(() => {
    if (importedOrder) {
      setMobilePosTab('transaksi');
      setCustomerName(importedOrder.nama_konsumen);
      setPaymentMethod(importedOrder.metode_pembayaran || 'tunai');

      // Convert order items to CartItem format
      const stagedItems: CartItem[] = [];
      importedOrder.items.forEach((item) => {
        const prod = products.find((p) => p.id_produk === item.id_produk);
        if (prod) {
          stagedItems.push({
            product: prod,
            jumlah: item.jumlah,
          });
        }
      });

      setPosCart(stagedItems);
      const total = stagedItems.reduce((acc, it) => acc + it.product.harga * it.jumlah, 0);
      setPaidAmount(total); // default to exact amount
    }
  }, [importedOrder, products]);

  // Calculations
  const totalAmount = posCart.reduce((acc, it) => acc + it.product.harga * it.jumlah, 0);
  const kembalian = Math.max(0, paidAmount - totalAmount);
  const isUnderpaid = paymentMethod === 'tunai' && paidAmount < totalAmount && totalAmount > 0;

  // Add Product to POS Cart
  const handleAddProduct = (prod: Produk) => {
    if (prod.stok <= 0) {
      alert(`Stok produk "${prod.nama}" sudah habis!`);
      return;
    }

    setPosCart((prev) => {
      const existing = prev.find((it) => it.product.id_produk === prod.id_produk);
      if (existing) {
        if (existing.jumlah >= prod.stok) {
          alert(`Jumlah item tidak boleh melebihi stok yang tersedia (${prod.stok} pcs)!`);
          return prev;
        }
        return prev.map((it) =>
          it.product.id_produk === prod.id_produk
            ? { ...it, jumlah: it.jumlah + 1 }
            : it
        );
      }
      return [...prev, { product: prod, jumlah: 1 }];
    });
  };

  const handleUpdateQty = (productId: number, delta: number) => {
    setPosCart((prev) => {
      return prev
        .map((it) => {
          if (it.product.id_produk === productId) {
            const newQty = it.jumlah + delta;
            if (newQty <= 0) return null;
            if (newQty > it.product.stok) {
              alert(`Jumlah maksimal stok adalah ${it.product.stok} pcs.`);
              return it;
            }
            return { ...it, jumlah: newQty };
          }
          return it;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = (productId: number) => {
    setPosCart((prev) => prev.filter((it) => it.product.id_produk !== productId));
  };

  const handleClearCart = () => {
    if (confirm('Kosongkan semua item di kasir?')) {
      setPosCart([]);
      setPaidAmount(0);
      if (importedOrder) onClearImportedOrder();
    }
  };

  // Quick Cash Add
  const handleQuickCash = (amount: number) => {
    setPaidAmount((prev) => prev + amount);
  };

  const handleExactCash = () => {
    setPaidAmount(totalAmount);
  };

  // Process Final Transaction
  const handleSubmitTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (posCart.length === 0) {
      setErrorMessage('Belum ada produk yang dimasukkan ke kasir!');
      return;
    }

    if (paymentMethod === 'tunai' && paidAmount < totalAmount) {
      setErrorMessage(
        `Nominal pembayaran tunai kurang dari total belanja! Total: ${formatRupiah(
          totalAmount
        )}, Dibayar: ${formatRupiah(paidAmount)}`
      );
      return;
    }

    const itemsPayload = posCart.map((it) => ({
      productId: it.product.id_produk,
      qty: it.jumlah,
    }));

    const result = onProcessPayment({
      orderId: importedOrder ? importedOrder.id_pesanan : undefined,
      customerName: customerName.trim() || 'Pelanggan Umum',
      items: itemsPayload,
      total: totalAmount,
      paymentMethod,
      paidAmount: paymentMethod === 'tunai' ? paidAmount : totalAmount,
      cashierName,
    });

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    // Success! Reset POS state and show Receipt modal
    setPosCart([]);
    setPaidAmount(0);
    setCustomerName('Pelanggan Umum');
    if (importedOrder) onClearImportedOrder();

    if (result.transaction) {
      onOpenReceipt(result.transaction.id_transaksi);
    }
  };

  // Filter products for left pane
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.nama.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.deskripsi.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = selectedCat === null || p.id_kategori === selectedCat;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pb-4 sm:pb-8 space-y-2.5 sm:space-y-4">
      {/* Top Banner if imported order exists */}
      {importedOrder && (
        <div className="p-2.5 sm:p-3.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 rounded-xl sm:rounded-2xl flex items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <div>
              <span className="font-bold text-amber-900 dark:text-amber-200 text-xs">
                Memproses Pesanan Konsumen: {importedOrder.no_pesanan}
              </span>
              <p className="text-[10px] sm:text-[11px] text-amber-700 dark:text-amber-400">
                Pemesan: <b>{importedOrder.nama_konsumen}</b> ({importedOrder.no_hp}) • Status akan otomatis berubah menjadi <b>SELESAI</b> setelah pembayaran berhasil.
              </p>
            </div>
          </div>
          <button
            onClick={onClearImportedOrder}
            className="px-2 py-1 bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 font-bold rounded-lg hover:bg-amber-300 transition-colors flex items-center gap-1 text-[11px]"
          >
            <X className="w-3.5 h-3.5" />
            <span>Lepas</span>
          </button>
        </div>
      )}

      {/* Mobile Segmented View Switcher */}
      <div className="flex lg:hidden bg-slate-200 dark:bg-slate-800/80 p-1 rounded-xl sm:rounded-2xl gap-1 text-xs font-bold shadow-xs">
        <button
          type="button"
          onClick={() => setMobilePosTab('katalog')}
          className={`flex-1 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            mobilePosTab === 'katalog'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Package className="w-4 h-4 text-emerald-600" />
          <span>Pilih Produk ({filteredProducts.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setMobilePosTab('transaksi')}
          className={`flex-1 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-1.5 relative ${
            mobilePosTab === 'transaksi'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Transaksi Kasir</span>
          {posCart.length > 0 && (
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                mobilePosTab === 'transaksi'
                  ? 'bg-white text-emerald-700'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {posCart.reduce((a, c) => a + c.jumlah, 0)}
            </span>
          )}
        </button>
      </div>

      {/* Dual Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-6 items-start">
        {/* LEFT PANE: Product Catalog Selector (7 Cols) */}
        <div
          className={`lg:col-span-7 space-y-2.5 sm:space-y-4 ${
            mobilePosTab === 'katalog' ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 sm:space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Ketik nama produk atau scan barcode..."
                className="w-full pl-9 pr-3 py-2 sm:py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Category Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
              <button
                onClick={() => setSelectedCat(null)}
                className={`px-2.5 py-1 sm:px-3 sm:py-1 rounded-lg sm:rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCat === null
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                Semua ({products.length})
              </button>
              {categories.map((c) => (
                <button
                  key={c.id_kategori}
                  onClick={() => setSelectedCat(c.id_kategori)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCat === c.id_kategori
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {c.nama_kategori}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 max-h-[580px] overflow-y-auto pr-1">
            {filteredProducts.map((prod) => {
              const isOutOfStock = prod.stok <= 0;
              const inCart = posCart.find((it) => it.product.id_produk === prod.id_produk);

              return (
                <div
                  key={prod.id_produk}
                  onClick={() => !isOutOfStock && handleAddProduct(prod)}
                  className={`bg-white dark:bg-slate-900 p-2 sm:p-3 rounded-xl sm:rounded-2xl border transition-all text-left flex flex-col justify-between group ${
                    isOutOfStock
                      ? 'opacity-50 cursor-not-allowed border-slate-200 dark:border-slate-800'
                      : inCart
                      ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20 cursor-pointer'
                      : 'border-slate-200 dark:border-slate-800 hover:border-emerald-400 hover:shadow-md cursor-pointer'
                  }`}
                >
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="aspect-4/3 w-full rounded-lg sm:rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                      <img
                        src={prod.gambar}
                        alt={prod.nama}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span
                        className={`absolute top-1 left-1 sm:top-1.5 sm:left-1.5 px-1 sm:px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold ${
                          prod.stok <= 0
                            ? 'bg-rose-600 text-white'
                            : prod.stok <= 5
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-emerald-700 text-white'
                        }`}
                      >
                        {prod.stok <= 0 ? 'Habis' : `Stok ${prod.stok}`}
                      </span>

                      {inCart && (
                        <span className="absolute bottom-1 right-1 sm:bottom-1.5 sm:right-1.5 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold bg-emerald-600 text-white shadow-xs">
                          {inCart.jumlah} di kasir
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                        {prod.nama}
                      </h4>
                    </div>
                  </div>

                  <div className="mt-1.5 pt-1.5 sm:mt-2 sm:pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                      {formatRupiah(prod.harga)}
                    </span>
                    <button
                      type="button"
                      disabled={isOutOfStock}
                      className="p-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT PANE: POS Active Billing & Checkout (5 Cols) */}
        <div
          className={`lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md flex flex-col ${
            mobilePosTab === 'transaksi' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Header */}
          <div className="p-2.5 sm:p-4 bg-slate-900 text-white rounded-t-xl sm:rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobilePosTab('katalog')}
                className="lg:hidden p-1 sm:p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 mr-1 flex items-center gap-1 text-xs"
                title="Kembali Pilih Produk"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Katalog</span>
              </button>
              <ShoppingCart className="w-4 h-4 text-emerald-400 hidden sm:block" />
              <div>
                <h3 className="text-xs sm:text-sm font-bold">Keranjang Kasir</h3>
                <span className="text-[10px] text-slate-400">Kasir: {cashierName}</span>
              </div>
            </div>

            {posCart.length > 0 && (
              <button
                onClick={handleClearCart}
                className="text-slate-400 hover:text-rose-400 text-xs flex items-center gap-1 transition-colors"
                title="Kosongkan"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Form & Items */}
          <form onSubmit={handleSubmitTransaction} className="p-2.5 sm:p-4 space-y-2.5 sm:space-y-4 flex-1 flex flex-col justify-between">
            {errorMessage && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Nama Pelanggan */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Nama Konsumen / Pelanggan:
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Pelanggan Umum"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Item Table */}
            <div className="flex-1 min-h-[160px] max-h-[220px] overflow-y-auto space-y-2 border border-slate-200 dark:border-slate-800 rounded-xl p-2 bg-slate-50 dark:bg-slate-950">
              {posCart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400 text-xs">
                  <Package className="w-8 h-8 mb-1 text-slate-300 dark:text-slate-700" />
                  <span>Belum ada item dipilih</span>
                  <span className="text-[10px] text-slate-500">
                    Klik produk di sebelah kiri untuk memasukkan ke kasir
                  </span>
                </div>
              ) : (
                posCart.map((it) => (
                  <div
                    key={it.product.id_produk}
                    className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-800 dark:text-slate-200 truncate">
                        {it.product.nama}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {formatRupiah(it.product.harga)}
                      </div>
                    </div>

                    {/* Qty +/- */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(it.product.id_produk, -1)}
                        className="w-7 h-7 sm:w-6 sm:h-6 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center justify-center font-bold text-sm text-slate-800 dark:text-slate-100 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-7 text-center font-mono font-bold text-xs">
                        {it.jumlah}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(it.product.id_produk, 1)}
                        className="w-7 h-7 sm:w-6 sm:h-6 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center justify-center font-bold text-sm text-slate-800 dark:text-slate-100 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal & Delete */}
                    <div className="text-right min-w-[70px]">
                      <div className="font-mono font-bold text-slate-900 dark:text-white">
                        {formatRupiah(it.product.harga * it.jumlah)}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(it.product.id_produk)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Total Display */}
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                TOTAL PEMBAYARAN:
              </span>
              <span className="font-mono font-extrabold text-lg text-emerald-600 dark:text-emerald-400">
                {formatRupiah(totalAmount)}
              </span>
            </div>

            {/* Payment Method Tabs */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block">
                Metode Pembayaran:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('tunai')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'tunai'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Banknote className="w-3.5 h-3.5" />
                  <span>Tunai</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('transfer');
                    setPaidAmount(totalAmount);
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'transfer'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Transfer</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('qris');
                    setPaidAmount(totalAmount);
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'qris'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>QRIS</span>
                </button>
              </div>
            </div>

            {/* Cash Payment Details (if tunai) */}
            {paymentMethod === 'tunai' && (
              <div className="space-y-2 pt-1 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Nominal Uang Diterima:
                  </label>
                  <button
                    type="button"
                    onClick={handleExactCash}
                    className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Uang Pas
                  </button>
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={paidAmount || ''}
                    onChange={(e) => setPaidAmount(Number(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Quick Add Cash Buttons */}
                <div className="grid grid-cols-4 gap-1.5">
                  {[10000, 20000, 50000, 100000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleQuickCash(amt)}
                      className="py-1 px-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[10px] font-semibold text-slate-700 dark:text-slate-300 text-center"
                    >
                      +{amt / 1000}k
                    </button>
                  ))}
                </div>

                {/* Kembalian / Underpaid Status */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">
                    Kembalian:
                  </span>
                  <span
                    className={`font-mono font-extrabold text-sm ${
                      isUnderpaid ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {isUnderpaid ? 'Uang Kurang' : formatRupiah(kembalian)}
                  </span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={posCart.length === 0 || isUnderpaid}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all mt-2"
            >
              <Receipt className="w-4 h-4" />
              <span>Selesaikan Transaksi & Cetak Struk</span>
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Floating Bottom Bar for Kasir (when browsing catalog) */}
      {mobilePosTab === 'katalog' && posCart.length > 0 && (
        <div className="fixed bottom-14 left-0 right-0 p-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-30 lg:hidden shadow-2xl flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold block">
              Total {posCart.reduce((a, c) => a + c.jumlah, 0)} Item di Kasir:
            </span>
            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
              {formatRupiah(totalAmount)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setMobilePosTab('transaksi')}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 active:scale-95 transition-all flex-shrink-0"
          >
            <span>Bayar Transaksi</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
