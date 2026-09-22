import React, { useState, useMemo } from 'react';
import { Produk, Kategori, CartItem } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import {
  Search,
  ShoppingCart,
  Check,
  AlertTriangle,
  Info,
  X,
  Plus,
  Minus,
  SlidersHorizontal,
  Package,
  ArrowRight,
} from 'lucide-react';

interface KatalogViewProps {
  products: Produk[];
  categories: Kategori[];
  cart: CartItem[];
  onAddToCart: (product: Produk, qty: number) => void;
  onOpenCart: () => void;
}

export const KatalogView: React.FC<KatalogViewProps> = ({
  products,
  categories,
  cart,
  onAddToCart,
  onOpenCart,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null); // null = Semua
  const [stockFilter, setStockFilter] = useState<'semua' | 'tersedia' | 'menipis'>('semua');
  const [sortBy, setSortBy] = useState<'nama' | 'harga_asc' | 'harga_desc' | 'stok_desc'>('nama');
  const [selectedProductDetail, setSelectedProductDetail] = useState<Produk | null>(null);
  const [detailQty, setDetailQty] = useState<number>(1);
  const [addedPopupId, setAddedPopupId] = useState<number | null>(null);

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search
        const matchesSearch =
          p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());

        // Category
        const matchesCategory =
          selectedCategory === null || p.id_kategori === selectedCategory;

        // Stock
        let matchesStock = true;
        if (stockFilter === 'tersedia') matchesStock = p.stok > 0;
        if (stockFilter === 'menipis') matchesStock = p.stok > 0 && p.stok <= 5;

        return matchesSearch && matchesCategory && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === 'harga_asc') return a.harga - b.harga;
        if (sortBy === 'harga_desc') return b.harga - a.harga;
        if (sortBy === 'stok_desc') return b.stok - a.stok;
        return a.nama.localeCompare(b.nama);
      });
  }, [products, searchQuery, selectedCategory, stockFilter, sortBy]);

  const handleQuickAdd = (p: Produk, e: React.MouseEvent) => {
    e.stopPropagation();
    if (p.stok <= 0) return;

    // Check existing cart quantity
    const existingInCart = cart.find((item) => item.product.id_produk === p.id_produk);
    const currentCartQty = existingInCart ? existingInCart.jumlah : 0;
    if (currentCartQty >= p.stok) {
      alert(`Jumlah di keranjang sudah mencapai batas stok (${p.stok} pcs)!`);
      return;
    }

    onAddToCart(p, 1);
    setAddedPopupId(p.id_produk);
    setTimeout(() => setAddedPopupId(null), 1500);
  };

  const handleOpenDetail = (p: Produk) => {
    setSelectedProductDetail(p);
    setDetailQty(1);
  };

  const handleAddFromDetail = () => {
    if (!selectedProductDetail) return;
    const existingInCart = cart.find(
      (item) => item.product.id_produk === selectedProductDetail.id_produk
    );
    const currentCartQty = existingInCart ? existingInCart.jumlah : 0;

    if (currentCartQty + detailQty > selectedProductDetail.stok) {
      alert(
        `Total pembelian melebihi stok yang tersedia (${selectedProductDetail.stok} pcs)!`
      );
      return;
    }

    onAddToCart(selectedProductDetail, detailQty);
    setSelectedProductDetail(null);
  };

  return (
    <div className="space-y-3 sm:space-y-6 pb-4 sm:pb-8">
      {/* Hero Promo Banner Koperasi */}
      <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-900 text-white p-3.5 sm:p-7 shadow-xl shadow-emerald-900/20 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-snug">
            Belanja Kebutuhan Santri & Pondok Pesantren Jadi Lebih Mudah
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 sm:mt-2 leading-relaxed">
            Pilih produk langsung dari katalog online, pesan tanpa antre, dan selesaikan transaksi di kasir dengan mudah, cepat, dan transparan.
          </p>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-500/20 to-transparent pointer-events-none"></div>
      </div>

      {/* Search & Filtering Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5 sm:space-y-3">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari buku santri, minuman, sembako, sarung..."
              className="w-full pl-9 pr-4 py-2 sm:py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full sm:w-auto px-3 py-2 sm:py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="nama">Urutkan: Nama (A-Z)</option>
              <option value="harga_asc">Urutkan: Harga Terendah</option>
              <option value="harga_desc">Urutkan: Harga Tertinggi</option>
              <option value="stok_desc">Urutkan: Stok Terbanyak</option>
            </select>
          </div>
        </div>

        {/* Horizontal Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === null
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Semua ({products.length})
          </button>
          {categories.map((cat) => {
            const count = products.filter((p) => p.id_kategori === cat.id_kategori).length;
            const isSelected = selectedCategory === cat.id_kategori;
            return (
              <button
                key={cat.id_kategori}
                onClick={() => setSelectedCategory(cat.id_kategori)}
                className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.nama_kategori} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center border border-slate-200 dark:border-slate-800">
          <Package className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 dark:text-slate-700 mx-auto mb-2 sm:mb-3" />
          <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
            Tidak ada produk yang sesuai
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau pilih kategori produk yang lain.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-5">
          {filteredProducts.map((product) => {
            const isOutOfStock = product.stok <= 0;
            const isLowStock = product.stok > 0 && product.stok <= 5;
            const cat = categories.find((c) => c.id_kategori === product.id_kategori);

            return (
              <div
                key={product.id_produk}
                onClick={() => handleOpenDetail(product)}
                className="group bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-lg hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all cursor-pointer flex flex-col"
              >
                {/* Product Image */}
                <div className="relative aspect-4/3 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <img
                    src={product.gambar}
                    alt={product.nama}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {/* Stock Badge Overlay */}
                  <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2">
                    {isOutOfStock ? (
                      <span className="px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-extrabold bg-rose-600 text-white shadow-xs">
                        Habis
                      </span>
                    ) : isLowStock ? (
                      <span className="px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-extrabold bg-amber-500 text-slate-950 shadow-xs">
                        Sisa {product.stok}
                      </span>
                    ) : (
                      <span className="px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-emerald-600/90 text-white shadow-xs">
                        Stok {product.stok}
                      </span>
                    )}
                  </div>

                  {cat && (
                    <div className="absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2">
                      <span className="px-1.5 sm:px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-semibold bg-slate-900/70 text-white backdrop-blur-xs">
                        {cat.nama_kategori}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info & CTA */}
                <div className="p-2 sm:p-3.5 flex-1 flex flex-col justify-between space-y-1.5 sm:space-y-2.5">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight sm:leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {product.nama}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {product.deskripsi}
                    </p>
                  </div>

                  <div className="pt-1.5 sm:pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1 sm:gap-2">
                    <div>
                      <div className="text-[9px] sm:text-[10px] text-slate-400 font-medium">Harga</div>
                      <div className="text-xs sm:text-sm font-extrabold text-emerald-700 dark:text-emerald-400">
                        {formatRupiah(product.harga)}
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleQuickAdd(product, e)}
                      disabled={isOutOfStock}
                      className={`p-1.5 sm:p-2 min-w-[32px] min-h-[32px] sm:min-w-[38px] sm:min-h-[38px] rounded-lg sm:rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                        isOutOfStock
                          ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
                          : addedPopupId === product.id_produk
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white'
                      }`}
                      title={isOutOfStock ? 'Stok habis' : 'Tambah ke Keranjang'}
                    >
                      {addedPopupId === product.id_produk ? (
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      ) : (
                        <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Detail Produk */}
      {selectedProductDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-150">
            {/* Header */}
            <div className="relative aspect-16/9 w-full bg-slate-100 dark:bg-slate-800 flex-shrink-0">
              <img
                src={selectedProductDetail.gambar}
                alt={selectedProductDetail.nama}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedProductDetail(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  {categories.find((c) => c.id_kategori === selectedProductDetail.id_kategori)?.nama_kategori}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    selectedProductDetail.stok <= 0
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      : selectedProductDetail.stok <= 5
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                >
                  Stok: {selectedProductDetail.stok} pcs
                </span>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedProductDetail.nama}
                </h2>
                <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                  {formatRupiah(selectedProductDetail.harga)}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Deskripsi Produk:
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                  {selectedProductDetail.deskripsi}
                </p>
              </div>

              {/* Quantity Picker */}
              {selectedProductDetail.stok > 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Pilih Jumlah Pembelian:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDetailQty((prev) => Math.max(1, prev - 1))}
                        disabled={detailQty <= 1}
                        className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 disabled:opacity-40"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center font-mono font-bold text-sm text-slate-900 dark:text-white">
                        {detailQty}
                      </span>
                      <button
                        onClick={() =>
                          setDetailQty((prev) =>
                            Math.min(selectedProductDetail.stok, prev + 1)
                          )
                        }
                        disabled={detailQty >= selectedProductDetail.stok}
                        className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 disabled:opacity-40"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500">Subtotal:</span>
                    <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                      {formatRupiah(selectedProductDetail.harga * detailQty)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                  Maaf, stok barang ini sedang habis. Silakan cek kembali nanti atau hubungi petugas koperasi.
                </div>
              )}
            </div>

            {/* Bottom Button */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2 flex-shrink-0">
              <button
                onClick={() => setSelectedProductDetail(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={handleAddFromDetail}
                disabled={selectedProductDetail.stok <= 0}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/30 flex items-center gap-2 transition-all"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Tambah ke Keranjang</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Floating Cart Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-14 left-0 right-0 p-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-30 md:hidden shadow-2xl flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold block">
              Keranjang Belanja ({cart.reduce((a, c) => a + c.jumlah, 0)} item):
            </span>
            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {formatRupiah(cart.reduce((a, c) => a + c.product.harga * c.jumlah, 0))}
            </span>
          </div>
          <button
            onClick={onOpenCart}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 active:scale-95 transition-all flex-shrink-0"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Lihat Keranjang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
