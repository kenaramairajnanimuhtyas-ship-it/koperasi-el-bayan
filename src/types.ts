export type AppRole = 'admin' | 'kasir' | 'konsumen';

export type OrderStatus = 'menunggu' | 'diproses' | 'selesai' | 'batal';
export type PaymentMethod = 'tunai' | 'transfer' | 'qris';
export type TransactionStatus = 'pending' | 'berhasil' | 'batal';

export interface User {
  id: number;
  username: string;
  name: string;
  role: 'admin' | 'kasir';
  password_hash: string;
  created_at: string;
}

export interface Konsumen {
  id: number;
  name: string;
  no_hp: string;
  created_at: string;
}

export interface Kategori {
  id_kategori: number;
  nama_kategori: string;
  deskripsi?: string;
}

export interface Produk {
  id_produk: number;
  id_kategori: number;
  nama: string;
  deskripsi: string;
  harga: number;
  stok: number;
  gambar: string;
  created_at?: string;
}

export interface DetailPesanan {
  id_detail: number;
  id_pesanan: number;
  id_produk: number;
  nama_produk: string;
  gambar?: string;
  jumlah: number;
  harga: number;
  subtotal: number;
}

export interface Order {
  id_pesanan: number;
  no_pesanan: string;
  id_konsumen: number;
  nama_konsumen: string;
  no_hp: string;
  tanggal_pesanan: string;
  total: number;
  status: OrderStatus;
  metode_pembayaran: PaymentMethod;
  catatan?: string;
  bukti_pembayaran?: string;
  items: DetailPesanan[];
}

export interface Transaksi {
  id_transaksi: number;
  no_transaksi: string;
  id_pesanan?: number | null;
  no_pesanan?: string | null;
  id_user: number;
  nama_kasir: string;
  nama_konsumen: string;
  no_hp_konsumen?: string;
  tanggal_transaksi: string;
  total_bayar: number;
  nominal_dibayar: number;
  kembalian: number;
  metode_bayar: PaymentMethod;
  status: TransactionStatus;
  items: DetailPesanan[];
}

export interface CartItem {
  product: Produk;
  jumlah: number;
  quantity?: number;
}

export interface StoreSettings {
  namaKoperasi: string;
  tagline: string;
  alamat: string;
  noHp: string;
  email: string;
  strukFooter: string;
  rekeningBank: {
    bank: string;
    nomor: string;
    atasNama: string;
  };
}

export interface ProcessPaymentResult {
  success: boolean;
  transaksi?: Transaksi;
  transaction?: Transaksi;
  message: string;
}

export type AdminTab =
  | 'dashboard'
  | 'produk'
  | 'kategori'
  | 'pesanan'
  | 'laporan'
  | 'pengaturan';

export type KasirTab =
  | 'dashboard'
  | 'pos'
  | 'pesanan'
  | 'riwayat';

export type KonsumenTab =
  | 'katalog'
  | 'pesanan';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}
