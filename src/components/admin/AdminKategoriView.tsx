import React, { useState } from 'react';
import { Kategori, Produk } from '../../types';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Package,
  X,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface AdminKategoriViewProps {
  categories: Kategori[];
  products: Produk[];
  onAddCategory: (cat: Omit<Kategori, 'id_kategori'>) => void;
  onUpdateCategory: (cat: Kategori) => void;
  onDeleteCategory: (categoryId: number) => { success: boolean; message: string };
}

export const AdminKategoriView: React.FC<AdminKategoriViewProps> = ({
  categories,
  products,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Kategori | null>(null);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [error, setError] = useState('');
  const [actionAlert, setActionAlert] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const openAdd = () => {
    setEditingCategory(null);
    setName('');
    setDesc('');
    setError('');
    setIsModalOpen(true);
  };

  const openEdit = (c: Kategori) => {
    setEditingCategory(c);
    setName(c.nama_kategori);
    setDesc(c.deskripsi || '');
    setError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nama kategori wajib diisi.');
      return;
    }

    if (editingCategory) {
      onUpdateCategory({
        ...editingCategory,
        nama_kategori: name.trim(),
        deskripsi: desc.trim(),
      });
      setActionAlert({ type: 'success', text: `Kategori "${name}" berhasil diperbarui.` });
    } else {
      onAddCategory({
        nama_kategori: name.trim(),
        deskripsi: desc.trim(),
      });
      setActionAlert({ type: 'success', text: `Kategori baru "${name}" berhasil ditambahkan.` });
    }

    setIsModalOpen(false);
    setTimeout(() => setActionAlert(null), 3000);
  };

  const handleDelete = (cat: Kategori) => {
    const res = onDeleteCategory(cat.id_kategori);
    if (!res.success) {
      setActionAlert({ type: 'error', text: res.message });
      setTimeout(() => setActionAlert(null), 5000);
    } else {
      setActionAlert({ type: 'success', text: res.message });
      setTimeout(() => setActionAlert(null), 3000);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-6 pb-4 sm:pb-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Kelola Kategori Produk Koperasi
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">
            Pengelompokan barang mempermudah santri dan konsumen mencari kebutuhan di katalog online.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="w-full sm:w-auto px-3.5 py-2 sm:px-4 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kategori Baru</span>
        </button>
      </div>

      {/* Alert Banner */}
      {actionAlert && (
        <div
          className={`p-3 sm:p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
            actionAlert.type === 'error'
              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
              : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
          }`}
        >
          {actionAlert.type === 'error' ? (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{actionAlert.text}</span>
        </div>
      )}

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
        {categories.map((cat) => {
          const productCount = products.filter((p) => p.id_kategori === cat.id_kategori).length;

          return (
            <div
              key={cat.id_kategori}
              className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-5 shadow-xs flex flex-col justify-between hover:border-emerald-500/50 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="px-2 py-0.5 sm:px-2.5 rounded-full text-[10px] sm:text-[11px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {productCount} Produk
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-2.5 sm:mt-3 group-hover:text-emerald-600 transition-colors">
                  {cat.nama_kategori}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {cat.deskripsi || 'Kategori produk resmi Koperasi El-Bayan.'}
                </p>
              </div>

              <div className="pt-2.5 mt-2.5 sm:pt-4 sm:mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] sm:text-[11px] text-slate-400">ID: #{cat.id_kategori}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(cat)}
                    className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded-lg transition-colors"
                    title="Edit Kategori"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition-colors"
                    title="Hapus Kategori"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add / Edit Category */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-xl sm:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-3.5 sm:p-5 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-200" />
                <h3 className="text-sm sm:text-base font-bold">
                  {editingCategory ? 'Edit Kategori Produk' : 'Tambah Kategori Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-emerald-100 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-4 sm:p-6 space-y-3 sm:space-y-4 text-xs">
              {error && (
                <div className="p-2.5 sm:p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
                  {error}
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Kategori *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Kitab Pesantren / Perlengkapan Santri"
                  className="w-full px-3 py-2 sm:py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Keterangan / Deskripsi Singkat
                </label>
                <textarea
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Penjelasan isi kelompok produk ini..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2.5 sm:pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 sm:px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 sm:px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/30"
                >
                  {editingCategory ? 'Simpan' : 'Tambah Kategori'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
