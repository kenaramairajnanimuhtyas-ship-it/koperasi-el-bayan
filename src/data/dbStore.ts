import {
  User,
  Konsumen,
  Kategori,
  Produk,
  Order,
  DetailPesanan,
  Transaksi,
  StoreSettings,
  OrderStatus,
  PaymentMethod,
} from '../types';

export const initialUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    name: 'Ust. Ahmad Fauzi (Admin)',
    role: 'admin',
    password_hash: 'admin123',
    created_at: '2026-01-01T08:00:00.000Z',
  },
  {
    id: 2,
    username: 'kasir',
    name: 'Siti Rahmawati (Kasir)',
    role: 'kasir',
    password_hash: 'kasir123',
    created_at: '2026-01-01T08:00:00.000Z',
  },
];

export const initialKategori: Kategori[] = [
  { id_kategori: 1, nama_kategori: 'Makanan' },
  { id_kategori: 2, nama_kategori: 'Minuman' },
  { id_kategori: 3, nama_kategori: 'Alat Tulis' },
  { id_kategori: 4, nama_kategori: 'Kebutuhan Santri' },
  { id_kategori: 5, nama_kategori: 'Sembako' },
];

export const initialProduk: Produk[] = [
  {
    id_produk: 1,
    id_kategori: 3,
    nama: 'Buku Tulis Santri 58 Lembar (Pack)',
    deskripsi: 'Buku tulis bergaris kualitas tebal tidak mudah tembus tinta, isi 10 buku per pack dengan motif islami Koperasi El-Bayan.',
    harga: 38000,
    stok: 20, // default 20 for testing
    gambar: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    created_at: '2026-01-10T08:00:00.000Z',
  },
  {
    id_produk: 2,
    id_kategori: 3,
    nama: 'Pulpen Gel Hitam 0.5mm (Kotak 12 pcs)',
    deskripsi: 'Pulpen tinta gel hitam pekat nyaman untuk setoran catatan hafalan dan pelajaran harian.',
    harga: 24000,
    stok: 25,
    gambar: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80',
    created_at: '2026-01-10T08:00:00.000Z',
  },
  {
    id_produk: 3,
    id_kategori: 2,
    nama: 'Air Mineral El-Bayan 600ml (Dus 24 btl)',
    deskripsi: 'Air mineral murni higienis produksi binaan Koperasi El-Bayan, segar dan berkah.',
    harga: 42000,
    stok: 30,
    gambar: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80',
    created_at: '2026-01-10T08:00:00.000Z',
  },
  {
    id_produk: 4,
    id_kategori: 2,
    nama: 'Susu Kurma Segar 250ml',
    deskripsi: 'Minuman nutrisi perpaduan susu sapi murni dan ekstrak kurma pilihan tanpa pemanis buatan.',
    harga: 9000,
    stok: 15,
    gambar: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=600&auto=format&fit=crop&q=80',
    created_at: '2026-01-11T08:00:00.000Z',
  },
  {
    id_produk: 5,
    id_kategori: 1,
    nama: 'Roti Manis Abon Sapi El-Bayan',
    deskripsi: 'Roti empuk lembut buatan unit bakery Koperasi El-Bayan dengan taburan abon sapi melimpah.',
    harga: 7500,
    stok: 18,
    gambar: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    created_at: '2026-01-11T08:00:00.000Z',
  },
  {
    id_produk: 6,
    id_kategori: 1,
    nama: 'Keripik Tempe Renyah Gurih 200g',
    deskripsi: 'Camilan sehat santri gurih renyah dengan rempah alami khas pesantren.',
    harga: 12000,
    stok: 40,
    gambar: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80',
    created_at: '2026-01-12T08:00:00.000Z',
  },
  {
    id_produk: 7,
    id_kategori: 4,
    nama: 'Peci Songkok Hitam Bordir El-Bayan',
    deskripsi: 'Songkok beludru halus berkualitas tinggi dengan logo bordir rapi Koperasi El-Bayan. Nyaman untuk sholat berjamaah.',
    harga: 45000,
    stok: 22,
    gambar: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80',
    created_at: '2026-01-12T08:00:00.000Z',
  },
  {
    id_produk: 8,
    id_kategori: 4,
    nama: 'Sarung Tenun Halus Polos Santri',
    deskripsi: 'Sarung katun adem tidak mudah kusut dengan tenunan rapat dan nyaman dipakai seharian.',
    harga: 75000,
    stok: 16,
    gambar: 'https://images.unsplash.com/photo-1607344645866-009c320b5ab8?w=600&auto=format&fit=crop&q=80',
    created_at: '2026-01-12T08:00:00.000Z',
  },
  {
    id_produk: 9,
    id_kategori: 4,
    nama: 'Paket Mandi Santri (Sabun + Shampo + Sikat)',
    deskripsi: 'Paket hemat perlengkapan kebersihan diri santri lengkap dengan pouch tahan air.',
    harga: 28000,
    stok: 5, // stok menipis
    gambar: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    created_at: '2026-01-13T08:00:00.000Z',
  },
  {
    id_produk: 10,
    id_kategori: 5,
    nama: 'Beras Pandan Wangi Super 5 Kg',
    deskripsi: 'Beras pulen harum alami tanpa pemutih dan pengawet untuk konsumsi keluarga dan santri.',
    harga: 74000,
    stok: 24,
    gambar: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    created_at: '2026-01-13T08:00:00.000Z',
  },
  {
    id_produk: 11,
    id_kategori: 5,
    nama: 'Minyak Goreng Sawit Pouch 2 Liter',
    deskripsi: 'Minyak goreng jernih dua kali penyaringan, cocok untuk memasak aneka hidangan.',
    harga: 36000,
    stok: 19,
    gambar: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
    created_at: '2026-01-13T08:00:00.000Z',
  },
  {
    id_produk: 12,
    id_kategori: 5,
    nama: 'Gula Pasir Tebu Kristal 1 Kg',
    deskripsi: 'Gula pasir manis alami dari tebu murni, bersih dan butiran kristal halus.',
    harga: 17500,
    stok: 35,
    gambar: 'https://images.unsplash.com/photo-1622484214647-7592fa44a307?w=600&auto=format&fit=crop&q=80',
    created_at: '2026-01-14T08:00:00.000Z',
  },
];

export const initialKonsumen: Konsumen[] = [
  {
    id: 1,
    name: 'Muhammad Ilham',
    no_hp: '081234567890',
    created_at: '2026-02-01T10:00:00.000Z',
  },
  {
    id: 2,
    name: 'Fatimah Az-Zahra',
    no_hp: '085712345678',
    created_at: '2026-02-03T11:30:00.000Z',
  },
  {
    id: 3,
    name: 'Ustadzah Nurul',
    no_hp: '081987654321',
    created_at: '2026-02-05T09:15:00.000Z',
  },
];

export const initialOrders: Order[] = [
  {
    id_pesanan: 101,
    no_pesanan: 'ORD-ELB-20260210-001',
    id_konsumen: 1,
    nama_konsumen: 'Muhammad Ilham',
    no_hp: '081234567890',
    tanggal_pesanan: '2026-02-10T14:30:00.000Z',
    total: 62000,
    status: 'selesai',
    metode_pembayaran: 'tunai',
    items: [
      {
        id_detail: 1,
        id_pesanan: 101,
        id_produk: 1,
        nama_produk: 'Buku Tulis Santri 58 Lembar (Pack)',
        gambar: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
        jumlah: 1,
        harga: 38000,
        subtotal: 38000,
      },
      {
        id_detail: 2,
        id_pesanan: 101,
        id_produk: 2,
        nama_produk: 'Pulpen Gel Hitam 0.5mm (Kotak 12 pcs)',
        gambar: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80',
        jumlah: 1,
        harga: 24000,
        subtotal: 24000,
      },
    ],
  },
  {
    id_pesanan: 102,
    no_pesanan: 'ORD-ELB-20260211-002',
    id_konsumen: 2,
    nama_konsumen: 'Fatimah Az-Zahra',
    no_hp: '085712345678',
    tanggal_pesanan: '2026-02-11T09:45:00.000Z',
    total: 84000,
    status: 'diproses',
    metode_pembayaran: 'qris',
    items: [
      {
        id_detail: 3,
        id_pesanan: 102,
        id_produk: 3,
        nama_produk: 'Air Mineral El-Bayan 600ml (Dus 24 btl)',
        gambar: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80',
        jumlah: 2,
        harga: 42000,
        subtotal: 84000,
      },
    ],
  },
  {
    id_pesanan: 103,
    no_pesanan: 'ORD-ELB-20260212-003',
    id_konsumen: 3,
    nama_konsumen: 'Ustadzah Nurul',
    no_hp: '081987654321',
    tanggal_pesanan: '2026-02-12T13:20:00.000Z',
    total: 75000,
    status: 'menunggu',
    metode_pembayaran: 'tunai',
    items: [
      {
        id_detail: 4,
        id_pesanan: 103,
        id_produk: 8,
        nama_produk: 'Sarung Tenun Halus Polos Santri',
        gambar: 'https://images.unsplash.com/photo-1607344645866-009c320b5ab8?w=600&auto=format&fit=crop&q=80',
        jumlah: 1,
        harga: 75000,
        subtotal: 75000,
      },
    ],
  },
];

export const initialTransaksi: Transaksi[] = [
  {
    id_transaksi: 1001,
    no_transaksi: 'TRX-ELB-20260210-001',
    id_pesanan: 101,
    no_pesanan: 'ORD-ELB-20260210-001',
    id_user: 2,
    nama_kasir: 'Siti Rahmawati (Kasir)',
    nama_konsumen: 'Muhammad Ilham',
    no_hp_konsumen: '081234567890',
    tanggal_transaksi: '2026-02-10T14:35:00.000Z',
    total_bayar: 62000,
    nominal_dibayar: 70000,
    kembalian: 8000,
    metode_bayar: 'tunai',
    status: 'berhasil',
    items: [
      {
        id_detail: 1,
        id_pesanan: 101,
        id_produk: 1,
        nama_produk: 'Buku Tulis Santri 58 Lembar (Pack)',
        jumlah: 1,
        harga: 38000,
        subtotal: 38000,
      },
      {
        id_detail: 2,
        id_pesanan: 101,
        id_produk: 2,
        nama_produk: 'Pulpen Gel Hitam 0.5mm (Kotak 12 pcs)',
        jumlah: 1,
        harga: 24000,
        subtotal: 24000,
      },
    ],
  },
];

export const initialSettings: StoreSettings = {
  namaKoperasi: 'KOPERASI EL-BAYAN',
  tagline: 'Katalog Pemasaran & Kasir Digital Terintegrasi',
  alamat: 'Jl. Pesantren El-Bayan No. 12, Jawa Tengah',
  noHp: '0812-3456-7890',
  email: 'koperasi@elbayan.sch.id',
  strukFooter: 'Terima kasih atas kunjungan & belanja Anda di Koperasi El-Bayan. Semoga berkah.',
  rekeningBank: {
    bank: 'Bank Syariah Indonesia (BSI)',
    nomor: '712-3456-789',
    atasNama: 'KOPERASI EL-BAYAN',
  },
};

// Storage Keys
const STORAGE_KEYS = {
  USERS: 'elbayan_users',
  KONSUMEN: 'elbayan_konsumen',
  KATEGORI: 'elbayan_kategori',
  PRODUK: 'elbayan_produk',
  ORDERS: 'elbayan_orders',
  TRANSAKSI: 'elbayan_transaksi',
  SETTINGS: 'elbayan_settings',
};

// Helper for local storage access
function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key}:`, err);
    return fallback;
  }
}

function setStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error writing ${key}:`, err);
  }
}

// Database Service Class
export class ElBayanDB {
  static getUsers(): User[] {
    return getStored<User[]>(STORAGE_KEYS.USERS, initialUsers);
  }

  static getKategori(): Kategori[] {
    return getStored<Kategori[]>(STORAGE_KEYS.KATEGORI, initialKategori);
  }

  static saveKategori(kategoriList: Kategori[]): void {
    setStored(STORAGE_KEYS.KATEGORI, kategoriList);
  }

  static getProduk(): Produk[] {
    return getStored<Produk[]>(STORAGE_KEYS.PRODUK, initialProduk);
  }

  static saveProduk(produkList: Produk[]): void {
    setStored(STORAGE_KEYS.PRODUK, produkList);
  }

  static getOrders(): Order[] {
    return getStored<Order[]>(STORAGE_KEYS.ORDERS, initialOrders);
  }

  static saveOrders(ordersList: Order[]): void {
    setStored(STORAGE_KEYS.ORDERS, ordersList);
  }

  static getTransaksi(): Transaksi[] {
    return getStored<Transaksi[]>(STORAGE_KEYS.TRANSAKSI, initialTransaksi);
  }

  static saveTransaksi(transaksiList: Transaksi[]): void {
    setStored(STORAGE_KEYS.TRANSAKSI, transaksiList);
  }

  static getKonsumen(): Konsumen[] {
    return getStored<Konsumen[]>(STORAGE_KEYS.KONSUMEN, initialKonsumen);
  }

  static saveKonsumen(konsumenList: Konsumen[]): void {
    setStored(STORAGE_KEYS.KONSUMEN, konsumenList);
  }

  static getSettings(): StoreSettings {
    return getStored<StoreSettings>(STORAGE_KEYS.SETTINGS, initialSettings);
  }

  static saveSettings(settings: StoreSettings): void {
    setStored(STORAGE_KEYS.SETTINGS, settings);
  }

  // Atomic transaction to complete an order or direct POS sale
  static processPayment(params: {
    transaksi: Omit<Transaksi, 'id_transaksi' | 'no_transaksi' | 'tanggal_transaksi'>;
    orderIdToComplete?: number | null;
  }): { success: boolean; transaksi?: Transaksi; message: string } {
    const products = this.getProduk();
    const orders = this.getOrders();
    const transactions = this.getTransaksi();

    // 1. Check stock availability for all items
    for (const item of params.transaksi.items) {
      const prod = products.find((p) => p.id_produk === item.id_produk);
      if (!prod) {
        return { success: false, message: `Produk "${item.nama_produk}" tidak ditemukan!` };
      }
      if (prod.stok < item.jumlah) {
        return {
          success: false,
          message: `Stok untuk "${prod.nama}" tidak mencukupi! Tersedia: ${prod.stok}, diminta: ${item.jumlah}`,
        };
      }
    }

    // 2. Deduct stock safely (prevent negative stock)
    const updatedProducts = products.map((prod) => {
      const soldItem = params.transaksi.items.find((it) => it.id_produk === prod.id_produk);
      if (soldItem) {
        return {
          ...prod,
          stok: Math.max(0, prod.stok - soldItem.jumlah),
        };
      }
      return prod;
    });

    // 3. Update Order status if linked
    let updatedOrders = [...orders];
    if (params.orderIdToComplete) {
      updatedOrders = updatedOrders.map((ord) => {
        if (ord.id_pesanan === params.orderIdToComplete) {
          return { ...ord, status: 'selesai' as OrderStatus };
        }
        return ord;
      });
    }

    // 4. Create Transaction Record
    const nextTrxId = transactions.length > 0 ? Math.max(...transactions.map((t) => t.id_transaksi)) + 1 : 1001;
    const now = new Date();
    const dateCode = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randCode = String(nextTrxId).padStart(4, '0');
    const no_transaksi = `TRX-ELB-${dateCode}-${randCode}`;

    const newTransaksi: Transaksi = {
      ...params.transaksi,
      id_transaksi: nextTrxId,
      no_transaksi,
      tanggal_transaksi: now.toISOString(),
      status: 'berhasil',
    };

    // 5. Commit all changes
    this.saveProduk(updatedProducts);
    this.saveOrders(updatedOrders);
    this.saveTransaksi([newTransaksi, ...transactions]);

    return {
      success: true,
      transaksi: newTransaksi,
      message: 'Transaksi berhasil disimpan dan stok telah diperbarui otomatis.',
    };
  }

  // Reset to initial demo data
  static resetAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.KONSUMEN);
    localStorage.removeItem(STORAGE_KEYS.KATEGORI);
    localStorage.removeItem(STORAGE_KEYS.PRODUK);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.TRANSAKSI);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  }
}
