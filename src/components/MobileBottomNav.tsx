import React from 'react';
import { AppRole, Konsumen, User } from '../types';
import {
  Store,
  ShoppingCart,
  FileText,
  Clock,
  History,
  LayoutDashboard,
  Package,
  BarChart3,
  Settings,
  Users,
  Layers,
} from 'lucide-react';

interface MobileBottomNavProps {
  currentRole: AppRole;
  konsumenTab: 'katalog' | 'pesanan';
  setKonsumenTab: (tab: 'katalog' | 'pesanan') => void;
  kasirTab: 'pos' | 'pesanan' | 'riwayat' | 'dashboard';
  setKasirTab: (tab: 'pos' | 'pesanan' | 'riwayat' | 'dashboard') => void;
  adminTab: 'dashboard' | 'produk' | 'kategori' | 'pesanan' | 'laporan' | 'pengaturan';
  setAdminTab: (tab: 'dashboard' | 'produk' | 'kategori' | 'pesanan' | 'laporan' | 'pengaturan') => void;
  cartCount: number;
  onOpenCart: () => void;
  pendingOrdersCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentRole,
  konsumenTab,
  setKonsumenTab,
  kasirTab,
  setKasirTab,
  adminTab,
  setAdminTab,
  cartCount,
  onOpenCart,
  pendingOrdersCount,
}) => {
  return (
    <nav
      id="mobile-bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 py-1 px-2 md:hidden shadow-lg safe-area-inset-bottom"
    >
      {/* Konsumen Navigation */}
      {currentRole === 'konsumen' && (
        <div className="flex items-center justify-around">
          <button
            onClick={() => setKonsumenTab('katalog')}
            className={`flex flex-col items-center justify-center py-1.5 px-4 rounded-xl transition-all ${
              konsumenTab === 'katalog'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            <Store className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Katalog</span>
          </button>

          <button
            onClick={onOpenCart}
            className="relative flex flex-col items-center justify-center py-1.5 px-4 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 mb-0.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-amber-500 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] leading-tight">Keranjang</span>
          </button>

          <button
            onClick={() => setKonsumenTab('pesanan')}
            className={`flex flex-col items-center justify-center py-1.5 px-4 rounded-xl transition-all ${
              konsumenTab === 'pesanan'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            <FileText className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Pesanan</span>
          </button>
        </div>
      )}

      {/* Kasir Navigation */}
      {currentRole === 'kasir' && (
        <div className="flex items-center justify-around">
          <button
            onClick={() => setKasirTab('pos')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              kasirTab === 'pos'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <ShoppingCart className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Kasir POS</span>
          </button>

          <button
            onClick={() => setKasirTab('pesanan')}
            className={`relative flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              kasirTab === 'pesanan'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <div className="relative">
              <Clock className="w-5 h-5 mb-0.5" />
              {pendingOrdersCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-rose-500 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                  {pendingOrdersCount}
                </span>
              )}
            </div>
            <span className="text-[10px] leading-tight">Antrean</span>
          </button>

          <button
            onClick={() => setKasirTab('riwayat')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              kasirTab === 'riwayat'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <History className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Riwayat</span>
          </button>

          <button
            onClick={() => setKasirTab('dashboard')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              kasirTab === 'dashboard'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Shift</span>
          </button>
        </div>
      )}

      {/* Admin Navigation */}
      {currentRole === 'admin' && (
        <div className="flex items-center justify-around">
          <button
            onClick={() => setAdminTab('dashboard')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              adminTab === 'dashboard'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Ringkasan</span>
          </button>

          <button
            onClick={() => setAdminTab('produk')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              adminTab === 'produk' || adminTab === 'kategori'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Package className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Produk</span>
          </button>

          <button
            onClick={() => setAdminTab('pesanan')}
            className={`relative flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              adminTab === 'pesanan'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <div className="relative">
              <FileText className="w-5 h-5 mb-0.5" />
              {pendingOrdersCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-rose-500 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                  {pendingOrdersCount}
                </span>
              )}
            </div>
            <span className="text-[10px] leading-tight">Pesanan</span>
          </button>

          <button
            onClick={() => setAdminTab('laporan')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              adminTab === 'laporan'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <BarChart3 className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Laporan</span>
          </button>

          <button
            onClick={() => setAdminTab('pengaturan')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              adminTab === 'pengaturan'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Settings className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">Setting</span>
          </button>
        </div>
      )}
    </nav>
  );
};
