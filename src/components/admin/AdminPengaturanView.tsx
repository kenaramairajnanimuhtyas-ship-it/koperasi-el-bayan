import React, { useState, useRef, useEffect, DragEvent, ChangeEvent } from 'react';
import { StoreSettings } from '../../types';
import { QrisModal } from '../shared/QrisModal';
import { generateDefaultQrisDataUrl, compressQrisImageFile } from '../../utils/qrisGenerator';
import { downloadPureSqlFile, copySqlToClipboard } from '../../utils/sqlDownloader';
import {
  Settings,
  Store,
  MapPin,
  Phone,
  FileText,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Database,
  Download,
  Copy,
  Code,
  QrCode,
  Upload,
  Sparkles,
  Eye,
  Trash2,
  Check,
  RefreshCw,
  Printer,
  ShieldCheck,
  Globe,
  CreditCard,
} from 'lucide-react';

interface AdminPengaturanViewProps {
  settings: StoreSettings;
  onSaveSettings: (settings: StoreSettings) => void;
  onResetDemoData: () => void;
}

export const AdminPengaturanView: React.FC<AdminPengaturanViewProps> = ({
  settings,
  onSaveSettings,
  onResetDemoData,
}) => {
  const [formData, setFormData] = useState<StoreSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isUploadingQris, setIsUploadingQris] = useState(false);
  const [qrisUploadError, setQrisUploadError] = useState('');
  const [isDraggingQris, setIsDraggingQris] = useState(false);
  const [previewQrisModalOpen, setPreviewQrisModalOpen] = useState(false);
  const [isGeneratingStandardQris, setIsGeneratingStandardQris] = useState(false);
  const [qrisUrlInput, setQrisUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const qrisFileInputRef = useRef<HTMLInputElement>(null);

  // Sync internal state if external settings change (e.g. from Firestore update)
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      ...settings,
      rekeningBank: {
        ...prev.rekeningBank,
        ...(settings.rekeningBank || {}),
      },
    }));
  }, [settings]);

  // If no QRIS image set initially, generate crisp official default
  useEffect(() => {
    if (!formData.qrisImageUrl) {
      generateDefaultQrisDataUrl({
        merchantName: formData.qrisMerchantName || formData.namaKoperasi || 'KOPERASI EL-BAYAN',
        nmid: formData.qrisNmid || 'ID1020260210001',
      }).then((defaultUrl) => {
        setFormData((prev) => ({
          ...prev,
          qrisImageUrl: defaultUrl,
        }));
      });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleProcessQrisFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setQrisUploadError('Format file tidak didukung. Harap pilih gambar (PNG, JPG, SVG, WebP).');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setQrisUploadError('Ukuran file terlalu besar (maksimal 15 MB).');
      return;
    }

    setQrisUploadError('');
    setIsUploadingQris(true);

    try {
      // Compress with high sharpness keeping QR matrix readable
      const compressedDataUrl = await compressQrisImageFile(file, 1200, 1600, 0.94);
      const updated = {
        ...formData,
        qrisImageUrl: compressedDataUrl,
        qrisUpdatedAt: new Date().toISOString(),
      };
      setFormData(updated);
      onSaveSettings(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      setQrisUploadError('Gagal memproses gambar QRIS. Silakan coba lagi.');
    } finally {
      setIsUploadingQris(false);
    }
  };

  const handleQrisFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessQrisFile(file);
    }
    e.target.value = '';
  };

  const handleQrisDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingQris(true);
  };

  const handleQrisDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingQris(false);
  };

  const handleQrisDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingQris(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessQrisFile(file);
    }
  };

  const handleApplyQrisUrl = () => {
    if (!qrisUrlInput.trim()) return;
    const updated = {
      ...formData,
      qrisImageUrl: qrisUrlInput.trim(),
      qrisUpdatedAt: new Date().toISOString(),
    };
    setFormData(updated);
    onSaveSettings(updated);
    setQrisUrlInput('');
    setShowUrlInput(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleGenerateOfficialQris = async () => {
    setIsGeneratingStandardQris(true);
    try {
      const standardUrl = await generateDefaultQrisDataUrl({
        merchantName: formData.qrisMerchantName || formData.namaKoperasi || 'KOPERASI EL-BAYAN',
        nmid: formData.qrisNmid || 'ID1020260210001',
      });
      const updated = {
        ...formData,
        qrisImageUrl: standardUrl,
        qrisUpdatedAt: new Date().toISOString(),
      };
      setFormData(updated);
      onSaveSettings(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setIsGeneratingStandardQris(false);
    }
  };

  const handleRemoveQris = () => {
    if (confirm('Hapus gambar QRIS kustom dan kembalikan ke default resmi Koperasi El-Bayan?')) {
      handleGenerateOfficialQris();
    }
  };

  const handleReset = () => {
    if (
      confirm(
        'Apakah Anda yakin ingin mereset seluruh database ke data demo awal? Semua produk baru dan transaksi akan dikembalikan ke kondisi default.'
      )
    ) {
      onResetDemoData();
      alert('Data sistem koperasi berhasil direset ke kondisi awal!');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-6 sm:pb-10">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-600" />
            <span>Pengaturan Sistem Koperasi El-Bayan</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Sesuaikan profil identitas koperasi, kelola unggahan QRIS nasional, format struk POS, dan integrasi multi-perangkat.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Sinkronisasi Cloud Aktif</span>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 sm:p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          <span>Pengaturan & Konfigurasi QRIS berhasil disimpan ke database cloud dan tersinkronisasi ke seluruh perangkat kasir & konsumen!</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FITUR UNGGULAN: PENGATURAN & UPLOAD QRIS PEMBAYARAN DIGITAL */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-white via-white to-red-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-red-950/20 rounded-2xl border-2 border-red-200 dark:border-red-900/60 p-4 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-red-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-red-600/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  Kelola & Unggah QRIS Pembayaran Digital
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                  Resmi ASPI / GPN
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Unggah barcode QRIS koperasi agar otomatis tampil tajam di layar checkout konsumen dan mesin kasir POS.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setPreviewQrisModalOpen(true)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              <span>Pratinjau Layar Penuh</span>
            </button>

            <button
              type="button"
              onClick={handleGenerateOfficialQris}
              disabled={isGeneratingStandardQris}
              className="px-3.5 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/60 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingStandardQris ? 'animate-spin' : ''}`} />
              <span>Gunakan Standar El-Bayan</span>
            </button>
          </div>
        </div>

        {/* Cloud & Device Sync Indicator Banner */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
          <div className="leading-relaxed">
            <strong className="text-slate-900 dark:text-white">Tersimpan di Database & Otomatis Terhubung ke Semua Perangkat:</strong>
            <p className="text-slate-500 dark:text-slate-400 mt-0.5">
              Setiap kali Anda mengunggah berkas QRIS baru atau mengubah nama merchant, gambar beresolusi tinggi langsung disimpan ke Firestore Database dan diperbarui secara seketika (real-time) di smartphone konsumen santri serta monitor kasir tanpa perlu me-refresh aplikasi.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Sisi Kiri: Upload Area & Konfigurasi Teks */}
          <div className="lg:col-span-7 space-y-4">
            {/* Drag & Drop Upload Zone */}
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 text-xs mb-1.5">
                Unggah Berkas QRIS dari Perangkat (Laptop / HP) *
              </label>

              <input
                ref={qrisFileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleQrisFileChange}
                className="hidden"
              />

              <div
                onDragOver={handleQrisDragOver}
                onDragLeave={handleQrisDragLeave}
                onDrop={handleQrisDrop}
                onClick={() => qrisFileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                  isDraggingQris
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/40 ring-4 ring-red-500/20'
                    : 'border-slate-300 dark:border-slate-700 hover:border-red-400 dark:hover:border-red-600 bg-white dark:bg-slate-800/60'
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 flex items-center justify-center shadow-xs">
                    {isUploadingQris ? (
                      <RefreshCw className="w-6 h-6 animate-spin" />
                    ) : (
                      <Upload className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {isUploadingQris
                        ? 'Memproses & Mengoptimalkan Gambar...'
                        : 'Klik untuk Memilih File atau Tarik & Lepas (Drag & Drop) ke Sini'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Mendukung format PNG, JPG, WebP, SVG (Maks. 15 MB). Gambar otomatis dioptimalkan beresolusi tajam & anti-blur.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="mt-1 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all pointer-events-none"
                  >
                    Pilih Berkas QRIS
                  </button>
                </div>
              </div>

              {qrisUploadError && (
                <div className="mt-2 p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{qrisUploadError}</span>
                </div>
              )}
            </div>

            {/* Alternatif: Input URL Gambar QRIS */}
            <div className="pt-1">
              {!showUrlInput ? (
                <button
                  type="button"
                  onClick={() => setShowUrlInput(true)}
                  className="text-xs text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 font-semibold underline flex items-center gap-1"
                >
                  <span>Atau masukkan tautan URL gambar QRIS online</span>
                </button>
              ) : (
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Tautan URL Gambar QRIS:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={qrisUrlInput}
                      onChange={(e) => setQrisUrlInput(e.target.value)}
                      placeholder="https://example.com/qris-koperasi.png"
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <button
                      type="button"
                      onClick={handleApplyQrisUrl}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-all"
                    >
                      Terapkan
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowUrlInput(false)}
                      className="px-2 py-1.5 text-slate-500 hover:text-slate-700 text-xs"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Form Informasi Tambahan QRIS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 text-xs mb-1">
                  Nama Merchant QRIS (Tampil di Aplikasi)
                </label>
                <input
                  type="text"
                  value={formData.qrisMerchantName || ''}
                  onChange={(e) => setFormData({ ...formData, qrisMerchantName: e.target.value })}
                  placeholder="KOPERASI EL-BAYAN"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-red-500 font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 text-xs mb-1">
                  Nomor Merchant ID (NMID)
                </label>
                <input
                  type="text"
                  value={formData.qrisNmid || ''}
                  onChange={(e) => setFormData({ ...formData, qrisNmid: e.target.value })}
                  placeholder="ID1020260210001"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-red-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 text-xs mb-1">
                Keterangan / Panduan Pembayaran QRIS untuk Konsumen
              </label>
              <input
                type="text"
                value={formData.qrisNotes || ''}
                onChange={(e) => setFormData({ ...formData, qrisNotes: e.target.value })}
                placeholder="Mendukung semua m-Banking (BSI, BCA, Mandiri, BRI, BNI) & e-Wallet (GoPay, OVO, ShopeePay, DANA)"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Sisi Kanan: Kartu Preview Langsung & Aksi */}
          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/70 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Pratinjau QRIS Aktif di Sistem</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Resolusi Tinggi
              </span>
            </div>

            {/* Container Preview Gambar QRIS */}
            <div className="relative bg-white rounded-xl p-3 border-2 border-slate-200 shadow-sm flex flex-col items-center justify-center">
              {formData.qrisImageUrl ? (
                <div className="relative group cursor-pointer" onClick={() => setPreviewQrisModalOpen(true)}>
                  <img
                    src={formData.qrisImageUrl}
                    alt="Preview QRIS Koperasi"
                    className="max-h-64 w-auto object-contain rounded-lg shadow-2xs"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center gap-2 transition-opacity">
                    <span className="px-3 py-1.5 bg-white text-slate-900 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Perbesar</span>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
                  <QrCode className="w-12 h-12 stroke-1 text-slate-300" />
                  <span className="text-xs">Belum ada gambar QRIS</span>
                </div>
              )}
            </div>

            {/* Aksi Cepat Preview */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setPreviewQrisModalOpen(true)}
                disabled={!formData.qrisImageUrl}
                className="py-2 px-2.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-600 flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                <span>Lihat Layar Penuh</span>
              </button>

              <button
                type="button"
                onClick={handleRemoveQris}
                className="py-2 px-2.5 rounded-xl bg-white hover:bg-rose-50 dark:bg-slate-700 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold border border-slate-200 dark:border-slate-600 flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                <span>Reset ke Default</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FORM PENGATURAN UMUM & IDENTITAS KOPERASI */}
      {/* ========================================================================= */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs space-y-4 text-xs"
      >
        <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <Store className="w-4 h-4 text-emerald-600" />
          <span>Profil Identitas Koperasi & Header Struk</span>
        </h3>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Nama Resmi Koperasi *
          </label>
          <input
            type="text"
            value={formData.namaKoperasi}
            onChange={(e) => setFormData({ ...formData, namaKoperasi: e.target.value })}
            className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Alamat Koperasi *
          </label>
          <input
            type="text"
            value={formData.alamat}
            onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
            className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nomor Telepon / WhatsApp Koperasi *
            </label>
            <input
              type="text"
              value={formData.noHp}
              onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
              className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Koperasi
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Rekening Bank Transfer Info */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2.5">
          <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-blue-600" />
            <span>Rekening Bank untuk Pembayaran Transfer</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                Nama Bank
              </label>
              <input
                type="text"
                value={formData.rekeningBank?.bank || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rekeningBank: { ...formData.rekeningBank, bank: e.target.value },
                  })
                }
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                Nomor Rekening
              </label>
              <input
                type="text"
                value={formData.rekeningBank?.nomor || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rekeningBank: { ...formData.rekeningBank, nomor: e.target.value },
                  })
                }
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                Atas Nama (Pemilik Rekening)
              </label>
              <input
                type="text"
                value={formData.rekeningBank?.atasNama || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rekeningBank: { ...formData.rekeningBank, atasNama: e.target.value },
                  })
                }
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Catatan Kaki Struk Pembelian (Footer Nota) *
          </label>
          <input
            type="text"
            value={formData.strukFooter}
            onChange={(e) => setFormData({ ...formData, strukFooter: e.target.value })}
            className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div className="pt-2 sm:pt-3 flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Semua Perubahan Pengaturan & QRIS</span>
          </button>
        </div>
      </form>

      {/* MySQL Database Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-blue-200 dark:border-blue-900/40 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Database MySQL Koperasi El-Bayan
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Skema tabel relasional lengkap (InnoDB, Foreign Key, Views & Konfigurasi QRIS) untuk phpMyAdmin / MySQL Workbench.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={async () => {
                const ok = await copySqlToClipboard();
                if (ok) {
                  setCopiedSql(true);
                  setTimeout(() => setCopiedSql(false), 2500);
                }
              }}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              title="Salin seluruh query SQL untuk di-paste langsung ke tab SQL phpMyAdmin"
            >
              {copiedSql ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSql ? 'SQL Tersalin ke Clipboard!' : 'Salin Semua SQL (Untuk phpMyAdmin)'}</span>
            </button>

            <button
              type="button"
              onClick={() => downloadPureSqlFile('koperasi_elbayan.sql')}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              title="Unduh file SQL murni (dijamin bukan HTML)"
            >
              <Download className="w-4 h-4" />
              <span>Download File .SQL (Blob Murni)</span>
            </button>
          </div>
        </div>

        {/* Notifikasi panduan phpMyAdmin */}
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
          <div className="space-y-1">
            <div className="font-bold">Solusi Error #1064 phpMyAdmin:</div>
            <p className="leading-relaxed text-[11px]">
              Jika saat Import muncul error <code>#1064 near &apos;&lt;!doctype html&gt;&apos;</code>, itu terjadi karena browser Anda mendownload halaman HTML web. 
              <strong> Solusi termudah:</strong> Klik tombol hijau <strong>&quot;Salin Semua SQL&quot;</strong> di atas, lalu buka <strong>phpMyAdmin &gt; Tab SQL &gt; Paste (Ctrl+V) &gt; Klik Kirim (Go)</strong>.
            </p>
          </div>
        </div>

        {/* Tabel Ringkasan Skema */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>users</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">Admin & Kasir</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Admin Fuad & Kasir Sabiq</p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>pengaturan_toko</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300">QRIS & Profil</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">qris_image_url, qris_nmid, merchant, alamat</p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>transaksi & detail</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">Kasir POS</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Struk POS, kasir, tunai/transfer/QRIS, kembalian</p>
          </div>
        </div>
      </div>

      {/* Danger Zone: Reset Data */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900/40 p-4 sm:p-6 shadow-xs space-y-2.5 sm:space-y-3">
        <div className="flex items-center gap-2 text-rose-600">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="text-xs sm:text-sm font-bold">Zona Pengujian & Reset Database</h3>
        </div>
        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
          Gunakan tombol di bawah ini jika ingin mengulang pengujian dari awal dengan data produk, transaksi, dan QRIS default yang bersih.
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="w-full sm:w-auto px-4 py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Seluruh Data ke Default Skripsi</span>
        </button>
      </div>

      {/* Lightbox / Fullscreen QRIS Modal */}
      <QrisModal
        isOpen={previewQrisModalOpen}
        onClose={() => setPreviewQrisModalOpen(false)}
        settings={formData}
        title="Pratinjau Kode QRIS Pembayaran Digital"
      />
    </div>
  );
};
