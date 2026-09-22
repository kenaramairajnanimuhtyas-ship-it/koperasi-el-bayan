import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import {
  Upload,
  Image as ImageIcon,
  X,
  Check,
  Camera,
  Link as LinkIcon,
  Sparkles,
  AlertCircle,
  FileImage,
} from 'lucide-react';

interface PresetImage {
  label: string;
  url: string;
}

interface ImageUploaderProps {
  id?: string;
  value: string;
  onChange: (imageUrl: string) => void;
  label?: string;
  description?: string;
  presets?: PresetImage[];
  compact?: boolean;
}

const DEFAULT_PRESETS: PresetImage[] = [
  { label: 'Kitab / Buku', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80' },
  { label: 'Sarung Santri', url: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=400&q=80' },
  { label: 'Kopiah / Peci', url: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=400&q=80' },
  { label: 'Minuman Segar', url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80' },
  { label: 'Snack / Makanan', url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=400&q=80' },
  { label: 'Beras / Sembako', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80' },
  { label: 'Alat Tulis / ATK', url: 'https://images.unsplash.com/photo-1585336261026-4186685a6ba2?auto=format&fit=crop&w=400&q=80' },
];

/**
 * Optimizes an uploaded image file down to max 800x800 to maintain
 * ultra-fast rendering and prevent heavy localStorage usage.
 */
function compressImageFile(file: File, maxWidth = 800, maxHeight = 800, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => {
        resolve(event.target?.result as string);
      };
    };
    reader.onerror = (err) => reject(err);
  });
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  id = 'image-uploader',
  value,
  onChange,
  label = 'Foto Produk',
  description = 'Unggah gambar dari perangkat atau masukkan tautan URL',
  presets = DEFAULT_PRESETS,
  compact = false,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'preset' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(value && !value.startsWith('data:') ? value : '');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fileDetails, setFileDetails] = useState<{ name: string; size: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Format berkas tidak didukung. Harap pilih gambar (JPG, PNG, WebP).');
      return;
    }

    // Check size < 15MB
    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('Ukuran file terlalu besar (maksimal 15 MB).');
      return;
    }

    setErrorMessage('');
    setIsProcessing(true);

    try {
      const sizeKb = (file.size / 1024).toFixed(0);
      setFileDetails({
        name: file.name,
        size: `${sizeKb} KB`,
      });

      const compressedDataUrl = await compressImageFile(file);
      onChange(compressedDataUrl);
    } catch (err) {
      setErrorMessage('Gagal memproses gambar. Silakan coba lagi.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
    // reset input so same file can be selected again if needed
    e.target.value = '';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleApplyUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) {
      setErrorMessage('Tautan URL tidak boleh kosong.');
      return;
    }
    setErrorMessage('');
    setFileDetails(null);
    onChange(urlInput.trim());
  };

  const handleSelectPreset = (presetUrl: string) => {
    setErrorMessage('');
    setFileDetails(null);
    onChange(presetUrl);
  };

  const handleClearImage = () => {
    onChange('');
    setFileDetails(null);
    setUrlInput('');
    setErrorMessage('');
  };

  const isDataUrl = value?.startsWith('data:');

  return (
    <div id={id} className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
        {value && (
          <button
            type="button"
            id={`${id}-btn-remove`}
            onClick={handleClearImage}
            className="text-[11px] font-medium text-rose-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" />
            <span>Hapus Foto</span>
          </button>
        )}
      </div>

      {description && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-1">
          {description}
        </p>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
        <button
          type="button"
          id={`${id}-tab-upload`}
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'upload'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload File</span>
        </button>

        {presets.length > 0 && (
          <button
            type="button"
            id={`${id}-tab-preset`}
            onClick={() => setActiveTab('preset')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'preset'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Preset Koperasi</span>
          </button>
        )}

        <button
          type="button"
          id={`${id}-tab-url`}
          onClick={() => setActiveTab('url')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'url'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>Tautan URL</span>
        </button>
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="p-2.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Tab 1: Upload (Drag and drop + Manual Click) */}
      {activeTab === 'upload' && (
        <div
          id={`${id}-dropzone`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-4 sm:p-5 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 ring-4 ring-emerald-500/20'
              : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-400'
          }`}
        >
          <input
            ref={fileInputRef}
            id={`${id}-file-input`}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-2">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                isDragging
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="w-6 h-6" />
              )}
            </div>

            <div className="space-y-0.5">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                <span className="text-emerald-600 dark:text-emerald-400 underline decoration-dashed underline-offset-2">
                  Pilih gambar
                </span>{' '}
                atau seret ke sini
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Mendukung kamera, galeri smartphone, JPG, PNG, atau WebP
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-200/60 dark:bg-slate-700/60 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
              <Camera className="w-3 h-3" />
              <span>Kompresi otomatis resolusi tajam</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Preset Koperasi */}
      {activeTab === 'preset' && (
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-2">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Pilih foto preset siap pakai yang sesuai dengan kategori barang santri:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {presets.map((preset, idx) => {
              const isSelected = value === preset.url;
              return (
                <button
                  key={idx}
                  type="button"
                  id={`${id}-preset-${idx}`}
                  onClick={() => handleSelectPreset(preset.url)}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 bg-white dark:bg-slate-800'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="block text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                      {preset.label}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> Terpilih
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Tautan URL */}
      {activeTab === 'url' && (
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              id={`${id}-input-url`}
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://contoh.com/foto-produk.jpg"
              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
            <button
              type="button"
              id={`${id}-btn-apply-url`}
              onClick={() => handleApplyUrl()}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all"
            >
              Gunakan
            </button>
          </div>
          <p className="text-[10px] text-slate-400">
            Pastikan tautan dapat diakses secara publik dengan awalan https://
          </p>
        </div>
      )}

      {/* Live Preview Display */}
      {value ? (
        <div
          id={`${id}-preview-card`}
          className="mt-2 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3 shadow-xs"
        >
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-shrink-0">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                // fallback if invalid image url
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80';
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <FileImage className="w-3.5 h-3.5 text-emerald-600" />
              <span className="truncate">
                {fileDetails?.name || (isDataUrl ? 'Foto Berhasil Diunggah' : 'Foto Tautan / Preset')}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {fileDetails?.size
                ? `Ukuran file: ${fileDetails.size}`
                : isDataUrl
                ? 'Tersimpan lokal di memori sistem'
                : 'Sumber gambar eksternal'}
            </p>

            <div className="mt-1.5 flex items-center gap-2">
              <button
                type="button"
                id={`${id}-btn-change`}
                onClick={() => {
                  setActiveTab('upload');
                  fileInputRef.current?.click();
                }}
                className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Ganti Gambar
              </button>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <button
                type="button"
                id={`${id}-btn-delete`}
                onClick={handleClearImage}
                className="text-[11px] font-bold text-rose-500 hover:underline"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-500">
          <ImageIcon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span>Belum ada foto yang dipilih. Gambar bawaan sistem akan digunakan bila dikosongkan.</span>
        </div>
      )}
    </div>
  );
};
