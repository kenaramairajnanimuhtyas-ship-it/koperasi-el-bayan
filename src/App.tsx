import React, { useState, useEffect } from 'react';
import {
  AppRole,
  User,
  Konsumen,
  Produk,
  Kategori,
  Order,
  Transaksi,
  StoreSettings,
  CartItem,
  KonsumenTab,
  KasirTab,
  AdminTab,
  OrderStatus,
  PaymentMethod,
  ProcessPaymentResult,
} from './types';
import { ElBayanDB } from './data/dbStore';
import { FirestoreSyncService } from './lib/firestoreSync';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { StaffLoginModal } from './components/auth/StaffLoginModal';
import { KonsumenOnboardingModal } from './components/auth/KonsumenOnboardingModal';
import { TestingGuideModal } from './components/shared/TestingGuideModal';
import { StrukModal } from './components/shared/StrukModal';

// Konsumen views & modals
import { KatalogView } from './components/konsumen/KatalogView';
import { PesananSayaView } from './components/konsumen/PesananSayaView';
import { KeranjangModal } from './components/konsumen/KeranjangModal';
import { CheckoutModal } from './components/konsumen/CheckoutModal';

// Kasir views
import { KasirDashboardView } from './components/kasir/KasirDashboardView';
import { KasirPosView } from './components/kasir/KasirPosView';
import { KasirPesananView } from './components/kasir/KasirPesananView';
import { KasirRiwayatTrxView } from './components/kasir/KasirRiwayatTrxView';

// Admin views
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { AdminProdukView } from './components/admin/AdminProdukView';
import { AdminKategoriView } from './components/admin/AdminKategoriView';
import { AdminPesananView } from './components/admin/AdminPesananView';
import { AdminLaporanView } from './components/admin/AdminLaporanView';
import { AdminPengaturanView } from './components/admin/AdminPengaturanView';
import { AdminPenggunaView } from './components/admin/AdminPenggunaView';

import {
  Store,
  ShoppingCart,
  LayoutDashboard,
  Package,
  Layers,
  FileText,
  BarChart3,
  Settings,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  History,
} from 'lucide-react';

export default function App() {
  // Dark mode state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('elbayan_dark_mode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('elbayan_dark_mode', String(darkMode));
  }, [darkMode]);

  // Database States
  const [products, setProducts] = useState<Produk[]>(() => ElBayanDB.getProduk());
  const [categories, setCategories] = useState<Kategori[]>(() => ElBayanDB.getKategori());
  const [orders, setOrders] = useState<Order[]>(() => ElBayanDB.getOrders());
  const [transactions, setTransactions] = useState<Transaksi[]>(() => ElBayanDB.getTransaksi());
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => ElBayanDB.getSettings());
  const [allUsers, setAllUsers] = useState<User[]>(() => ElBayanDB.getUsers());
  const [allKonsumen, setAllKonsumen] = useState<Konsumen[]>(() => ElBayanDB.getKonsumen());
  const [isDbConnected, setIsDbConnected] = useState<boolean>(true);

  // ----------------------------------------------------
  // Firestore Real-Time Subscriptions & Initial Sync
  // ----------------------------------------------------
  useEffect(() => {
    // 1. Initial seed check to cloud Firestore
    FirestoreSyncService.seedInitialData({
      produk: ElBayanDB.getProduk(),
      kategori: ElBayanDB.getKategori(),
      orders: ElBayanDB.getOrders(),
      transaksi: ElBayanDB.getTransaksi(),
      settings: ElBayanDB.getSettings(),
    });

    // 2. Subscribe to Products
    const unsubProducts = FirestoreSyncService.subscribeProducts(
      (cloudProducts) => {
        if (cloudProducts && cloudProducts.length > 0) {
          setProducts(cloudProducts);
          ElBayanDB.saveProduk(cloudProducts);
          setIsDbConnected(true);
        }
      },
      () => setIsDbConnected(false)
    );

    // 3. Subscribe to Categories
    const unsubCategories = FirestoreSyncService.subscribeCategories(
      (cloudCategories) => {
        if (cloudCategories && cloudCategories.length > 0) {
          setCategories(cloudCategories);
          ElBayanDB.saveKategori(cloudCategories);
          setIsDbConnected(true);
        }
      },
      () => setIsDbConnected(false)
    );

    // 4. Subscribe to Orders
    const unsubOrders = FirestoreSyncService.subscribeOrders(
      (cloudOrders) => {
        setOrders(cloudOrders);
        ElBayanDB.saveOrders(cloudOrders);
        setIsDbConnected(true);
      },
      () => setIsDbConnected(false)
    );

    // 5. Subscribe to Transactions
    const unsubTransactions = FirestoreSyncService.subscribeTransactions(
      (cloudTrx) => {
        setTransactions(cloudTrx);
        ElBayanDB.saveTransaksi(cloudTrx);
        setIsDbConnected(true);
      },
      () => setIsDbConnected(false)
    );

    // 6. Subscribe to Settings
    const unsubSettings = FirestoreSyncService.subscribeSettings((cloudSettings) => {
      if (cloudSettings) {
        setStoreSettings(cloudSettings);
        ElBayanDB.saveSettings(cloudSettings);
        setIsDbConnected(true);
      }
    });

    return () => {
      unsubProducts();
      unsubCategories();
      unsubOrders();
      unsubTransactions();
      unsubSettings();
    };
  }, []);

  // Role & Session States
  const [currentRole, setCurrentRole] = useState<AppRole>('konsumen');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentKonsumen, setCurrentKonsumen] = useState<Konsumen | null>(() => {
    const saved = localStorage.getItem('elbayan_current_konsumen');
    return saved ? JSON.parse(saved) : null;
  });

  // Tab States per Role
  const [konsumenTab, setKonsumenTab] = useState<KonsumenTab>('katalog');
  const [kasirTab, setKasirTab] = useState<KasirTab>('pos');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');

  // Consumer Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('elbayan_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('elbayan_cart', JSON.stringify(cart));
  }, [cart]);

  // Modals visibility
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isTestingGuideOpen, setIsTestingGuideOpen] = useState(false);
  const [selectedReceiptTrx, setSelectedReceiptTrx] = useState<Transaksi | null>(null);

  // Cross-view actions
  const [posPrefilledOrder, setPosPrefilledOrder] = useState<Order | null>(null);
  const [openAddProductModal, setOpenAddProductModal] = useState(false);

  // Global notification toast
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ----------------------------------------------------
  // Sync DB helpers
  // ----------------------------------------------------
  const refreshFromDB = () => {
    setProducts(ElBayanDB.getProduk());
    setCategories(ElBayanDB.getKategori());
    setOrders(ElBayanDB.getOrders());
    setTransactions(ElBayanDB.getTransaksi());
    setStoreSettings(ElBayanDB.getSettings());
    setAllUsers(ElBayanDB.getUsers());
    setAllKonsumen(ElBayanDB.getKonsumen());
  };

  // ----------------------------------------------------
  // Role Switching & Auth
  // ----------------------------------------------------
  const handleSwitchRole = (newRole: AppRole) => {
    if (newRole === 'konsumen') {
      setCurrentRole('konsumen');
      return;
    }

    if (!currentUser || currentUser.role !== newRole) {
      setIsAuthModalOpen(true);
      return;
    }

    setCurrentRole(newRole);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    setIsAuthModalOpen(false);
    showToast(`Selamat datang, ${user.name}! Masuk sebagai ${user.role.toUpperCase()}.`, 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentRole('konsumen');
    showToast('Anda telah keluar dari sesi staff koperasi.', 'info');
  };

  // ----------------------------------------------------
  // Konsumen Actions
  // ----------------------------------------------------
  const handleSaveKonsumen = (konsumen: Konsumen) => {
    setCurrentKonsumen(konsumen);
    localStorage.setItem('elbayan_current_konsumen', JSON.stringify(konsumen));
    
    // Update daftar allKonsumen
    const currentList = ElBayanDB.getKonsumen();
    const existingIndex = currentList.findIndex((k) => k.no_hp === konsumen.no_hp);
    let updated: Konsumen[];
    if (existingIndex >= 0) {
      updated = currentList.map((k) => (k.no_hp === konsumen.no_hp ? konsumen : k));
    } else {
      updated = [...currentList, konsumen];
    }
    ElBayanDB.saveKonsumen(updated);
    setAllKonsumen(updated);

    setIsOnboardingOpen(false);
    showToast(`Profil pembeli "${konsumen.name}" berhasil disimpan.`, 'success');
  };

  const handleAddToCart = (product: Produk, qty: number = 1) => {
    const currentItem = cart.find((i) => i.product.id_produk === product.id_produk);
    const currentQtyInCart = currentItem ? currentItem.jumlah : 0;

    if (currentQtyInCart + qty > product.stok) {
      showToast(`Stok tidak mencukupi! Tersedia hanya ${product.stok} pcs.`, 'error');
      return;
    }

    setCart((prev) => {
      const idx = prev.findIndex((i) => i.product.id_produk === product.id_produk);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], jumlah: next[idx].jumlah + qty };
        return next;
      }
      return [...prev, { product, jumlah: qty }];
    });

    showToast(`${qty}x "${product.nama}" ditambahkan ke keranjang.`, 'success');
  };

  const handleUpdateCartQty = (productId: number, newQty: number) => {
    const prod = products.find((p) => p.id_produk === productId);
    if (!prod) return;

    if (newQty > prod.stok) {
      showToast(`Stok maksimal untuk "${prod.nama}" adalah ${prod.stok} pcs.`, 'error');
      return;
    }

    if (newQty <= 0) {
      setCart((prev) => prev.filter((i) => i.product.id_produk !== productId));
    } else {
      setCart((prev) =>
        prev.map((i) => (i.product.id_produk === productId ? { ...i, jumlah: newQty } : i))
      );
    }
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart((prev) => prev.filter((i) => i.product.id_produk !== productId));
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleConfirmOrder = (newOrder: Order) => {
    const currentOrders = ElBayanDB.getOrders();
    const updatedOrders = [newOrder, ...currentOrders];
    ElBayanDB.saveOrders(updatedOrders);
    setOrders(updatedOrders);

    // Save to Cloud Firestore
    FirestoreSyncService.saveOrder(newOrder);

    setCart([]);
    setIsCheckoutOpen(false);

    if (!currentKonsumen || currentKonsumen.no_hp !== newOrder.no_hp) {
      const savedKonsumen: Konsumen = {
        id: newOrder.id_konsumen,
        name: newOrder.nama_konsumen,
        no_hp: newOrder.no_hp,
        created_at: new Date().toISOString(),
      };
      setCurrentKonsumen(savedKonsumen);
      localStorage.setItem('elbayan_current_konsumen', JSON.stringify(savedKonsumen));
    }

    showToast(`Pesanan ${newOrder.no_pesanan} berhasil dikirim ke Kasir Koperasi!`, 'success');
    setKonsumenTab('pesanan');
  };

  // ----------------------------------------------------
  // Kasir POS Actions (Atomic Transaction)
  // ----------------------------------------------------
  const handleProcessPaymentPos = (payload: {
    orderId?: number;
    customerName: string;
    items: { productId: number; qty: number }[];
    total: number;
    paymentMethod: PaymentMethod;
    paidAmount: number;
    cashierName: string;
  }): ProcessPaymentResult => {
    const detailItems = payload.items.map((it, idx) => {
      const p = products.find((prod) => prod.id_produk === it.productId);
      return {
        id_detail: idx + 1,
        id_pesanan: payload.orderId || 0,
        id_produk: it.productId,
        nama_produk: p ? p.nama : `Produk #${it.productId}`,
        jumlah: it.qty,
        harga: p ? p.harga : 0,
        subtotal: (p ? p.harga : 0) * it.qty,
      };
    });

    const res = ElBayanDB.processPayment({
      transaksi: {
        id_pesanan: payload.orderId || null,
        no_pesanan: payload.orderId
          ? orders.find((o) => o.id_pesanan === payload.orderId)?.no_pesanan || null
          : null,
        id_user: currentUser?.id || 2,
        nama_kasir: payload.cashierName,
        nama_konsumen: payload.customerName,
        total_bayar: payload.total,
        nominal_dibayar: payload.paidAmount,
        kembalian: Math.max(0, payload.paidAmount - payload.total),
        metode_bayar: payload.paymentMethod,
        status: 'berhasil',
        items: detailItems,
      },
      orderIdToComplete: payload.orderId || null,
    });

    refreshFromDB();
    if (res.transaksi) {
      setSelectedReceiptTrx(res.transaksi);
      // Sync transaction & product stock to Firestore
      FirestoreSyncService.saveTransaction(res.transaksi);
      FirestoreSyncService.syncAllProducts(ElBayanDB.getProduk());

      // If an online order was completed, update order in Firestore
      if (payload.orderId) {
        const completedOrder = ElBayanDB.getOrders().find((o) => o.id_pesanan === payload.orderId);
        if (completedOrder) {
          FirestoreSyncService.saveOrder(completedOrder);
        }
      }
    }

    return {
      success: res.success,
      transaksi: res.transaksi,
      transaction: res.transaksi,
      message: res.message,
    };
  };

  const handleKasirProcessOnlineOrder = (order: Order) => {
    setPosPrefilledOrder(order);
    setKasirTab('pos');
    showToast(`Pesanan ${order.no_pesanan} dimuat ke Kasir POS. Silakan selesaikan pembayaran.`, 'info');
  };

  const handleKasirUpdateOrderStatus = (orderId: number, newStatus: OrderStatus) => {
    const updated = orders.map((o) => (o.id_pesanan === orderId ? { ...o, status: newStatus } : o));
    ElBayanDB.saveOrders(updated);
    setOrders(updated);

    const targetOrder = updated.find((o) => o.id_pesanan === orderId);
    if (targetOrder) {
      FirestoreSyncService.saveOrder(targetOrder);
    }
    showToast(`Status pesanan diperbarui menjadi ${newStatus.toUpperCase()}.`, 'info');
  };

  const handleOpenReceiptById = (trxId: number) => {
    const trx = transactions.find((t) => t.id_transaksi === trxId);
    if (trx) {
      setSelectedReceiptTrx(trx);
    } else {
      showToast('Data transaksi struk tidak ditemukan.', 'error');
    }
  };

  // ----------------------------------------------------
  // Admin Actions
  // ----------------------------------------------------
  const handleAdminAddProduct = (prodData: Omit<Produk, 'id_produk'>) => {
    const currentProds = ElBayanDB.getProduk();
    const nextId = currentProds.length > 0 ? Math.max(...currentProds.map((p) => p.id_produk)) + 1 : 1;
    const newProd: Produk = {
      ...prodData,
      id_produk: nextId,
      created_at: new Date().toISOString(),
    };
    const updated = [newProd, ...currentProds];
    ElBayanDB.saveProduk(updated);
    setProducts(updated);

    FirestoreSyncService.saveProduct(newProd);
    showToast(`Produk "${newProd.nama}" dengan stok ${newProd.stok} pcs berhasil ditambahkan.`, 'success');
  };

  const handleAdminUpdateProduct = (updatedProd: Produk) => {
    const updated = products.map((p) => (p.id_produk === updatedProd.id_produk ? updatedProd : p));
    ElBayanDB.saveProduk(updated);
    setProducts(updated);

    FirestoreSyncService.saveProduct(updatedProd);
    showToast(`Produk "${updatedProd.nama}" berhasil diperbarui.`, 'success');
  };

  const handleAdminDeleteProduct = (prodId: number) => {
    const updated = products.filter((p) => p.id_produk !== prodId);
    ElBayanDB.saveProduk(updated);
    setProducts(updated);

    FirestoreSyncService.deleteProduct(prodId);
    showToast('Produk berhasil dihapus dari sistem.', 'info');
  };

  const handleAdminAddCategory = (catData: Omit<Kategori, 'id_kategori'>) => {
    const currentCats = ElBayanDB.getKategori();
    const nextId = currentCats.length > 0 ? Math.max(...currentCats.map((c) => c.id_kategori)) + 1 : 1;
    const newCat: Kategori = {
      ...catData,
      id_kategori: nextId,
    };
    const updated = [...currentCats, newCat];
    ElBayanDB.saveKategori(updated);
    setCategories(updated);

    FirestoreSyncService.saveCategory(newCat);
  };

  const handleAdminUpdateCategory = (cat: Kategori) => {
    const updated = categories.map((c) => (c.id_kategori === cat.id_kategori ? cat : c));
    ElBayanDB.saveKategori(updated);
    setCategories(updated);

    FirestoreSyncService.saveCategory(cat);
  };

  const handleAdminDeleteCategory = (catId: number) => {
    const boundProducts = products.filter((p) => p.id_kategori === catId);
    if (boundProducts.length > 0) {
      return {
        success: false,
        message: `Kategori tidak dapat dihapus karena masih digunakan oleh ${boundProducts.length} produk! Silakan pindahkan atau hapus produk terlebih dahulu.`,
      };
    }
    const updated = categories.filter((c) => c.id_kategori !== catId);
    ElBayanDB.saveKategori(updated);
    setCategories(updated);

    FirestoreSyncService.deleteCategory(catId);
    return { success: true, message: 'Kategori berhasil dihapus.' };
  };

  const handleAdminUpdateOrderStatus = (orderId: number, newStatus: OrderStatus) => {
    const updated = orders.map((o) => (o.id_pesanan === orderId ? { ...o, status: newStatus } : o));
    ElBayanDB.saveOrders(updated);
    setOrders(updated);

    const targetOrder = updated.find((o) => o.id_pesanan === orderId);
    if (targetOrder) {
      FirestoreSyncService.saveOrder(targetOrder);
    }
    showToast(`Status pesanan berhasil diubah menjadi "${newStatus.toUpperCase()}".`, 'success');
  };

  const handleAdminSaveSettings = (settings: StoreSettings) => {
    ElBayanDB.saveSettings(settings);
    setStoreSettings(settings);
    FirestoreSyncService.saveSettings(settings);
    showToast('Pengaturan Koperasi & QRIS berhasil disimpan ke database cloud!', 'success');
  };

  const handleAdminSaveUsers = (updatedUsers: User[]) => {
    ElBayanDB.saveUsers(updatedUsers);
    setAllUsers(updatedUsers);
    showToast('Data petugas sistem (users) berhasil disimpan.', 'success');
  };

  const handleAdminSaveKonsumen = (updatedKonsumen: Konsumen[]) => {
    ElBayanDB.saveKonsumen(updatedKonsumen);
    setAllKonsumen(updatedKonsumen);
    showToast('Data konsumen/santri berhasil disimpan.', 'success');
  };

  const handleAdminResetDemoData = () => {
    ElBayanDB.resetAllData();
    refreshFromDB();
    setCart([]);
    showToast('Seluruh data koperasi berhasil direset ke demo awal.', 'info');
  };

  const handleNavigateFromTestingGuide = (role: AppRole, subTab?: string) => {
    setCurrentRole(role);
    if (role === 'konsumen') {
      if (subTab === 'pesanan') setKonsumenTab('pesanan');
      else setKonsumenTab('katalog');
    } else if (role === 'kasir') {
      if (subTab === 'pos') setKasirTab('pos');
      else if (subTab === 'pesanan') setKasirTab('pesanan');
      else if (subTab === 'riwayat') setKasirTab('riwayat');
      else setKasirTab('dashboard');
    } else if (role === 'admin') {
      if (subTab === 'produk') setAdminTab('produk');
      else if (subTab === 'kategori') setAdminTab('kategori');
      else if (subTab === 'pesanan') setAdminTab('pesanan');
      else if (subTab === 'laporan') setAdminTab('laporan');
      else if (subTab === 'pengaturan') setAdminTab('pengaturan');
      else if (subTab === 'pengguna') setAdminTab('pengguna');
      else setAdminTab('dashboard');
    }
    setIsTestingGuideOpen(false);
  };

  const pendingOrdersCount = orders.filter((o) => o.status === 'menunggu' || o.status === 'diproses').length;
  const cartItemsCount = cart.reduce((acc, item) => acc + item.jumlah, 0);

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors flex flex-col">
      {/* Universal Top Navigation */}
      <Navbar
        currentRole={currentRole}
        currentUser={currentUser}
        currentKonsumen={currentKonsumen}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        cartCount={cartItemsCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        unreadOrdersCount={pendingOrdersCount}
        isDbConnected={isDbConnected}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold flex items-center gap-2.5 backdrop-blur-md ${
              toastMessage.type === 'error'
                ? 'bg-rose-500/95 text-white border-rose-600 shadow-rose-900/30'
                : toastMessage.type === 'info'
                ? 'bg-blue-600/95 text-white border-blue-700 shadow-blue-900/30'
                : 'bg-emerald-600/95 text-white border-emerald-700 shadow-emerald-900/30'
            }`}
          >
            {toastMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Sub-Header Navigation based on Current Role (Desktop/Tablet) */}
      <div className="hidden md:block bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-16 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between overflow-x-auto no-scrollbar">
          {/* KONSUMEN SUB-NAV */}
          {currentRole === 'konsumen' && (
            <div className="flex items-center gap-2 py-2.5">
              <button
                onClick={() => setKonsumenTab('katalog')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  konsumenTab === 'katalog'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Katalog Produk Koperasi</span>
              </button>

              <button
                onClick={() => setKonsumenTab('pesanan')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all relative ${
                  konsumenTab === 'pesanan'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Pesanan Saya</span>
                {currentKonsumen && orders.filter((o) => o.no_hp === currentKonsumen.no_hp).length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                )}
              </button>
            </div>
          )}

          {/* KASIR SUB-NAV */}
          {currentRole === 'kasir' && (
            <div className="flex items-center gap-2 py-2.5">
              <button
                onClick={() => setKasirTab('pos')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  kasirTab === 'pos'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Kasir POS (Penjualan)</span>
              </button>

              <button
                onClick={() => setKasirTab('pesanan')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all relative ${
                  kasirTab === 'pesanan'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Antrean Pesanan Online</span>
                {pendingOrdersCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-rose-500 text-white">
                    {pendingOrdersCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setKasirTab('riwayat')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  kasirTab === 'riwayat'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <History className="w-4 h-4" />
                <span>Riwayat Transaksi</span>
              </button>

              <button
                onClick={() => setKasirTab('dashboard')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  kasirTab === 'dashboard'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Ringkasan Shift</span>
              </button>
            </div>
          )}

          {/* ADMIN SUB-NAV */}
          {currentRole === 'admin' && (
            <div className="flex items-center gap-2 py-2.5">
              <button
                onClick={() => setAdminTab('dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  adminTab === 'dashboard'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setAdminTab('produk')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  adminTab === 'produk'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Data Produk</span>
              </button>

              <button
                onClick={() => setAdminTab('kategori')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  adminTab === 'kategori'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Kategori</span>
              </button>

              <button
                onClick={() => setAdminTab('pesanan')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all relative ${
                  adminTab === 'pesanan'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Kelola Pesanan</span>
                {pendingOrdersCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-rose-500 text-white">
                    {pendingOrdersCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setAdminTab('laporan')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  adminTab === 'laporan'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Laporan Penjualan</span>
              </button>

              <button
                onClick={() => setAdminTab('pengaturan')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  adminTab === 'pengaturan'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Pengaturan Koperasi</span>
              </button>

              <button
                onClick={() => setAdminTab('pengguna')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  adminTab === 'pengguna'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Pengguna & Konsumen</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2.5 sm:px-6 py-3.5 sm:py-6 pb-20 md:pb-8">
        {/* ====================================================
            ROLE: KONSUMEN
           ==================================================== */}
        {currentRole === 'konsumen' && (
          <>
            {konsumenTab === 'katalog' && (
              <KatalogView
                products={products}
                categories={categories}
                onAddToCart={handleAddToCart}
                cart={cart}
                storeSettings={storeSettings}
                onOpenCart={() => setIsCartOpen(true)}
              />
            )}

            {konsumenTab === 'pesanan' && (
              <PesananSayaView
                orders={orders}
                consumerPhone={currentKonsumen?.no_hp}
                storeSettings={storeSettings}
                onNavigateKatalog={() => setKonsumenTab('katalog')}
              />
            )}
          </>
        )}

        {/* ====================================================
            ROLE: KASIR
           ==================================================== */}
        {currentRole === 'kasir' && (
          <>
            {kasirTab === 'pos' && (
              <KasirPosView
                products={products}
                categories={categories}
                importedOrder={posPrefilledOrder}
                onClearImportedOrder={() => setPosPrefilledOrder(null)}
                onProcessPayment={handleProcessPaymentPos}
                onOpenReceipt={handleOpenReceiptById}
                cashierName={currentUser?.name || 'Sabiq'}
                storeSettings={storeSettings}
              />
            )}

            {kasirTab === 'pesanan' && (
              <KasirPesananView
                orders={orders}
                onProcessOrderToPos={handleKasirProcessOnlineOrder}
                onUpdateOrderStatus={handleKasirUpdateOrderStatus}
              />
            )}

            {kasirTab === 'riwayat' && (
              <KasirRiwayatTrxView
                transactions={transactions}
                onOpenReceipt={handleOpenReceiptById}
              />
            )}

            {kasirTab === 'dashboard' && (
              <KasirDashboardView
                orders={orders}
                transactions={transactions}
                products={products}
                onNavigateTab={(tab) => setKasirTab(tab)}
                onProcessOrderToPos={handleKasirProcessOnlineOrder}
              />
            )}
          </>
        )}

        {/* ====================================================
            ROLE: ADMIN
           ==================================================== */}
        {currentRole === 'admin' && (
          <>
            {adminTab === 'dashboard' && (
              <AdminDashboardView
                products={products}
                categories={categories}
                orders={orders}
                transactions={transactions}
                onNavigateTab={(tab) => setAdminTab(tab)}
                onOpenAddProduct={() => {
                  setAdminTab('produk');
                  setOpenAddProductModal(true);
                }}
              />
            )}

            {adminTab === 'produk' && (
              <AdminProdukView
                products={products}
                categories={categories}
                onAddProduct={handleAdminAddProduct}
                onUpdateProduct={handleAdminUpdateProduct}
                onDeleteProduct={handleAdminDeleteProduct}
                openAddModalInitially={openAddProductModal}
                onCloseAddModalInitially={() => setOpenAddProductModal(false)}
              />
            )}

            {adminTab === 'kategori' && (
              <AdminKategoriView
                categories={categories}
                products={products}
                onAddCategory={handleAdminAddCategory}
                onUpdateCategory={handleAdminUpdateCategory}
                onDeleteCategory={handleAdminDeleteCategory}
              />
            )}

            {adminTab === 'pesanan' && (
              <AdminPesananView
                orders={orders}
                onUpdateStatus={handleAdminUpdateOrderStatus}
              />
            )}

            {adminTab === 'laporan' && (
              <AdminLaporanView
                transactions={transactions}
                products={products}
              />
            )}

            {adminTab === 'pengaturan' && (
              <AdminPengaturanView
                settings={storeSettings}
                onSaveSettings={handleAdminSaveSettings}
                onResetDemoData={handleAdminResetDemoData}
              />
            )}

            {adminTab === 'pengguna' && (
              <AdminPenggunaView
                users={allUsers}
                konsumen={allKonsumen}
                orders={orders}
                onSaveUsers={handleAdminSaveUsers}
                onSaveKonsumen={handleAdminSaveKonsumen}
              />
            )}
          </>
        )}
      </main>

      {/* ====================================================
          MODALS & DIALOGS
         ==================================================== */}

      {/* Cart Modal (Konsumen) */}
      <KeranjangModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveFromCart}
        onProceedCheckout={handleProceedToCheckout}
      />

      {/* Checkout Modal (Konsumen) */}
      {isCheckoutOpen && (
        <CheckoutModal
          cart={cart}
          currentKonsumen={currentKonsumen}
          storeSettings={storeSettings}
          onClose={() => setIsCheckoutOpen(false)}
          onConfirmOrder={handleConfirmOrder}
        />
      )}

      {/* Staff Login Modal (Admin & Kasir) */}
      {isAuthModalOpen && (
        <StaffLoginModal
          users={allUsers}
          initialRole={currentRole === 'admin' ? 'admin' : 'kasir'}
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setIsAuthModalOpen(false)}
          onOpenTestingGuide={() => {
            setIsAuthModalOpen(false);
            setIsTestingGuideOpen(true);
          }}
        />
      )}

      {/* Konsumen Onboarding Profile Modal */}
      {isOnboardingOpen && (
        <KonsumenOnboardingModal
          currentKonsumen={currentKonsumen}
          onSave={handleSaveKonsumen}
          onClose={() => setIsOnboardingOpen(false)}
        />
      )}

      {/* Testing 21 Steps Guide Modal */}
      {isTestingGuideOpen && (
        <TestingGuideModal
          onClose={() => setIsTestingGuideOpen(false)}
          onNavigateRole={handleNavigateFromTestingGuide}
        />
      )}

      {/* Printable Receipt Modal */}
      {selectedReceiptTrx && (
        <StrukModal
          transaksi={selectedReceiptTrx}
          storeSettings={storeSettings}
          onClose={() => setSelectedReceiptTrx(null)}
        />
      )}

      {/* Footer */}
      <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 pb-24 md:pb-6 text-center text-xs text-slate-500 dark:text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {storeSettings.namaKoperasi}
            </span>{' '}
            • {storeSettings.tagline}
          </div>
          <div className="text-[11px] text-slate-400">
            Sistem Informasi Pemasaran Berbentuk Katalog Terintegrasi Sistem Kasir
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar (Phone only) */}
      <MobileBottomNav
        currentRole={currentRole}
        konsumenTab={konsumenTab}
        setKonsumenTab={setKonsumenTab}
        kasirTab={kasirTab}
        setKasirTab={setKasirTab}
        adminTab={adminTab}
        setAdminTab={setAdminTab}
        cartCount={cartItemsCount}
        onOpenCart={() => setIsCartOpen(true)}
        pendingOrdersCount={pendingOrdersCount}
      />
    </div>
  );
}
