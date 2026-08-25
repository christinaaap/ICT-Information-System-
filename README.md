# ICT Information System - PT Donggi-Senoro LNG

Sistem Informasi Departemen ICT PT Donggi-Senoro LNG (DSLNG) yang mencakup berbagai modul operasional untuk meningkatkan efisiensi dan produktivitas tim ICT.

## Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Struktur Project](#struktur-project)
- [Prasyarat](#prasyarat)
- [Instalasi](#instalasi)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Skrip NPM](#skrip-npm)
- [Modul Aplikasi](#modul-aplikasi)
- [Role & Akses Pengguna (RBAC)](#role--akses-pengguna-rbac)
- [Skema Database](#skema-database)
- [API Endpoints](#api-endpoints)
- [Izin Browser](#izin-browser)

## Fitur Utama

- **Dashboard Eksekutif** - Ringkasan metrik operasional ICT secara real-time
- **Manajemen Aset IT** - Inventory aset (Laptop, Desktop, Monitor) dengan tracking lokasi & user
- **Helpdesk Ticketing** - Sistem tiket pengaduan ICT dengan alur status lengkap
- **Absensi Geolocation & Foto** - Clock-in dengan validasi GPS dan foto bukti
- **Leave Approval E-Sign** - Pengajuan cuti dengan persetujuan 3 tahap (Leader → CSBO → SPMO) + tanda tangan digital
- **Manajemen Pengguna** - Admin panel untuk manajemen user dan role (RBAC)
- **Profil ICT & Dokumen** - Repository kebijakan IT dan work instructions
- **Asisten AI** - Integrasi dengan Google Gemini AI untuk bantuan otomatis
- **Personalisasi UI** - Pengaturan tema, densitas, dan preferensi tampilan

## Teknologi yang Digunakan

| Kategori | Teknologi |
|----------|-----------|
| **Frontend** | React 19, TypeScript 5.8, Tailwind CSS 4, Motion (Framer Motion), Lucide React, SweetAlert2, Canvas Confetti |
| **Backend** | Node.js, Express.js 4, tsx |
| **Build Tool** | Vite 6, esbuild |
| **AI Integration** | @google/genai (Gemini API) |
| **Utilitas** | XLSX (Excel export/import), dotenv |
| **Database** | Kompatibel dengan PostgreSQL / Cloud SQL / MySQL / SQLite |

## Struktur Project

```
ICT-Information-System-/
├── server/                          # Backend (Express.js API)
│   ├── controllers/                 # Business logic per modul
│   │   ├── ai.controller.ts
│   │   ├── assets.controller.ts
│   │   ├── attendance.controller.ts
│   │   ├── auth.controller.ts
│   │   ├── documents.controller.ts
│   │   ├── leave.controller.ts
│   │   └── tickets.controller.ts
│   ├── db/
│   │   ├── database.ts              # Konfigurasi koneksi database
│   │   └── schema.sql               # Definisi skema SQL lengkap
│   └── routes/                      # Routing API endpoints
│       ├── ai.routes.ts
│       ├── assets.routes.ts
│       ├── attendance.routes.ts
│       ├── auth.routes.ts
│       ├── documents.routes.ts
│       ├── index.ts                 # Router utama
│       ├── leave.routes.ts
│       └── tickets.routes.ts
├── src/                             # Frontend (React + Vite)
│   ├── components/
│   │   ├── admin/                   # Modul Admin
│   │   │   ├── EditPersonaModal.tsx
│   │   │   └── UserManagementModule.tsx
│   │   ├── assets/                  # Modul Manajemen Aset
│   │   │   └── AssetManagement.tsx
│   │   ├── attendance/              # Modul Absensi
│   │   │   └── AttendanceModule.tsx
│   │   ├── auth/                    # Autentikasi (Login/Register)
│   │   │   └── AuthScreens.tsx
│   │   ├── common/                  # Komponen Umum
│   │   │   ├── DslngLogo.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── dashboard/               # Dashboard Eksekutif
│   │   │   └── DashboardModule.tsx
│   │   ├── helpdesk/                # Modul Helpdesk Ticketing
│   │   │   └── HelpdeskTicketing.tsx
│   │   ├── leave/                   # Modul Leave Approval
│   │   │   └── LeaveModule.tsx
│   │   ├── personalize/             # Modal Pengaturan UI
│   │   │   └── PersonalizeModal.tsx
│   │   └── profile/                 # Modul Profil ICT & Dokumen
│   │       └── IctProfileModule.tsx
│   ├── data/
│   │   └── initialData.ts           # Data inisialisasi seed
│   ├── services/                    # API Client layer
│   │   ├── aiService.ts
│   │   ├── apiClient.ts
│   │   ├── assetService.ts
│   │   ├── attendanceService.ts
│   │   ├── authService.ts
│   │   ├── documentService.ts
│   │   ├── leaveService.ts
│   │   └── ticketService.ts
│   ├── types/
│   │   └── index.ts                 # Definisi TypeScript types/interfaces
│   ├── utils/
│   │   ├── excel.ts                 # Helper export/import Excel
│   │   └── notifications.ts         # Helper notifikasi Toast
│   ├── App.tsx                      # Root component & state management
│   ├── main.tsx                     # Entry point React
│   └── index.css                    # Global styles Tailwind
├── .env.example                     # Template environment variables
├── .gitignore
├── bun.lock
├── index.html
├── metadata.json
├── package.json
├── server.ts                        # Entry point server (Express + Vite)
├── tsconfig.json
└── vite.config.ts
```

## Prasyarat

- **Node.js** >= 18.0.0
- **Bun** atau **npm** / **yarn** / **pnpm** sebagai package manager
- **Browser modern** dengan dukungan Camera API & Geolocation API
- **Google Gemini API Key** (untuk fitur AI Assistant)

## Instalasi

1. Clone repository ini:

```bash
git clone <repository-url>
cd ICT-Information-System-
```

2. Install dependencies:

```bash
# Menggunakan Bun (disarankan)
bun install

# Atau menggunakan npm
npm install
```

## Konfigurasi Environment

Salin file `.env.example` menjadi `.env` dan isi nilai yang sesuai:

```bash
cp .env.example .env
```

Isi variabel berikut:

| Variabel | Deskripsi | Dibutuhkan |
|----------|-----------|------------|
| `GEMINI_API_KEY` | API Key untuk Google Gemini AI, dapatkan di [Google AI Studio](https://aistudio.google.com/) | Opsional (untuk fitur AI) |
| `APP_URL` | URL hosting aplikasi, digunakan untuk OAuth & callback | Opsional |

## Menjalankan Aplikasi

### Mode Development

```bash
bun run dev
```

Aplikasi akan berjalan di `http://localhost:3000` dengan hot-reload yang diaktifkan (menggunakan Vite middleware).

### Mode Production

1. Build aplikasi:

```bash
bun run build
```

2. Jalankan build result:

```bash
bun run start
```

Server akan berjalan di `http://localhost:3000` pada mode production dengan static file serving.

## Skrip NPM

| Skrip | Deskripsi |
|-------|-----------|
| `bun run dev` | Jalankan development server (Express + Vite middleware) |
| `bun run build` | Build frontend (Vite) + bundle backend (esbuild) ke folder `dist/` |
| `bun run start` | Jalankan production server dari hasil build |
| `bun run preview` | Preview Vite build tanpa Express server |
| `bun run clean` | Hapus folder build artifact (`dist/`, `server.js`) |
| `bun run lint` | TypeScript type checking tanpa emit file |

## Modul Aplikasi

### 1. Dashboard Eksekutif
Menampilkan ringkasan metrik operasional: jumlah aset, tiket open/in-progress, kehadiran karyawan, status cuti pending, dan shortcut navigasi cepat.

### 2. Manajemen Aset IT (`/assets`)
Hanya untuk role **admin** & **it_helpdesk**:
- CRUD data aset (Laptop/Desktop/Monitor)
- Import batch via Excel
- Tracking user pemegang aset
- Status aset: store, use, lend, broken, services
- Tracking aplikasi terinstall

### 3. Helpdesk Ticketing (`/helpdesk`)
Untuk semua role:
- User membuat tiket pengaduan (Software / Hardware / Service Lainnya)
- IT Helpdesk menangani & update status: Open → In Progress → Resolved → Closed
- Assignment petugas & catatan resolusi
- Fitur upload lampiran

### 4. Absensi (`/attendance`)
Hanya untuk role **admin** & **it_helpdesk** untuk melihat rekap:
- Clock-in dengan foto selfie + GPS geolocation
- Validasi lokasi kerja (Site Luwuk / HO Jakarta)
- Status kehadiran otomatis (Tepat Waktu / Terlambat)
- Rekap absensi per periode

### 5. Leave Approval (`/leave`)
Pengajuan cuti dengan workflow 3 tahap:
1. **Leader** → Approval tahap 1
2. **CSBO** → Approval tahap 2
3. **SPMO** → Approval tahap akhir

Setiap tahap dilengkapi **e-signature** (canvas drawing) dan catatan notes.

### 6. Profil ICT & Dokumen (`/profile`)
- Profil tim ICT, struktur organisasi, kontak
- Repository dokumen kebijakan IT (Policy)
- Work Instructions (WI) dengan versioning
- Upload & download dokumen

### 7. User Management (`/admin_users`)
Hanya untuk role **admin**:
- CRUD user lengkap
- Assign role & departemen
- Force change password
- Switch persona untuk testing role

## Role & Akses Pengguna (RBAC)

| Modul | admin | it_helpdesk | leader | csbo | spmo | user |
|-------|-------|-------------|--------|------|------|------|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manajemen Aset | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Helpdesk Ticketing | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ (hanya buat) |
| Absensi (rekap) | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Leave Request | ✅ | ✅ | ✅ (Approve Step 1) | ✅ (Approve Step 2) | ✅ (Approve Step 3) | ✅ (hanya buat) |
| Profil ICT | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| User Management | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

**Department yang tersedia:**
- President Directorate
- Operations Directorate
- Finance Directorate
- Corporate Affairs Director

**Work Location:**
- Site Luwuk
- HO Jakarta

## Skema Database

Lihat file [schema.sql](server/db/schema.sql) untuk detail lengkap. Tabel utama:

| Tabel | Deskripsi |
|-------|-----------|
| `users` | Data pengguna, role, department, work location |
| `assets` | Inventory aset IT dengan serial number unik |
| `tickets` | Tiket helpdesk ICT dengan tracking status |
| `attendances` | Log kehadiran dengan foto & GPS coordinates |
| `leave_requests` | Pengajuan cuti dengan step approval |
| `leave_approvals` | Detail tiap tahap approval + e-signature |
| `ict_documents` | Repository kebijakan & work instructions |

## API Endpoints

Base URL: `/api`

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/health` | Health check service |
| `POST` | `/auth/login` | Login user |
| `POST` | `/auth/register` | Register user baru |
| `POST` | `/auth/change-password` | Ubah password |
| `GET` | `/assets` | Daftar semua aset |
| `POST` | `/assets` | Tambah aset baru |
| `PUT` | `/assets/:id` | Update aset |
| `DELETE` | `/assets/:id` | Hapus aset |
| `POST` | `/assets/bulk` | Import aset batch |
| `GET` | `/tickets` | Daftar tiket |
| `POST` | `/tickets` | Buat tiket baru |
| `PUT` | `/tickets/:id/status` | Update status tiket |
| `DELETE` | `/tickets/:id` | Hapus tiket |
| `GET` | `/attendance` | Rekap absensi |
| `POST` | `/attendance/clock-in` | Clock-in kehadiran |
| `GET` | `/leave` | Daftar leave request |
| `POST` | `/leave` | Ajukan cuti baru |
| `PUT` | `/leave/:id/approve` | Approve step cuti |
| `GET` | `/documents` | Daftar dokumen ICT |
| `POST` | `/documents` | Upload dokumen baru |
| `POST` | `/ai/chat` | Chat dengan Gemini AI Assistant |

## Izin Browser

Aplikasi membutuhkan izin browser berikut:

- **Camera** → Untuk foto selfie absensi clock-in
- **Geolocation** → Untuk validasi lokasi kerja saat absensi

Pastikan browser tidak memblokir izin tersebut saat menggunakan fitur absensi.

---

© 2026 Departemen ICT — PT Donggi-Senoro LNG (DSLNG)
