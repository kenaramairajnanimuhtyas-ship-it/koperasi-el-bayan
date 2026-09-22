import React, { useState, useMemo } from 'react';
import { Produk, Kategori } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { ImageUploader } from '../shared/ImageUploader';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Package,
  AlertTriangle,
  CheckCircle2,
  X,
  Filter,
  Image,
  SlidersHorizontal,
} from 'lucide-react';

interface AdminProdukViewProps {
  products: Produk[];
  categories: Kategori[];
  onAddProduct: (prod: Omit<Produk, 'id_produk'>) => void;
  onUpdateProduct: (prod: Produk) => void;
  onDeleteProduct: (productId: number) => void;
  openAddModalInitially?: boolean;
  onCloseAddModalInitially?: () => void;
}

// Preset images for easy testing (e.g. for creating product with 20 stock)
const SAMPLE_IMAGES = [
  { label: 'Kitab / Buku', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80' },
  { label: 'Sarung Santri', url: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=400&q=80' },
  { label: 'Kopiah / Peci', url: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=400&q=80' },
  { label: 'Minuman Segar', url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80' },
  { label: 'Snack / Makanan', url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=400&q=80' },
  { label: 'Beras / Sembako', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80' },
  { label: 'Alat Tulis / Pulpen', url: 'https://images.unsplash.com/photo-1585336261026-4186685a6ba2?auto=format&fit=crop&w=400&q=80' },
];

export const AdminProdukView: React.FC<AdminProdukViewProps> = ({
  products,
  categories,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  openAddModalInitially = false,
  onCloseAddModalInitially,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
  const [stockFilter, setStockFilter] = useState<'semua' | 'tersedia' | 'menipis' | 'habis'>('semua');
  const [sortBy, setSortBy] = useState<'nama' | 'harga_asc' | 'harga_desc' | 'stok_asc' | 'stok_desc'>('nama');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(openAddModalInitially);
  const [editingProduct, setEditingProduct] = useState<Produk | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<number>(categories[0]?.id_kategori || 1);
  const [formPrice, setFormPrice] = useState<number>(10000);
  const [formStock, setFormStock] = useState<number>(20);
  const [formDesc, setFormDesc] = useState('');
  const [formImage, setFormImage] = useState(SAMPLE_IMAGES[0].url);
  const [formError, setFormError] = useState('');

  const openAdd = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory(categories[0]?.id_kategori || 1);
    setFormPrice(15000);
    setFormStock(20); // default to 20 for thesis step 3!
    setFormDesc('Produk resmi Koperasi El-Bayan kualitas terjamin.');
    setFormImage(SAMPLE_IMAGES[0].url);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEdit = (p: Produk) => {
    setEditingProduct(p);
    setFormName(p.nama);
    setFormCategory(p.id_kategori);
    setFormPrice(p.harga);
    setFormStock(p.stok);
    setFormDesc(p.deskripsi);
    setFormImage(p.gambar);
    setFormError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    if (onCloseAddModalInitially) onCloseAddModalInitially();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('Nama produk wajib diisi.');
      return;
    }
    if (formPrice <= 0) {
      setFormError('Harga harus lebih dari 0.');
      return;
    }
    if (formStock < 0) {
      setFormError('Stok tidak boleh negatif.');
      return;
    }

    if (editingProduct) {
      onUpdateProduct({
        ...editingProduct,
        nama: formName.trim(),
        id_kategori: formCategory,
        harga: formPrice,
        stok: formStock,
        deskripsi: formDesc.trim(),
        gambar: formImage.trim() || SAMPLE_IMAGES[0].url,
      });
    } else {
      onAddProduct({
        nama: formName.trim(),
        id_kategori: formCategory,
        harga: formPrice,
        stok: formStock,
        deskripsi: formDesc.trim(),
        gambar: formImage.trim() || SAMPLE_IMAGES[0].url,
      });
    }

    closeModal();
  };

  const handleDelete = (p: Produk) => {
    if (confirm(`Yakin ingin menghapus produk "${p.nama}"?`)) {
      onDeleteProduct(p.id_produk);
    }
  };

  // Filtered & Sorted
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch =
          p.nama.toLowerCase().includes(search.toLowerCase()) ||
          p.deskripsi.toLowerCase().includes(search.toLowerCase());

        const matchesCat = categoryFilter === null || p.id_kategori === categoryFilter;

        let matchesStk = true;
        if (stockFilter === 'tersedia') matchesStk = p.stok > 0;
        if (stockFilter === 'menipis') matchesStk = p.stok > 0 && p.stok <= 5;
        if (stockFilter === 'habis') matchesStk = p.stok <= 0;

        return matchesSearch && matchesCat && matchesStk;
      })
      .sort((a, b) => {
        if (sortBy === 'harga_asc') return a.harga - b.harga;
        if (sortBy === 'harga_desc') return b.harga - a.harga;
        if (sortBy === 'stok_asc') return a.stok - b.stok;
        if (sortBy === 'stok_desc') return b.stok - a.stok;
        return a.nama.localeCompare(b.nama);
      });
  }, [products, search, categoryFilter, stockFilter, sortBy]);

  return (
    <div className="space-y-3 sm:space-y-6 pb-4 sm:pb-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Kelola Master Data Produk Koperasi
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">
            Tambah produk, atur nama, kategori, harga, dan stok barang. Perubahan langsung otomatis tersinkronisasi ke katalog konsumen dan kasir.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="w-full sm:w-auto px-3.5 py-2 sm:px-4 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Produk Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 sm:space-y-3">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama produk atau deskripsi..."
              className="w-full pl-9 pr-3 py-2 sm:py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full sm:w-auto px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="nama">Urut: Nama (A-Z)</option>
              <option value="harga_asc">Harga: Rendah ke Tinggi</option>
              <option value="harga_desc">Harga: Tinggi ke Rendah</option>
              <option value="stok_asc">Stok: Sedikit ke Banyak</option>
              <option value="stok_desc">Stok: Banyak ke Sedikit</option>
            </select>
          </div>
        </div>

        {/* Categories & Stock Status Chips */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 pt-1.5 sm:pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            <button
              onClick={() => setCategoryFilter(null)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                categoryFilter === null
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Semua Kategori
            </button>
            {categories.map((c) => (
              <button
                key={c.id_kategori}
                onClick={() => setCategoryFilter(c.id_kategori)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  categoryFilter === c.id_kategori
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {c.nama_kategori}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5">
            {[
              { id: 'semua', label: 'Semua Stok' },
              { id: 'tersedia', label: 'Tersedia' },
              { id: 'menipis', label: 'Menipis (≤5)' },
              { id: 'habis', label: 'Habis (0)' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setStockFilter(s.id as any)}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all ${
                  stockFilter === s.id
                    ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products List / Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        {/* Mobile View: Cards */}
        <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {filteredProducts.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              Tidak ada produk yang cocok dengan pencarian / filter.
            </div>
          ) : (
            filteredProducts.map((prod) => {
              const cat = categories.find((c) => c.id_kategori === prod.id_kategori);
              const isOutOfStock = prod.stok <= 0;
              const isLowStock = prod.stok > 0 && prod.stok <= 5;

              return (
                <div key={prod.id_produk} className="p-3 space-y-2">
                  <div className="flex items-start gap-2.5">
                    <img
                      src={prod.gambar}
                      alt={prod.nama}
                      className="w-12 h-12 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2">
                          {prod.nama}
                        </h4>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex-shrink-0">
                          {cat ? cat.nama_kategori : 'Umum'}
                        </span>
                      </div>
                      <div className="font-mono font-extrabold text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {formatRupiah(prod.harga)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 text-[10px]">Stok:</span>
                      <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                        {prod.stok} pcs
                      </span>
                    </div>

                    {isOutOfStock ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                        HABIS
                      </span>
                    ) : isLowStock ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        MENIPIS
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        TERSEDIA
                      </span>
                    )}
                  </div>

                  {/* Mobile Actions */}
                  <div className="flex items-center gap-2 pt-0.5">
                    <button
                      onClick={() => openEdit(prod)}
                      className="flex-1 py-1.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-600 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(prod)}
                      className="py-1.5 px-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3">Produk</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Harga</th>
                <th className="px-4 py-3">Stok Saat Ini</th>
                <th className="px-4 py-3">Status Stok</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                    Tidak ada produk yang cocok dengan pencarian / filter.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => {
                  const cat = categories.find((c) => c.id_kategori === prod.id_kategori);
                  const isOutOfStock = prod.stok <= 0;
                  const isLowStock = prod.stok > 0 && prod.stok <= 5;

                  return (
                    <tr
                      key={prod.id_produk}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.gambar}
                            alt={prod.nama}
                            className="w-10 h-10 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 dark:text-white truncate max-w-[240px]">
                              {prod.nama}
                            </div>
                            <div className="text-[11px] text-slate-500 line-clamp-1 max-w-[280px]">
                              {prod.deskripsi}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {cat ? cat.nama_kategori : 'Umum'}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {formatRupiah(prod.harga)}
                      </td>
                      <td className="px-4 py-3 font-mono font-extrabold text-slate-900 dark:text-white">
                        {prod.stok} <span className="text-[10px] text-slate-400 font-normal">pcs</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                            HABIS
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            MENIPIS
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            TERSEDIA
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEdit(prod)}
                            className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded-lg transition-colors"
                            title="Edit Produk"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(prod)}
                            className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition-colors"
                            title="Hapus Produk"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-200" />
                <h3 className="text-base font-bold">
                  {editingProduct ? 'Edit Master Data Produk' : 'Tambah Produk Baru Koperasi'}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              {formError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl">
                  {formError}
                </div>
              )}

              {/* Nama Produk */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Produk *
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Kitab Fathul Qorib / Sarung Santri El-Bayan"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Kategori & Harga */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id_kategori} value={c.id_kategori}>
                        {c.nama_kategori}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Harga Satuan (Rp) *
                  </label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    placeholder="15000"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Stok */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Jumlah Stok Barang (Pcs) *
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormStock(20)}
                    className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Set Tepat 20 (Skenario Skripsi)
                  </button>
                </div>
                <input
                  type="number"
                  value={formStock}
                  onChange={(e) => setFormStock(Number(e.target.value))}
                  placeholder="20"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi Produk
                </label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Penjelasan produk, spesifikasi, atau catatan penting..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Gambar Produk: Upload file, Drag and Drop, Preset, atau URL */}
              <ImageUploader
                id="admin-form-product-image"
                value={formImage}
                onChange={(newUrl) => setFormImage(newUrl)}
                label="Foto Produk *"
                description="Unggah foto langsung dari kamera/galeri, seret file, atau gunakan foto preset koperasi."
                presets={SAMPLE_IMAGES}
              />

              {/* Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/30"
                >
                  {editingProduct ? 'Simpan Perubahan' : 'Tambah Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
