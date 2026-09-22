import React from 'react';
import {
  AppRole,
  User,
  Konsumen,
} from '../types';
import { KoperasiLogo } from './KoperasiLogo';
import {
  Sun,
  Moon,
  ShoppingCart,
  Shield,
  Store,
  LogOut,
  Lock,
  Cloud,
  CloudOff,
} from 'lucide-react';

interface NavbarProps {
  currentRole: AppRole;
  currentUser: User | null;
  currentKonsumen: Konsumen | null;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  unreadOrdersCount: number;
  isDbConnected?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  currentUser,
  currentKonsumen,
  darkMode,
  onToggleDarkMode,
  cartCount,
  onOpenCart,
  onOpenAuthModal,
  onLogout,
  unreadOrdersCount,
  isDbConnected = true,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 min-w-0">
          <KoperasiLogo size="md" theme={darkMode ? 'dark' : 'light'} />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-2.5 flex-shrink-0">
          {/* Cart Icon (Konsumen mode) */}
          {currentRole === 'konsumen' && (
            <button
              onClick={onOpenCart}
              className="relative p-1.5 sm:p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Lihat Keranjang Belanja"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-extrabold text-[10px] w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* Database Live Cloud Indicator */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium border ${
              isDbConnected
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60'
                : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60'
            }`}
            title={isDbConnected ? 'Tersambung ke Cloud Firestore Database (Live Realtime)' : 'Offline / Mode Penyimpanan Lokal'}
          >
            {isDbConnected ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <Cloud className="w-3 h-3" />
                <span className="font-semibold">Cloud DB</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <CloudOff className="w-3 h-3" />
                <span>Lokal</span>
              </>
            )}
          </div>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={darkMode ? 'Beralih ke Light Mode' : 'Beralih ke Dark Mode'}
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />}
          </button>

          {/* User Info / Role & Login Action */}
          <div className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 border-l border-slate-200 dark:border-slate-800">
            {currentRole === 'konsumen' ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Optional Consumer Info display */}
                {currentKonsumen && (
                  <div className="hidden md:block text-right">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[120px]">
                      {currentKonsumen.name}
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                      {currentKonsumen.no_hp}
                    </div>
                  </div>
                )}

                {/* Login Petugas Button (opens Login Form with role selection) */}
                <button
                  onClick={onOpenAuthModal}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all active:scale-95 whitespace-nowrap"
                  title="Login Petugas (Kasir POS / Admin Koperasi)"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline sm:inline">Login Petugas</span>
                  <span className="xs:hidden sm:hidden">Login</span>
                </button>
              </div>
            ) : (
              /* Staff Mode (Kasir / Admin) */
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-100 dark:bg-slate-800 py-1 px-2 sm:py-1.5 sm:px-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                    {currentRole === 'admin' ? (
                      <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    ) : (
                      <Store className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    )}
                  </div>
                  <div className="text-left leading-tight">
                    <div className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[75px] xs:max-w-[100px] sm:max-w-[140px]">
                      {currentUser ? currentUser.name : (currentRole === 'admin' ? 'Administrator' : 'Petugas Kasir')}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                      {currentRole === 'admin' ? 'Admin' : 'Kasir POS'}
                    </div>
                  </div>
                </div>

                {/* Switch Role / Switch Staff Button */}
                <button
                  onClick={onOpenAuthModal}
                  className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
                  title="Ganti Peran atau Login Akun Lain"
                >
                  <span>Ganti Role</span>
                </button>

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="p-1.5 sm:p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors border border-rose-200 dark:border-rose-900/40 flex items-center gap-1 text-xs font-semibold"
                  title="Keluar / Kembali ke Katalog Konsumen"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
