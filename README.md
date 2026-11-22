
# QCare Backend

REST API backend untuk aplikasi **QCare**, yaitu sistem antrean online pada fasilitas kesehatan. Backend ini mengelola data pasien, fasilitas kesehatan, layanan, dokter, jadwal dokter, antrean, riwayat antrean, autentikasi, dan reset password.

Repository: [Projek-Akhir-QCARE-BE](https://github.com/Nazakee/Projek-Akhir-QCARE-BE)

## Teknologi

- **Node.js** — runtime JavaScript.
- **Express.js** — REST API framework.
- **Supabase PostgreSQL** — database.
- **Supabase JavaScript Client** — koneksi backend ke database.
- **bcryptjs** — hashing dan verifikasi password.
- **JSON Web Token (JWT)** — autentikasi berbasis token.
- **Helmet** — pengamanan HTTP headers.
- **CORS** — pengaturan akses lintas origin.
- **Postman** — pengujian API.

## Fitur Utama

### 1. Pengelolaan Data

- CRUD data pasien.
- CRUD fasilitas kesehatan.
- CRUD layanan.
- CRUD dokter.
- CRUD admin.
- CRUD jadwal dokter.
- Pengelolaan antrean.
- Pengelolaan riwayat antrean.

### 2. Autentikasi dan Otorisasi

- Login admin.
- Registrasi pasien.
- Login pasien.
- Password disimpan dalam bentuk hash menggunakan bcrypt.
- Autentikasi menggunakan JWT Bearer Token.
- Pembagian hak akses berdasarkan dua role, yaitu `admin` dan `pasien`.
- Pasien hanya dapat melihat dan memperbarui profil miliknya sendiri.
- Pengelolaan data master dan operasi administratif dibatasi untuk admin.

### 3. Sistem Antrean Online

- Nomor antrean dibuat secara otomatis berdasarkan jadwal dokter dan tanggal kunjungan.
- Penomoran antrean dimulai dari `A001` untuk setiap kombinasi jadwal dan tanggal yang berbeda.
- Validasi jadwal dokter, layanan, tanggal kunjungan, dan status aktif.
- Validasi kuota antrean.
- Pencegahan pendaftaran antrean ganda oleh pasien pada jadwal dan tanggal yang sama.
- Pembuatan antrean menggunakan fungsi database atomik untuk mengurangi risiko benturan ketika beberapa permintaan masuk bersamaan.
- Perubahan status antrean dicatat ke dalam riwayat antrean.
- Pasien hanya dapat membatalkan antrean miliknya ketika status masih `Menunggu`.
- Admin dapat mengelola status antrean sesuai aturan backend.

### 4. Reset Password

- Permintaan OTP reset password.
- Verifikasi OTP.
- Penggantian password setelah OTP valid.
- OTP memiliki masa berlaku dan batas percobaan verifikasi.

**Catatan:** Pengiriman OTP melalui email belum dikonfigurasi. Pada tahap pengembangan saat ini, OTP simulasi ditampilkan melalui terminal server lokal.

## Struktur Folder

```text
qcare-backend/
├── config/
│   └── supabase.js
├── controllers/
│   ├── adminController.js
│   ├── antreanController.js
│   ├── authController.js
│   ├── dokterController.js
│   ├── fasilitasController.js
│   ├── jadwalDokterController.js
│   ├── layananController.js
│   ├── pasienController.js
│   ├── pasienAuthController.js
│   ├── passwordResetController.js
│   └── riwayatAntreanController.js
├── middleware/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
├── routes/
│   ├── adminRoutes.js
│   ├── antreanRoutes.js
│   ├── authRoutes.js
│   ├── dokterRoutes.js
│   ├── fasilitasRoutes.js
│   ├── jadwalDokterRoutes.js
│   ├── layananRoutes.js
│   ├── pasienRoutes.js
│   ├── pasienAuthRoutes.js
│   ├── passwordResetRoutes.js
│   └── riwayatAntreanRoutes.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── qcare.sql
└── server.js
```

*Catatan: Struktur di atas merupakan gambaran modul utama. Sesuaikan nama file dengan struktur aktual pada repository.*

## Persyaratan

Pastikan perangkat sudah memiliki:

- Node.js dan npm.
- Akun dan project Supabase.
- Postman untuk pengujian API.

## Instalasi dan Menjalankan Proyek

### 1. Clone Repository

```bash
git clone https://github.com/Nazakee/Projek-Akhir-QCARE-BE.git
```

### 2. Masuk ke Folder Proyek

```bash
cd Projek-Akhir-QCARE-BE
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Konfigurasi Environment

Buat file `.env` pada folder utama proyek.

Isi konfigurasi berikut:

```env
PORT=3000
SUPABASE_URL=your_supabase_project_url
SUPABASE_SECRET_KEY=your_supabase_secret_key
JWT_SECRET=your_long_random_jwt_secret
```

Ganti nilai contoh dengan konfigurasi milik sendiri.

**Penting:** Jangan mengunggah file `.env`, Supabase secret/service-role key, atau JWT secret ke GitHub.

### 5. Konfigurasi Database

Pastikan skema database dan fungsi PostgreSQL yang dibutuhkan sudah dibuat pada project Supabase.

File `qcare.sql` dapat digunakan sebagai referensi skema database yang tersedia di repository.

Fitur antrean atomik dan perubahan status antrean juga memerlukan fungsi RPC PostgreSQL yang digunakan oleh controller.

### 6. Menjalankan Server

Mode pengembangan:

```bash
npm run dev
```

Mode biasa:

```bash
npm start
```

Secara default, server berjalan pada:

```text
http://localhost:3000
```

## Endpoint API

Base URL:

```text
http://localhost:3000
```

### Informasi Server

| Method | Endpoint | Keterangan | Akses |
|---|---|---|---|
| GET | `/` | Informasi dasar API | Publik |
| GET | `/api/health` | Pemeriksaan status server | Publik |

### Autentikasi

| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/api/auth/login` | Login admin |
| POST | `/api/pasien-auth/register` | Registrasi pasien |
| POST | `/api/pasien-auth/login` | Login pasien |

### Reset Password

| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/api/password-reset/request` | Meminta OTP reset password |
| POST | `/api/password-reset/verify` | Memverifikasi OTP |
| POST | `/api/password-reset/reset` | Mengatur password baru |

### Data Pasien

| Method | Endpoint | Keterangan | Akses |
|---|---|---|---|
| GET | `/api/pasien` | Mengambil seluruh data pasien | Admin |
| GET | `/api/pasien/:id` | Mengambil detail pasien | Admin / pasien pemilik |
| POST | `/api/pasien` | Menambahkan data pasien | Admin |
| PUT | `/api/pasien/:id` | Memperbarui data pasien | Admin / pasien pemilik |
| DELETE | `/api/pasien/:id` | Menghapus data pasien | Admin |

### Data Fasilitas Kesehatan

| Method | Endpoint | Keterangan | Akses |
|---|---|---|---|
| GET | `/api/fasilitas` | Mengambil seluruh fasilitas | Admin / pasien |
| GET | `/api/fasilitas/:id` | Mengambil detail fasilitas | Admin / pasien |
| POST | `/api/fasilitas` | Menambahkan fasilitas | Admin |
| PUT | `/api/fasilitas/:id` | Memperbarui fasilitas | Admin |
| DELETE | `/api/fasilitas/:id` | Menghapus fasilitas | Admin |

### Data Layanan

| Method | Endpoint | Keterangan | Akses |
|---|---|---|---|
| GET | `/api/layanan` | Mengambil seluruh layanan | Admin / pasien |
| GET | `/api/layanan/:id` | Mengambil detail layanan | Admin / pasien |
| POST | `/api/layanan` | Menambahkan layanan | Admin |
| PUT | `/api/layanan/:id` | Memperbarui layanan | Admin |
| DELETE | `/api/layanan/:id` | Menghapus layanan | Admin |

### Data Dokter

| Method | Endpoint | Keterangan | Akses |
|---|---|---|---|
| GET | `/api/dokter` | Mengambil seluruh dokter | Admin / pasien |
| GET | `/api/dokter/:id` | Mengambil detail dokter | Admin / pasien |
| POST | `/api/dokter` | Menambahkan dokter | Admin |
| PUT | `/api/dokter/:id` | Memperbarui dokter | Admin |
| DELETE | `/api/dokter/:id` | Menghapus dokter | Admin |

### Jadwal Dokter

| Method | Endpoint | Keterangan | Akses |
|---|---|---|---|
| GET | `/api/jadwal-dokter` | Mengambil seluruh jadwal dokter | Admin / pasien |
| GET | `/api/jadwal-dokter/:id` | Mengambil detail jadwal dokter | Admin / pasien |
| POST | `/api/jadwal-dokter` | Menambahkan jadwal dokter | Admin |
| PUT | `/api/jadwal-dokter/:id` | Memperbarui jadwal dokter | Admin |
| DELETE | `/api/jadwal-dokter/:id` | Menghapus jadwal dokter | Admin |

### Data Admin

| Method | Endpoint | Keterangan | Akses |
|---|---|---|---|
| GET | `/api/admin` | Mengambil data admin | Admin |
| GET | `/api/admin/:id` | Mengambil detail admin | Admin |
| POST | `/api/admin` | Menambahkan admin | Admin |
| PUT | `/api/admin/:id` | Memperbarui admin | Admin |
| DELETE | `/api/admin/:id` | Menghapus admin | Admin |

### Antrean

| Method | Endpoint | Keterangan | Akses |
|---|---|---|---|
| GET | `/api/antrean` | Mengambil seluruh data antrean | Admin |
| GET | `/api/antrean/:id` | Mengambil detail antrean | Admin / pasien pemilik |
| POST | `/api/antrean` | Membuat pendaftaran antrean | Pasien / admin |
| PUT | `/api/antrean/:id` | Memperbarui status atau data antrean sesuai aturan | Admin / pasien pemilik untuk pembatalan |
| DELETE | `/api/antrean/:id` | Menghapus data antrean | Admin |

### Riwayat Antrean

| Method | Endpoint | Keterangan | Akses |
|---|---|---|---|
| GET | `/api/riwayat-antrean` | Mengambil seluruh riwayat antrean | Admin |
| GET | `/api/riwayat-antrean/:id` | Mengambil detail riwayat antrean | Admin / pasien pemilik |
| POST | `/api/riwayat-antrean` | Menambahkan riwayat antrean | Admin |
| PUT | `/api/riwayat-antrean/:id` | Memperbarui riwayat antrean | Admin |
| DELETE | `/api/riwayat-antrean/:id` | Menghapus riwayat antrean | Admin |

## Autentikasi Endpoint

Endpoint yang memerlukan autentikasi menggunakan JWT melalui header `Authorization`.

```http
Authorization: Bearer <JWT_TOKEN>
```

Gunakan token hasil login sesuai role akun.

- Token dengan role `admin` digunakan untuk mengakses endpoint administratif.
- Token dengan role `pasien` digunakan untuk mengakses fitur pasien.
- Endpoint yang mengakses data pribadi pasien akan memeriksa kepemilikan data berdasarkan ID pasien pada token.

## Pengujian Menggunakan Postman

1. Jalankan server lokal.
2. Login melalui endpoint autentikasi admin atau pasien.
3. Salin token dari respons login.
4. Buka tab **Authorization** pada request yang membutuhkan autentikasi.
5. Pilih tipe **Bearer Token**.
6. Masukkan token hasil login.
7. Tentukan method, URL, dan Body JSON sesuai endpoint.
8. Periksa status HTTP dan respons JSON.

Contoh pemeriksaan server:

```http
GET http://localhost:3000/api/health
```

Contoh mengambil daftar fasilitas:

```http
GET http://localhost:3000/api/fasilitas
Authorization: Bearer <JWT_TOKEN>
```

## Keamanan dan Catatan Pengembangan

- Password tidak disimpan dalam bentuk teks biasa.
- `password_hash` tidak ditampilkan dalam respons API pasien.
- File `.env` dan kredensial rahasia tidak boleh diunggah ke repository.
- Supabase secret/service-role key hanya digunakan pada lingkungan backend.
- JWT digunakan untuk autentikasi dan pembatasan akses berdasarkan role.
- Akses data pasien diperiksa berdasarkan kepemilikan akun.
- Fungsi database untuk operasi antrean atomik memiliki pembatasan hak eksekusi.
- Untuk penggunaan produksi, diperlukan konfigurasi pengiriman OTP melalui email, rate limiting, logging yang sesuai, dan pengelolaan secret yang aman.

## Status Pengembangan

Backend QCare telah mencakup:

- Pengelolaan data utama.
- Autentikasi admin dan pasien.
- Otorisasi berdasarkan role.
- Reset password berbasis OTP untuk tahap pengembangan.
- Pendaftaran antrean otomatis.
- Validasi kuota dan jadwal dokter.
- Pencegahan antrean ganda.
- Pembatalan dan perubahan status antrean.
- Pencatatan riwayat antrean.
- Validasi dan pengamanan akses data pasien.

Pengujian endpoint dilakukan secara bertahap menggunakan Postman. Pengembangan dan audit modul backend masih dapat dilanjutkan.

---

Dikembangkan untuk proyek **QCare — Sistem Antrean Online Fasilitas Kesehatan**.
