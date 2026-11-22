# QCare Backend API

REST API untuk sistem antrean digital fasilitas kesehatan **QCare**, dikembangkan menggunakan Node.js, Express.js, dan Supabase PostgreSQL.

Repository ini merupakan bagian dari pengembangan sistem QCare yang bertujuan mendukung pengelolaan data pasien, fasilitas kesehatan, layanan, dokter, jadwal dokter, antrean, dan riwayat antrean secara terstruktur.

**Repository:** https://github.com/Nazakee/Projek-Akhir-QCARE-BE

## 1. Teknologi yang Digunakan

- **Node.js** – Runtime JavaScript.
- **Express.js** – Framework untuk membangun REST API.
- **Supabase** – Backend database berbasis PostgreSQL.
- **PostgreSQL** – Sistem manajemen basis data relasional.
- **JWT (JSON Web Token)** – Autentikasi dan perlindungan endpoint.
- **Bcrypt.js** – Enkripsi hash password admin.
- **Helmet** – Perlindungan HTTP security headers.
- **CORS** – Pengaturan akses lintas origin.
- **Dotenv** – Pengelolaan environment variables.

## 2. Fitur Utama

- Implementasi REST API menggunakan Express.js.
- Integrasi database Supabase PostgreSQL.
- CRUD (Create, Read, Update, Delete) untuk delapan tabel.
- Autentikasi login admin.
- Password admin disimpan menggunakan bcrypt hash.
- Perlindungan endpoint menggunakan JWT.
- Validasi input dan relasi foreign key.
- Format respons API menggunakan JSON.
- Pemisahan kode berdasarkan routes, controllers, middleware, dan konfigurasi database.

## 3. Struktur Folder

```text
qcare-backend/
│
├── config/
│   └── supabase.js
│
├── controllers/
│   ├── adminController.js
│   ├── antreanController.js
│   ├── authController.js
│   ├── dokterController.js
│   ├── fasilitasController.js
│   ├── jadwalDokterController.js
│   ├── layananController.js
│   ├── pasienController.js
│   └── riwayatAntreanController.js
│
├── middleware/
│   └── authMiddleware.js
│
├── routes/
│   ├── adminRoutes.js
│   ├── antreanRoutes.js
│   ├── authRoutes.js
│   ├── dokterRoutes.js
│   ├── fasilitasRoutes.js
│   ├── jadwalDokterRoutes.js
│   ├── layananRoutes.js
│   ├── pasienRoutes.js
│   └── riwayatAntreanRoutes.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── qcare.sql
├── README.md
└── server.js
```

## 4. Database

QCare menggunakan Supabase PostgreSQL dengan delapan tabel utama:

| No. | Nama Tabel | Keterangan |
|---|---|---|
| 1 | pasien | Menyimpan data pasien |
| 2 | fasilitas_kesehatan | Menyimpan data fasilitas kesehatan |
| 3 | layanan | Menyimpan data layanan kesehatan |
| 4 | dokter | Menyimpan data dokter |
| 5 | admin | Menyimpan data administrator |
| 6 | jadwal_dokter | Menyimpan jadwal praktik dokter |
| 7 | antrean | Menyimpan data antrean pasien |
| 8 | riwayat_antrean | Menyimpan perubahan status antrean |

Struktur database dan relasi antartabel tersedia pada file `qcare.sql`.

Untuk membuat struktur database, jalankan isi file tersebut melalui SQL Editor pada dashboard Supabase.

## 5. Instalasi dan Konfigurasi

### Prasyarat

Pastikan perangkat sudah memiliki:

- Node.js dan npm.
- Akun Supabase.
- Git.
- Postman untuk pengujian API.

### Clone Repository

```bash
git clone https://github.com/Nazakee/Projek-Akhir-QCARE-BE.git
```

Masuk ke direktori proyek:

```bash
cd Projek-Akhir-QCARE-BE
```

### Install Dependencies

```bash
npm install
```

### Konfigurasi Environment Variables

Buat file `.env` pada direktori utama proyek.

Isi dengan konfigurasi berikut:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SECRET_KEY=your_supabase_secret_key

PORT=3000

JWT_SECRET=your_random_jwt_secret
JWT_EXPIRES_IN=1d
```

Sesuaikan seluruh nilai dengan konfigurasi Supabase dan secret milik masing-masing.

**Penting:** Jangan membagikan file `.env`, Supabase Secret Key, maupun JWT Secret ke publik. File `.env` sudah dimasukkan ke `.gitignore`.

## 6. Menjalankan Server

Untuk menjalankan server dalam mode development:

```bash
npm run dev
```

Untuk menjalankan server secara normal:

```bash
npm start
```

Jika berhasil, terminal akan menampilkan:

```text
QCare API running at http://localhost:3000
```

## 7. Endpoint API

Base URL:

```text
http://localhost:3000
```

### A. General Endpoint

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/` | Memeriksa status backend |
| GET | `/api/health` | Memeriksa kesehatan API |
| GET | `/api/db-test` | Memeriksa koneksi database |

### B. Authentication

| Method | Endpoint | Keterangan | Akses |
|---|---|---|---|
| POST | `/api/auth/login` | Login admin | Public |

### C. Data Pasien

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/pasien` | Mengambil seluruh data pasien |
| GET | `/api/pasien/:id` | Mengambil pasien berdasarkan ID |
| POST | `/api/pasien` | Menambahkan pasien |
| PUT | `/api/pasien/:id` | Memperbarui data pasien |
| DELETE | `/api/pasien/:id` | Menghapus pasien |

### D. Fasilitas Kesehatan

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/fasilitas` | Mengambil seluruh fasilitas |
| GET | `/api/fasilitas/id` | Mengambil fasilitas berdasarkan ID |
