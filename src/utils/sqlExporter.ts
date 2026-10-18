// Utilitas khusus untuk mengekspor dan mengunduh database MySQL Koperasi El-Bayan secara aman
// Menghindari kesalahan browser mengunduh berkas index.html

export const KOPERASI_ELBAYAN_SQL = `-- ====================================================================
-- SISTEM INFORMASI PEMASARAN BERBENTUK KATALOG BERBASIS WEBSITE
-- YANG TERINTEGRASI DENGAN SISTEM KASIR PADA KOPERASI EL-BAYAN
-- ====================================================================
-- DBMS: MySQL 5.7+ / MySQL 8.0+ / MariaDB 10.3+
-- Engine: InnoDB | Charset: utf8mb4 | Collation: utf8mb4_unicode_ci
-- Tanggal Pembuatan: 2026-10-18
-- ====================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+07:00";

-- --------------------------------------------------------
-- 1. PEMBUATAN DATABASE
-- --------------------------------------------------------
CREATE DATABASE IF NOT EXISTS \`koperasi_elbayan\`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE \`koperasi_elbayan\`;

-- --------------------------------------------------------
-- 2. TABEL: users (Admin & Kasir)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`users\`;
CREATE TABLE \`users\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`username\` VARCHAR(50) NOT NULL,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`name\` VARCHAR(100) NOT NULL,
  \`role\` ENUM('admin', 'kasir') NOT NULL DEFAULT 'kasir',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`idx_users_username\` (\`username\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 3. TABEL: konsumen (Data Pembeli / Santri)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`konsumen\`;
CREATE TABLE \`konsumen\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`name\` VARCHAR(100) NOT NULL,
  \`no_hp\` VARCHAR(25) NOT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_konsumen_no_hp\` (\`no_hp\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 4. TABEL: kategori (Kategori Produk Koperasi)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`kategori\`;
CREATE TABLE \`kategori\` (
  \`id_kategori\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`nama_kategori\` VARCHAR(100) NOT NULL,
  \`deskripsi\` TEXT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id_kategori\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 5. TABEL: produk (Katalog Produk Koperasi)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`produk\`;
CREATE TABLE \`produk\` (
  \`id_produk\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`id_kategori\` INT UNSIGNED NOT NULL,
  \`nama\` VARCHAR(150) NOT NULL,
  \`deskripsi\` TEXT NOT NULL,
  \`harga\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  \`stok\` INT NOT NULL DEFAULT 0,
  \`gambar\` TEXT NOT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id_produk\`),
  KEY \`idx_produk_kategori\` (\`id_kategori\`),
  KEY \`idx_produk_nama\` (\`nama\`),
  CONSTRAINT \`fk_produk_kategori\` FOREIGN KEY (\`id_kategori\`)
    REFERENCES \`kategori\` (\`id_kategori\`)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 6. TABEL: pesanan (Pesanan Katalog Online Santri/Konsumen)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`pesanan\`;
CREATE TABLE \`pesanan\` (
  \`id_pesanan\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`no_pesanan\` VARCHAR(50) NOT NULL,
  \`id_konsumen\` INT UNSIGNED NULL,
  \`nama_konsumen\` VARCHAR(100) NOT NULL,
  \`no_hp\` VARCHAR(25) NOT NULL,
  \`tanggal_pesanan\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`total\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  \`status\` ENUM('menunggu', 'diproses', 'selesai', 'batal') NOT NULL DEFAULT 'menunggu',
  \`metode_pembayaran\` ENUM('tunai', 'transfer', 'qris') NOT NULL DEFAULT 'tunai',
  \`catatan\` TEXT NULL,
  \`bukti_pembayaran\` TEXT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id_pesanan\`),
  UNIQUE KEY \`idx_pesanan_no\` (\`no_pesanan\`),
  KEY \`idx_pesanan_konsumen\` (\`id_konsumen\`),
  KEY \`idx_pesanan_status\` (\`status\`),
  KEY \`idx_pesanan_tanggal\` (\`tanggal_pesanan\`),
  CONSTRAINT \`fk_pesanan_konsumen\` FOREIGN KEY (\`id_konsumen\`)
    REFERENCES \`konsumen\` (\`id\`)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 7. TABEL: detail_pesanan (Item Pesanan Katalog)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`detail_pesanan\`;
CREATE TABLE \`detail_pesanan\` (
  \`id_detail\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`id_pesanan\` INT UNSIGNED NOT NULL,
  \`id_produk\` INT UNSIGNED NOT NULL,
  \`nama_produk\` VARCHAR(150) NOT NULL,
  \`gambar\` TEXT NULL,
  \`jumlah\` INT NOT NULL DEFAULT 1,
  \`harga\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  \`subtotal\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (\`id_detail\`),
  KEY \`idx_detail_pesanan\` (\`id_pesanan\`),
  KEY \`idx_detail_produk\` (\`id_produk\`),
  CONSTRAINT \`fk_detail_pesanan_parent\` FOREIGN KEY (\`id_pesanan\`)
    REFERENCES \`pesanan\` (\`id_pesanan\`)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT \`fk_detail_pesanan_produk\` FOREIGN KEY (\`id_produk\`)
    REFERENCES \`produk\` (\`id_produk\`)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 8. TABEL: transaksi (Sistem Kasir POS Terintegrasi)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`transaksi\`;
CREATE TABLE \`transaksi\` (
  \`id_transaksi\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`no_transaksi\` VARCHAR(50) NOT NULL,
  \`id_pesanan\` INT UNSIGNED NULL,
  \`no_pesanan\` VARCHAR(50) NULL,
  \`id_user\` INT UNSIGNED NOT NULL,
  \`nama_kasir\` VARCHAR(100) NOT NULL,
  \`nama_konsumen\` VARCHAR(100) NOT NULL,
  \`no_hp_konsumen\` VARCHAR(25) NULL,
  \`tanggal_transaksi\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`total_bayar\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  \`nominal_dibayar\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  \`kembalian\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  \`metode_bayar\` ENUM('tunai', 'transfer', 'qris') NOT NULL DEFAULT 'tunai',
  \`status\` ENUM('pending', 'berhasil', 'batal') NOT NULL DEFAULT 'berhasil',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id_transaksi\`),
  UNIQUE KEY \`idx_transaksi_no\` (\`no_transaksi\`),
  KEY \`idx_transaksi_pesanan\` (\`id_pesanan\`),
  KEY \`idx_transaksi_user\` (\`id_user\`),
  KEY \`idx_transaksi_tanggal\` (\`tanggal_transaksi\`),
  CONSTRAINT \`fk_transaksi_user\` FOREIGN KEY (\`id_user\`)
    REFERENCES \`users\` (\`id\`)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT \`fk_transaksi_pesanan\` FOREIGN KEY (\`id_pesanan\`)
    REFERENCES \`pesanan\` (\`id_pesanan\`)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 9. TABEL: detail_transaksi (Item Pembelian Kasir POS)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`detail_transaksi\`;
CREATE TABLE \`detail_transaksi\` (
  \`id_detail\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`id_transaksi\` INT UNSIGNED NOT NULL,
  \`id_produk\` INT UNSIGNED NOT NULL,
  \`nama_produk\` VARCHAR(150) NOT NULL,
  \`jumlah\` INT NOT NULL DEFAULT 1,
  \`harga\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  \`subtotal\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (\`id_detail\`),
  KEY \`idx_detail_transaksi\` (\`id_transaksi\`),
  KEY \`idx_detail_trx_produk\` (\`id_produk\`),
  CONSTRAINT \`fk_detail_transaksi_parent\` FOREIGN KEY (\`id_transaksi\`)
    REFERENCES \`transaksi\` (\`id_transaksi\`)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT \`fk_detail_transaksi_produk\` FOREIGN KEY (\`id_produk\`)
    REFERENCES \`produk\` (\`id_produk\`)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 10. TABEL: pengaturan_toko (Profil & Konfigurasi Koperasi)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`pengaturan_toko\`;
CREATE TABLE \`pengaturan_toko\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`nama_koperasi\` VARCHAR(150) NOT NULL,
  \`tagline\` VARCHAR(255) NOT NULL,
  \`alamat\` TEXT NOT NULL,
  \`no_hp\` VARCHAR(25) NOT NULL,
  \`email\` VARCHAR(100) NOT NULL,
  \`struk_footer\` TEXT NOT NULL,
  \`bank_nama\` VARCHAR(100) NOT NULL,
  \`bank_nomor\` VARCHAR(50) NOT NULL,
  \`bank_atas_nama\` VARCHAR(100) NOT NULL,
  \`qris_image_url\` LONGTEXT NULL,
  \`qris_merchant_name\` VARCHAR(150) NULL,
  \`qris_nmid\` VARCHAR(50) NULL,
  \`qris_notes\` TEXT NULL,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 11. VIEW LAPORAN & MONITORING
-- --------------------------------------------------------

-- View 1: Laporan Ringkasan Penjualan Harian
CREATE OR REPLACE VIEW \`v_laporan_penjualan_harian\` AS
SELECT 
  DATE(t.tanggal_transaksi) AS \`tanggal\`,
  COUNT(t.id_transaksi) AS \`total_transaksi\`,
  SUM(t.total_bayar) AS \`omset_harian\`,
  SUM(CASE WHEN t.metode_bayar = 'tunai' THEN t.total_bayar ELSE 0 END) AS \`total_tunai\`,
  SUM(CASE WHEN t.metode_bayar = 'qris' THEN t.total_bayar ELSE 0 END) AS \`total_qris\`,
  SUM(CASE WHEN t.metode_bayar = 'transfer' THEN t.total_bayar ELSE 0 END) AS \`total_transfer\`
FROM \`transaksi\` t
WHERE t.status = 'berhasil'
GROUP BY DATE(t.tanggal_transaksi)
ORDER BY \`tanggal\` DESC;

-- View 2: Produk Terlaris (Top Selling)
CREATE OR REPLACE VIEW \`v_produk_terlaris\` AS
SELECT 
  p.id_produk,
  p.nama AS \`nama_produk\`,
  k.nama_kategori,
  p.stok AS \`sisa_stok\`,
  COALESCE(SUM(dt.jumlah), 0) AS \`total_terjual\`,
  COALESCE(SUM(dt.subtotal), 0) AS \`total_pendapatan\`
FROM \`produk\` p
LEFT JOIN \`kategori\` k ON p.id_kategori = k.id_kategori
LEFT JOIN \`detail_transaksi\` dt ON p.id_produk = dt.id_produk
LEFT JOIN \`transaksi\` t ON dt.id_transaksi = t.id_transaksi AND t.status = 'berhasil'
GROUP BY p.id_produk, p.nama, k.nama_kategori, p.stok
ORDER BY \`total_terjual\` DESC;

-- View 3: Peringatan Stok Menipis (Stok <= 5)
CREATE OR REPLACE VIEW \`v_stok_menipis\` AS
SELECT 
  p.id_produk,
  p.nama AS \`nama_produk\`,
  k.nama_kategori,
  p.stok,
  p.harga,
  CASE 
    WHEN p.stok <= 0 THEN 'HABIS'
    WHEN p.stok <= 5 THEN 'MENIPIS'
    ELSE 'AMAN'
  END AS \`status_stok\`
FROM \`produk\` p
LEFT JOIN \`kategori\` k ON p.id_kategori = k.id_kategori
WHERE p.stok <= 5
ORDER BY p.stok ASC;

-- --------------------------------------------------------
-- 12. SEED DATA AWAL (KOPERASI EL-BAYAN)
-- --------------------------------------------------------

-- Users: Admin Fuad & Kasir Sabiq
INSERT INTO \`users\` (\`id\`, \`username\`, \`password_hash\`, \`name\`, \`role\`, \`created_at\`) VALUES
(1, 'admin', 'admin123', 'Fuad', 'admin', '2026-01-01 08:00:00'),
(2, 'kasir', 'kasir123', 'Sabiq', 'kasir', '2026-01-01 08:00:00');

-- Kategori Produk
INSERT INTO \`kategori\` (\`id_kategori\`, \`nama_kategori\`, \`deskripsi\`) VALUES
(1, 'Makanan', 'Aneka makanan ringan, camilan sehat, dan roti binaan pesantren'),
(2, 'Minuman', 'Air mineral higienis, susu kurma, dan minuman segar'),
(3, 'Alat Tulis', 'Buku tulis santri, pulpen hafalan, kitab, dan alat tulis pondok'),
(4, 'Kebutuhan Santri', 'Perlengkapan mandi, peci bordir, sarung tenun santri, dan kebersihan diri'),
(5, 'Sembako', 'Beras pandan wangi, minyak goreng, gula pasir, dan bahan pokok');

-- Data Produk
INSERT INTO \`produk\` (\`id_produk\`, \`id_kategori\`, \`nama\`, \`deskripsi\`, \`harga\`, \`stok\`, \`gambar\`, \`created_at\`) VALUES
(1, 3, 'Buku Tulis Santri 58 Lembar (Pack)', 'Buku tulis bergaris kualitas tebal tidak mudah tembus tinta, isi 10 buku per pack dengan motif islami Koperasi El-Bayan.', 38000.00, 20, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80', '2026-01-10 08:00:00'),
(2, 3, 'Pulpen Gel Hitam 0.5mm (Kotak 12 pcs)', 'Pulpen tinta gel hitam pekat nyaman untuk setoran catatan hafalan dan pelajaran harian.', 24000.00, 25, 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80', '2026-01-10 08:00:00'),
(3, 2, 'Air Mineral El-Bayan 600ml (Dus 24 btl)', 'Air mineral murni higienis produksi binaan Koperasi El-Bayan, segar dan berkah.', 42000.00, 30, 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80', '2026-01-10 08:00:00'),
(4, 2, 'Susu Kurma Segar 250ml', 'Minuman nutrisi perpaduan susu sapi murni dan ekstrak kurma pilihan tanpa pemanis buatan.', 9000.00, 15, 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=600&auto=format&fit=crop&q=80', '2026-01-11 08:00:00'),
(5, 1, 'Roti Manis Abon Sapi El-Bayan', 'Roti empuk lembut buatan unit bakery Koperasi El-Bayan dengan taburan abon sapi melimpah.', 7500.00, 18, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80', '2026-01-11 08:00:00'),
(6, 1, 'Keripik Tempe Renyah Gurih 200g', 'Camilan sehat santri gurih renyah dengan rempah alami khas pesantren.', 12000.00, 40, 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80', '2026-01-12 08:00:00'),
(7, 4, 'Peci Songkok Hitam Bordir El-Bayan', 'Songkok beludru halus berkualitas tinggi dengan logo bordir rapi Koperasi El-Bayan. Nyaman untuk sholat berjamaah.', 45000.00, 22, 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80', '2026-01-12 08:00:00'),
(8, 4, 'Sarung Tenun Halus Polos Santri', 'Sarung katun adem tidak mudah kusut dengan tenunan rapat dan nyaman dipakai seharian.', 75000.00, 16, 'https://images.unsplash.com/photo-1607344645866-009c320b5ab8?w=600&auto=format&fit=crop&q=80', '2026-01-12 08:00:00'),
(9, 4, 'Paket Mandi Santri (Sabun + Shampo + Sikat)', 'Paket hemat perlengkapan kebersihan diri santri lengkap dengan pouch tahan air.', 28000.00, 5, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80', '2026-01-13 08:00:00'),
(10, 5, 'Beras Pandan Wangi Super 5 Kg', 'Beras pulen harum alami tanpa pemutih dan pengawet untuk konsumsi keluarga dan santri.', 74000.00, 24, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80', '2026-01-13 08:00:00'),
(11, 5, 'Minyak Goreng Sawit Pouch 2 Liter', 'Minyak goreng jernih dua kali penyaringan, cocok untuk memasak aneka hidangan.', 36000.00, 19, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80', '2026-01-13 08:00:00'),
(12, 5, 'Gula Pasir Tebu Kristal 1 Kg', 'Gula pasir manis alami dari tebu murni, bersih dan butiran kristal halus.', 17500.00, 35, 'https://images.unsplash.com/photo-1622484214647-7592fa44a307?w=600&auto=format&fit=crop&q=80', '2026-01-14 08:00:00');

-- Data Konsumen
INSERT INTO \`konsumen\` (\`id\`, \`name\`, \`no_hp\`, \`created_at\`) VALUES
(1, 'Muhammad Ilham', '081234567890', '2026-02-01 10:00:00'),
(2, 'Fatimah Az-Zahra', '085712345678', '2026-02-03 11:30:00'),
(3, 'Ustadzah Nurul', '081987654321', '2026-02-05 09:15:00');

-- Data Pesanan Awal
INSERT INTO \`pesanan\` (\`id_pesanan\`, \`no_pesanan\`, \`id_konsumen\`, \`nama_konsumen\`, \`no_hp\`, \`tanggal_pesanan\`, \`total\`, \`status\`, \`metode_pembayaran\`, \`created_at\`) VALUES
(101, 'ORD-ELB-20260210-001', 1, 'Muhammad Ilham', '081234567890', '2026-02-10 14:30:00', 62000.00, 'selesai', 'tunai', '2026-02-10 14:30:00'),
(102, 'ORD-ELB-20260211-002', 2, 'Fatimah Az-Zahra', '085712345678', '2026-02-11 09:45:00', 84000.00, 'diproses', 'qris', '2026-02-11 09:45:00'),
(103, 'ORD-ELB-20260212-003', 3, 'Ustadzah Nurul', '081987654321', '2026-02-12 13:20:00', 75000.00, 'menunggu', 'tunai', '2026-02-12 13:20:00');

-- Data Detail Pesanan
INSERT INTO \`detail_pesanan\` (\`id_detail\`, \`id_pesanan\`, \`id_produk\`, \`nama_produk\`, \`gambar\`, \`jumlah\`, \`harga\`, \`subtotal\`) VALUES
(1, 101, 1, 'Buku Tulis Santri 58 Lembar (Pack)', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80', 1, 38000.00, 38000.00),
(2, 101, 2, 'Pulpen Gel Hitam 0.5mm (Kotak 12 pcs)', 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80', 1, 24000.00, 24000.00),
(3, 102, 3, 'Air Mineral El-Bayan 600ml (Dus 24 btl)', 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80', 2, 42000.00, 84000.00),
(4, 103, 8, 'Sarung Tenun Halus Polos Santri', 'https://images.unsplash.com/photo-1607344645866-009c320b5ab8?w=600&auto=format&fit=crop&q=80', 1, 75000.00, 75000.00);

-- Data Transaksi Kasir POS
INSERT INTO \`transaksi\` (\`id_transaksi\`, \`no_transaksi\`, \`id_pesanan\`, \`no_pesanan\`, \`id_user\`, \`nama_kasir\`, \`nama_konsumen\`, \`no_hp_konsumen\`, \`tanggal_transaksi\`, \`total_bayar\`, \`nominal_dibayar\`, \`kembalian\`, \`metode_bayar\`, \`status\`, \`created_at\`) VALUES
(1001, 'TRX-ELB-20260210-001', 101, 'ORD-ELB-20260210-001', 2, 'Sabiq', 'Muhammad Ilham', '081234567890', '2026-02-10 14:35:00', 62000.00, 70000.00, 8000.00, 'tunai', 'berhasil', '2026-02-10 14:35:00');

-- Data Detail Transaksi Kasir
INSERT INTO \`detail_transaksi\` (\`id_detail\`, \`id_transaksi\`, \`id_produk\`, \`nama_produk\`, \`jumlah\`, \`harga\`, \`subtotal\`) VALUES
(1, 1001, 1, 'Buku Tulis Santri 58 Lembar (Pack)', 1, 38000.00, 38000.00),
(2, 1001, 2, 'Pulpen Gel Hitam 0.5mm (Kotak 12 pcs)', 1, 24000.00, 24000.00);

-- Data Pengaturan Toko
INSERT INTO \`pengaturan_toko\` (\`id\`, \`nama_koperasi\`, \`tagline\`, \`alamat\`, \`no_hp\`, \`email\`, \`struk_footer\`, \`bank_nama\`, \`bank_nomor\`, \`bank_atas_nama\`, \`qris_merchant_name\`, \`qris_nmid\`, \`qris_notes\`) VALUES
(1, 'KOPERASI EL-BAYAN', 'Katalog Pemasaran & Kasir Digital Terintegrasi', 'Jl. Pesantren El-Bayan No. 12, Jawa Tengah', '0812-3456-7890', 'koperasi@elbayan.sch.id', 'Terima kasih atas kunjungan & belanja Anda di Koperasi El-Bayan. Semoga berkah.', 'Bank Syariah Indonesia (BSI)', '712-3456-789', 'KOPERASI EL-BAYAN', 'KOPERASI EL-BAYAN PONPES', 'ID1020260210001', 'Mendukung semua m-Banking & e-Wallet');

SET FOREIGN_KEY_CHECKS = 1;
-- ====================================================================
-- SELESAI: Database koperasi_elbayan siap di-import ke MySQL / phpMyAdmin
-- ====================================================================
`;

/**
 * Memicu pengunduhan file .sql langsung dari string memori menggunakan Blob.
 * Hal ini MENJAMIN berkas yang terunduh adalah 100% kode SQL murni,
 * dan bukan dokumen HTML web (<!doctype html>).
 */
export function downloadKoperasiSqlFile(filename: string = 'koperasi_elbayan.sql'): void {
  try {
    const blob = new Blob([KOPERASI_ELBAYAN_SQL], { type: 'application/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (err) {
    console.error('Gagal mengunduh SQL via Blob:', err);
    // Fallback: buka window data URI
    const encodedUri = 'data:application/sql;charset=utf-8,' + encodeURIComponent(KOPERASI_ELBAYAN_SQL);
    window.open(encodedUri, '_blank');
  }
}
