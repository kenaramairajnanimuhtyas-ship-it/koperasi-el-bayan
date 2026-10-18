import React, { useState } from 'react';
import { User, Konsumen, Order } from '../../types';
import {
  Users,
  UserCheck,
  Shield,
  UserPlus,
  Key,
  Eye,
  EyeOff,
  Trash2,
  Edit3,
  Phone,
  Calendar,
  ShoppingBag,
  Database,
  Download,
  Copy,
  Check,
  Search,
  AlertCircle,
  HelpCircle,
  X,
  Lock,
  User as UserIcon,
} from 'lucide-react';
import { formatDateIndo, formatRupiah } from '../../utils/formatters';
import { downloadPureSqlFile, copySqlToClipboard } from '../../utils/sqlDownloader';
import { KOPERASI_ELBAYAN_SQL } from '../../data/sqlContent';

interface AdminPenggunaViewProps {
  users: User[];
  konsumen: Konsumen[];
  orders: Order[];
  onSaveUsers: (users: User[]) => void;
  onSaveKonsumen: (konsumen: Konsumen[]) => void;
}

export const AdminPenggunaView: React.FC<AdminPenggunaViewProps> = ({
  users,
  konsumen,
  orders,
  onSaveUsers,
  onSaveKonsumen,
}) => {
  const [activeTab, setActiveTab] = useState<'petugas' | 'konsumen' | 'skema_sql'>('petugas');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPasswords, setShowPasswords] = useState<Record<number, boolean>>({});
  const [copiedQuery, setCopiedQuery] = useState(false);
  const [copiedAllSql, setCopiedAllSql] = useState(false);
  const [showFullSqlModal, setShowFullSqlModal] = useState(false);

  // Modal State for Staff (Users)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userFormData, setUserFormData] = useState({
    name: '',
    username: '',
    role: 'kasir' as 'admin' | 'kasir',
    password: '',
  });
  const [userFormError, setUserFormError] = useState('');

  // Modal State for Konsumen
  const [isKonsumenModalOpen, setIsKonsumenModalOpen] = useState(false);
  const [editingKonsumen, setEditingKonsumen] = useState<Konsumen | null>(null);
  const [konsumenFormData, setKonsumenFormData] = useState({
    name: '',
    no_hp: '',
  });
  const [konsumenFormError, setKonsumenFormError] = useState('');

  // Stats calculation
  const totalPetugas = users.length;
  const totalAdmin = users.filter((u) => u.role === 'admin').length;
  const totalKasir = users.filter((u) => u.role === 'kasir').length;
  const totalKonsumen = konsumen.length;

  // Toggle password visibility
  const togglePasswordVisibility = (id: number) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Staff CRUD Handlers
  const handleOpenAddUser = () => {
    setEditingUser(null);
    setUserFormData({
      name: '',
      username: '',
      role: 'kasir',
      password: '',
    });
    setUserFormError('');
    setIsUserModalOpen(true);
  };

  const handleOpenEditUser = (user: User) => {
    setEditingUser(user);
    setUserFormData({
      name: user.name,
      username: user.username,
      role: user.role,
      password: user.password_hash,
    });
    setUserFormError('');
    setIsUserModalOpen(true);
  };

  const handleSaveUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userFormData.name.trim() || !userFormData.username.trim() || !userFormData.password.trim()) {
      setUserFormError('Semua kolom wajib diisi!');
      return;
    }

    // Check username uniqueness
    const usernameClean = userFormData.username.trim().toLowerCase();
    const existing = users.find(
      (u) => u.username.toLowerCase() === usernameClean && (!editingUser || u.id !== editingUser.id)
    );
    if (existing) {
      setUserFormError(`Username "${usernameClean}" sudah digunakan pengguna lain!`);
      return;
    }

    if (editingUser) {
      const updated = users.map((u) =>
        u.id === editingUser.id
          ? {
              ...u,
              name: userFormData.name.trim(),
              username: usernameClean,
              role: userFormData.role,
              password_hash: userFormData.password,
            }
          : u
      );
      onSaveUsers(updated);
    } else {
      const nextId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
      const newUser: User = {
        id: nextId,
        name: userFormData.name.trim(),
        username: usernameClean,
        role: userFormData.role,
        password_hash: userFormData.password,
        created_at: new Date().toISOString(),
      };
      onSaveUsers([...users, newUser]);
    }

    setIsUserModalOpen(false);
  };

  const handleDeleteUser = (user: User) => {
    if (user.role === 'admin' && totalAdmin <= 1) {
      alert('Tidak dapat menghapus admin utama satu-satunya!');
      return;
    }
    if (confirm(`Yakin ingin menghapus pengguna "${user.name}" (${user.username})?`)) {
      const updated = users.filter((u) => u.id !== user.id);
      onSaveUsers(updated);
    }
  };

  // Konsumen CRUD Handlers
  const handleOpenAddKonsumen = () => {
    setEditingKonsumen(null);
    setKonsumenFormData({ name: '', no_hp: '' });
    setKonsumenFormError('');
    setIsKonsumenModalOpen(true);
  };

  const handleOpenEditKonsumen = (k: Konsumen) => {
    setEditingKonsumen(k);
    setKonsumenFormData({ name: k.name, no_hp: k.no_hp });
    setKonsumenFormError('');
    setIsKonsumenModalOpen(true);
  };

  const handleSaveKonsumenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!konsumenFormData.name.trim() || !konsumenFormData.no_hp.trim()) {
      setKonsumenFormError('Nama dan Nomor HP/WhatsApp wajib diisi!');
      return;
    }

    if (editingKonsumen) {
      const updated = konsumen.map((k) =>
        k.id === editingKonsumen.id
          ? {
              ...k,
              name: konsumenFormData.name.trim(),
              no_hp: konsumenFormData.no_hp.trim(),
            }
          : k
      );
      onSaveKonsumen(updated);
    } else {
      const nextId = konsumen.length > 0 ? Math.max(...konsumen.map((k) => k.id)) + 1 : 1;
      const newKonsumen: Konsumen = {
        id: nextId,
        name: konsumenFormData.name.trim(),
        no_hp: konsumenFormData.no_hp.trim(),
        created_at: new Date().toISOString(),
      };
      onSaveKonsumen([...konsumen, newKonsumen]);
    }

    setIsKonsumenModalOpen(false);
  };

  const handleDeleteKonsumen = (k: Konsumen) => {
    if (confirm(`Hapus data konsumen "${k.name}"?`)) {
      const updated = konsumen.filter((item) => item.id !== k.id);
      onSaveKonsumen(updated);
    }
  };

  // Filtered lists
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredKonsumen = konsumen.filter(
    (k) =>
      k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.no_hp.includes(searchQuery)
  );

  const sqlSchemaSnippet = `-- --------------------------------------------------------
-- TABEL: users (Akun Admin & Kasir Sistem Koperasi)
-- --------------------------------------------------------
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
-- TABEL: konsumen (Data Pembeli, Santri & Wali Santri)
-- --------------------------------------------------------
CREATE TABLE \`konsumen\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`name\` VARCHAR(100) NOT NULL,
  \`no_hp\` VARCHAR(25) NOT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_konsumen_no_hp\` (\`no_hp\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Relasi pada tabel pesanan:
-- ALTER TABLE \`pesanan\` ADD CONSTRAINT \`fk_pesanan_konsumen\` 
-- FOREIGN KEY (\`id_konsumen\`) REFERENCES \`konsumen\`(\`id\`) ON DELETE SET NULL;`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchemaSnippet);
    setCopiedQuery(true);
    setTimeout(() => setCopiedQuery(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Database Pengguna & Konsumen
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kelola akun petugas (Admin Fuad & Kasir Sabiq) serta data pembeli/santri dalam tabel database terpisah.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {activeTab === 'petugas' && (
            <button
              onClick={handleOpenAddUser}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs shadow-emerald-600/30 flex items-center gap-2 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Petugas Baru</span>
            </button>
          )}

          {activeTab === 'konsumen' && (
            <button
              onClick={handleOpenAddKonsumen}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs shadow-emerald-600/30 flex items-center gap-2 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Konsumen Baru</span>
            </button>
          )}

          <button
            type="button"
            onClick={async () => {
              const ok = await copySqlToClipboard();
              if (ok) {
                setCopiedAllSql(true);
                setTimeout(() => setCopiedAllSql(false), 2500);
              }
            }}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Salin seluruh skrip database SQL untuk di-paste langsung ke phpMyAdmin"
          >
            {copiedAllSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAllSql ? 'SQL Tersalin!' : 'Salin SQL'}</span>
          </button>

          <button
            type="button"
            onClick={() => downloadPureSqlFile('koperasi_elbayan.sql')}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs shadow-blue-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Unduh file SQL murni via JavaScript Blob (Anti-Error #1064)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh .SQL (Blob)</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 dark:text-white">{totalAdmin}</div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Total Admin (Fuad)</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 dark:text-white">{totalKasir}</div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Total Kasir (Sabiq)</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 dark:text-white">{totalKonsumen}</div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Konsumen Terdaftar</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              MySQL & Local
            </div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Tabel: users & konsumen</div>
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl self-start">
          <button
            onClick={() => {
              setActiveTab('petugas');
              setSearchQuery('');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'petugas'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Tabel users ({totalPetugas})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('konsumen');
              setSearchQuery('');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'konsumen'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Tabel konsumen ({totalKonsumen})</span>
          </button>

          <button
            onClick={() => setActiveTab('skema_sql')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'skema_sql'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Struktur SQL Database</span>
          </button>
        </div>

        {activeTab !== 'skema_sql' && (
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === 'petugas' ? 'Cari nama atau username...' : 'Cari nama atau nomor HP...'}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
          </div>
        )}
      </div>

      {/* TAB 1: TABEL USERS (ADMIN & KASIR) */}
      {activeTab === 'petugas' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Daftar Akun Petugas Sistem (Tabel `users`)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold">
                  {filteredUsers.length} Akun
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Data akun petugas untuk login ke Dashboard Admin (Fuad) dan POS Kasir (Sabiq).
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-bold">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Nama Lengkap</th>
                  <th className="py-3 px-4">Username</th>
                  <th className="py-3 px-4">Peran (Role)</th>
                  <th className="py-3 px-4">Kata Sandi</th>
                  <th className="py-3 px-4">Dibuat Pada</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((user) => {
                  const isVisible = showPasswords[user.id];
                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">#{user.id}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                              user.role === 'admin'
                                ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                                : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            }`}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              {user.name}
                              {user.name === 'Fuad' && (
                                <span className="text-[10px] px-1.5 py-0.2 bg-blue-50 dark:bg-blue-900/40 text-blue-600 rounded">
                                  Default Admin
                                </span>
                              )}
                              {user.name === 'Sabiq' && (
                                <span className="text-[10px] px-1.5 py-0.2 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 rounded">
                                  Default Kasir
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400">Staff Koperasi El-Bayan</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-800 dark:text-slate-200">
                          {user.username}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            user.role === 'admin'
                              ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900'
                              : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                          }`}
                        >
                          {user.role === 'admin' ? (
                            <Shield className="w-3 h-3" />
                          ) : (
                            <UserCheck className="w-3 h-3" />
                          )}
                          <span className="uppercase">{user.role}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-700 dark:text-slate-300">
                            {isVisible ? user.password_hash : '••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(user.id)}
                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            title={isVisible ? 'Sembunyikan sandi' : 'Lihat sandi'}
                          >
                            {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {user.created_at ? formatDateIndo(user.created_at) : '01 Jan 2026'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditUser(user)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors"
                            title="Edit Akun"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                            title="Hapus Akun"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: TABEL KONSUMEN (DATA PEMBELI & SANTRI) */}
      {activeTab === 'konsumen' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Daftar Data Konsumen / Santri (Tabel `konsumen`)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-extrabold">
                  {filteredKonsumen.length} Konsumen
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Data pembeli santri, wali santri, dan pengurus yang terhubung dengan tabel transaksi dan pesanan.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-bold">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Nama Pelanggan / Santri</th>
                  <th className="py-3 px-4">No. HP / WhatsApp</th>
                  <th className="py-3 px-4">Total Pesanan</th>
                  <th className="py-3 px-4">Total Belanja</th>
                  <th className="py-3 px-4">Tanggal Daftar</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredKonsumen.map((k) => {
                  const customerOrders = orders.filter((o) => o.no_hp === k.no_hp || o.nama_konsumen === k.name);
                  const totalSpent = customerOrders.reduce((acc, curr) => acc + curr.total, 0);

                  return (
                    <tr
                      key={k.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">#{k.id}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{k.name}</div>
                        <div className="text-[10px] text-slate-400">Santri / Anggota Koperasi</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-mono text-slate-700 dark:text-slate-300">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span>{k.no_hp}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 text-[11px]">
                          {customerOrders.length} Pesanan
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                        {formatRupiah(totalSpent)}
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {k.created_at ? formatDateIndo(k.created_at) : '01 Feb 2026'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditKonsumen(k)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors"
                            title="Edit Konsumen"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteKonsumen(k)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                            title="Hapus Konsumen"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SKEMA SQL DATABASE */}
      {activeTab === 'skema_sql' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-600" />
                  <span>Struktur DDL Tabel `users` dan `konsumen` (MySQL / MariaDB)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Berikut adalah definisi skema database SQL yang tersimpan di file <code>public/koperasi_elbayan.sql</code> untuk keperluan skripsi dan deployment database.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={async () => {
                    const ok = await copySqlToClipboard();
                    if (ok) {
                      setCopiedAllSql(true);
                      setTimeout(() => setCopiedAllSql(false), 2500);
                    }
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  title="Salin seluruh 346 baris SQL untuk di-paste langsung ke phpMyAdmin"
                >
                  {copiedAllSql ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAllSql ? 'SQL Lengkap Tersalin!' : 'Salin Semua SQL (phpMyAdmin)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => downloadPureSqlFile('koperasi_elbayan.sql')}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs shadow-blue-600/30 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .SQL (Blob)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowFullSqlModal(true)}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat Seluruh SQL (346 Baris)</span>
                </button>
              </div>
            </div>

            {/* Alert Penyebab & Solusi Error #1064 phpMyAdmin */}
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl flex items-start gap-3 text-xs text-amber-800 dark:text-amber-200">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-amber-900 dark:text-amber-100">
                  Penyebab Error: #1064 near &apos;&lt;!doctype html&gt;&apos; di phpMyAdmin
                </div>
                <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
                  Error tersebut muncul karena file yang ter-upload ke phpMyAdmin berisi kode <strong>HTML</strong> halaman web (akibat browser menyimpan preview web saat download), bukan script database SQL murni.
                </p>
                <div className="pt-1 flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-[11px] text-emerald-700 dark:text-emerald-300">Cara Mengatasinya (10 Detik):</span>
                  <span className="text-[11px]">1. Klik tombol hijau <strong>&quot;Salin Semua SQL&quot;</strong> di atas.</span>
                  <span className="text-[11px]">2. Buka phpMyAdmin &rarr; pilih database atau buat baru.</span>
                  <span className="text-[11px]">3. Buka tab <strong>SQL</strong> &rarr; Paste (Ctrl+V) &rarr; Klik <strong>Kirim / Go</strong>.</span>
                </div>
              </div>
            </div>

            <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
              {sqlSchemaSnippet}
            </pre>
          </div>

          {/* Penjelasan Arsitektur Database */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>1. Tabel `users` (Otoritas & Petugas)</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Menyimpan identitas petugas yang memiliki hak akses login. Memiliki kolom <code>role</code> dengan ENUM ('admin', 'kasir'). Admin berwenang mengelola produk, pesanan, kasir, QRIS, dan laporan. Kasir berwenang memproses transaksi kasir POS dan memvalidasi pembayaran QRIS/tunai.
              </p>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                <span>2. Tabel `konsumen` (Pelanggan / Santri)</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Menyimpan identitas pembeli/konsumen seperti santri dan wali santri berdasarkan nama dan nomor WhatsApp/HP. Terhubung dengan foreign key <code>id_konsumen</code> di tabel <code>pesanan</code> untuk mencatat riwayat pembelian otomatis.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH / EDIT USER PETUGAS */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {editingUser ? 'Edit Data Petugas' : 'Tambah Petugas Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUserSubmit} className="p-4 sm:p-5 space-y-4">
              {userFormError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{userFormError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={userFormData.name}
                    onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                    placeholder="Contoh: Fuad (Admin) / Sabiq (Kasir)"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Username Login
                </label>
                <input
                  type="text"
                  required
                  value={userFormData.username}
                  onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })}
                  placeholder="Contoh: admin / kasir2"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Peran / Role Petugas
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setUserFormData({ ...userFormData, role: 'admin' })}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      userFormData.role === 'admin'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUserFormData({ ...userFormData, role: 'kasir' })}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      userFormData.role === 'kasir'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Kasir POS</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kata Sandi (Password)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={userFormData.password}
                    onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                    placeholder="Contoh: admin123 / kasir123"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs shadow-emerald-600/30"
                >
                  {editingUser ? 'Simpan Perubahan' : 'Tambahkan Petugas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH / EDIT KONSUMEN */}
      {isKonsumenModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {editingKonsumen ? 'Edit Data Konsumen' : 'Tambah Konsumen Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsKonsumenModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveKonsumenSubmit} className="p-4 sm:p-5 space-y-4">
              {konsumenFormError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{konsumenFormError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Konsumen / Santri
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={konsumenFormData.name}
                    onChange={(e) => setKonsumenFormData({ ...konsumenFormData, name: e.target.value })}
                    placeholder="Contoh: Muhammad Ilham"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nomor WhatsApp / HP
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={konsumenFormData.no_hp}
                    onChange={(e) => setKonsumenFormData({ ...konsumenFormData, no_hp: e.target.value })}
                    placeholder="Contoh: 081234567890"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsKonsumenModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs shadow-emerald-600/30"
                >
                  {editingKonsumen ? 'Simpan Perubahan' : 'Tambahkan Konsumen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL LIHAT SELURUH KODE SQL (346 BARIS) */}
      {showFullSqlModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Skrip SQL Lengkap: koperasi_elbayan.sql (346 Baris)
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Bisa disalin langsung (Ctrl+A &rarr; Ctrl+C) untuk di-paste ke tab SQL phpMyAdmin.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    const ok = await copySqlToClipboard();
                    if (ok) {
                      setCopiedAllSql(true);
                      setTimeout(() => setCopiedAllSql(false), 2500);
                    }
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  {copiedAllSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAllSql ? 'Tersalin!' : 'Salin Semua SQL'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => downloadPureSqlFile('koperasi_elbayan.sql')}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs shadow-blue-600/30 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh File</span>
                </button>
                <button
                  onClick={() => setShowFullSqlModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 flex-1 overflow-hidden flex flex-col bg-slate-950">
              <textarea
                readOnly
                value={KOPERASI_ELBAYAN_SQL}
                className="w-full flex-1 p-3 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl border border-slate-800 focus:outline-hidden resize-none leading-relaxed select-all"
                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              />
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Klik di dalam kotak teks untuk menyeleksi seluruh teks (Select All)</span>
              <button
                type="button"
                onClick={() => setShowFullSqlModal(false)}
                className="px-4 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
