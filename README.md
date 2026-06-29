# SEAPEDIA Frontend Documentation

## Tech Stack

- React 18 + Vite
- React Router DOM v6
- Axios
- Tailwind CSS

---

## Deployment

| Platform | URL                                   |
|----------|---------------------------------------|
| Frontend | https://seapedia-project-fe.vercel.app |
| Backend  | https://seapedia-project-be-production.up.railway.app |
| API Documentation | https://ristek.link/SeapediaAPIDocCompfest18 |

---

## Getting Started


### Environment Variables

Buat file `.env` di root folder frontend:

```env
VITE_API_URL=http://localhost:8080/api
```

### Menjalankan App (Local)

```bash
npm install
npm run dev
```

### Menjalankan dengan Docker (Rekomendasi)

Pastikan Docker Desktop sudah terinstall dan berjalan.

Repository backend (`seapedia-project-be`) dan frontend (`seapedia-project-fe`) harus berada di folder yang sama (sibling).

Jalankan dari folder backend:

```bash
cd ../seapedia-project-be
docker compose up --build
```

Perintah di atas akan menjalankan 3 container: PostgreSQL, Spring Boot (port 8080), dan frontend (port 3000).

Akses aplikasi di `http://localhost:3000`. Pastikan backend sudah siap (seed data berjalan otomatis).

---

## Struktur Halaman

| Path                               | Role          | Deskripsi                          |
|------------------------------------|---------------|------------------------------------|
| `/`                                | Public        | Halaman utama                      |
| `/products`                        | Public        | Katalog produk                     |
| `/products/:id`                    | Public        | Detail produk                      |
| `/stores`                          | Public        | Daftar toko                        |
| `/stores/:id`                      | Public        | Detail toko                        |
| `/search`                          | Public        | Hasil pencarian                    |
| `/promos`                          | Public        | Promo & voucher                    |
| `/login`                           | Public        | Login                              |
| `/register`                        | Public        | Registrasi                         |
| `/select-role`                     | Auth          | Pilih role aktif (multi-role)      |
| `/profile`                         | Auth          | Profil & ringkasan keuangan        |
| `/dashboard/buyer`                 | BUYER         | Dashboard buyer                    |
| `/dashboard/buyer/cart`            | BUYER         | Keranjang belanja                  |
| `/dashboard/buyer/orders`          | BUYER         | Riwayat order                      |
| `/dashboard/buyer/orders/:orderId` | BUYER         | Detail order                       |
| `/dashboard/buyer/wallet`          | BUYER         | Wallet & top-up                    |
| `/dashboard/buyer/addresses`       | BUYER         | Kelola alamat kirim                |
| `/dashboard/buyer/report`          | BUYER         | Laporan pengeluaran                |
| `/dashboard/seller`                | SELLER        | Dashboard seller                   |
| `/dashboard/seller/store`          | SELLER        | Kelola toko                        |
| `/dashboard/seller/products`       | SELLER        | Manajemen produk                   |
| `/dashboard/seller/products/new`   | SELLER        | Tambah produk baru                 |
| `/dashboard/seller/products/edit/:id` | SELLER     | Edit produk                        |
| `/dashboard/seller/orders/incoming`| SELLER        | Order masuk                        |
| `/dashboard/seller/orders/:orderId`| SELLER        | Detail order masuk                 |
| `/dashboard/seller/report`         | SELLER        | Laporan pendapatan                 |
| `/dashboard/driver`                | DRIVER        | Dashboard driver                   |
| `/dashboard/driver/jobs`           | DRIVER        | Job tersedia                       |
| `/dashboard/driver/jobs/:jobId`    | DRIVER        | Detail job                         |
| `/dashboard/driver/active`         | DRIVER        | Job aktif                          |
| `/dashboard/driver/report`         | DRIVER        | Laporan penghasilan                |
| `/dashboard/admin`                 | ADMIN         | Dashboard admin                    |
| `/dashboard/admin/orders/:orderId` | ADMIN         | Detail pesanan                     |
| `/dashboard/admin/users/:userId`   | ADMIN         | Detail pengguna                    |

---

## Autentikasi & Session


### Alur Login

1. User login, lalu backend mengembalikan JWT token.
2. Token disimpan di localStorage.
3. Semua request ke backend otomatis menyertakan `Authorization: Bearer <token>`.

### Token Expiry & Silent Token Refresh

Token di-refresh otomatis tanpa interaksi user jika sisa waktu kurang dari 2 menit:

1. Default expiry adalah  15 menit.
2. Saat app pertama kali dimuat, token expired otomatis dibersihkan dari localStorage.
3. Request interceptor Axios cek expiry sebelum setiap request.
4. Jika token hampir expired, hit POST /auth/refresh terlebih dahulu.
5. Token baru disimpan ke localStorage dan digunakan untuk request asli.

### Logout

- Klik tombol logout, frontend hit POST /api/auth/logout (backend akan blacklist token).
- localStorage dibersihkan.
- User di-redirect ke `/`.

---

## Protected Routes

ProtectedRoute di App.jsx memiliki dua lapisan perlindungan:

1. Cek token, jika tidak ada atau expired, redirect ke /login.
2. Cek role, jika activeRole tidak sesuai halaman yang diakses, redirect ke dashboard role yang aktif.

Mengubah URL secara manual di browser tidak bisa melewati guard ini karena token expiry selalu dicek secara lokal.

---

## Single-Store Checkout


Cart hanya bisa berisi produk dari satu toko dalam satu waktu.

Behavior di UI:
- Saat menambah produk dari toko berbeda, muncul banner peringatan di halaman cart yang menginformasikan konflik toko.
- Tombol checkout dinonaktifkan selama ada konflik toko.
- User harus mengosongkan cart terlebih dahulu sebelum bisa menambah produk dari toko lain.

Enforcement di backend:
- CartServiceImpl menolak penambahan item dari toko berbeda saat addToCart.
- OrderServiceImpl memvalidasi ulang konsistensi toko saat checkout.

---

## Checkout & Kalkulasi Harga


### Urutan Kalkulasi

```
subtotal        = Σ (harga × kuantitas) semua item
discountAmount  = potongan dari kode diskon (voucher atau promo)
taxBase         = subtotal - discountAmount
PPN 12%         = round(taxBase × 12 / 100)
totalAmount     = taxBase + deliveryFee + PPN 12%
```

Diskon dipotong sebelum PPN sehingga PPN dikenakan pada harga setelah diskon.

### Metode Pengiriman & Ongkos Kirim

| Metode    | Ongkos Kirim | SLA                         |
|-----------|-------------|-----------------------------|
| INSTANT   | Rp 25.000   | 2 jam                       |
| NEXT DAY  | Rp 15.000   | 2 hari (hari ini dan besok) |
| REGULAR   | Rp 10.000   | 7 hari                      |

### Kode Diskon

- Satu kode per transaksi (tidak bisa kombinasi).
- Bisa berupa voucher (batas penggunaan) atau promo (tanpa batas).
- Diskon tipe persentase memiliki batas maksimal potongan.
- Kode bersifat case-insensitive.

---

## Testing Guide


### Persiapan (lengkapnya untuk backend ada di README backend)

1. Jalankan backend (`./gradlew bootRun`) dan frontend (`npm run dev`).
2. Pastikan database PostgreSQL sudah berjalan dan environment variables sudah dikonfigurasi.
3. Pastikan user admin sudah ada di database (lihat bagian Admin Setup di README backend).


### Skenario 0: Guest bisa melihat katalog & review aplikasi 
Step di bawah ini dilakukan tanpa login atau register terlebih dahulu:

1. buka `/products` lalu guest bisa melihat daftar produk dan masuk ke detail produknya (`/products/{id}`).
2. Buka `/stores` dan detail toko lalu guest bisa melihat profil toko tanpa login.
3. Di endpoint `/` atau Home, cari section Ulasan Aplikasi lalu guest mengisi nama, rating, dan komentar dan bisa submit review tanpa login.
4. Refresh halaman lalu review yang baru disubmit tampil di antarmuka.
5. Coba submit review dengan komentar berisi tag HTML/script, contoh: `<script>alert(1)</script>` atau `<b>test</b>`. Frontend menampilkan sebagai text biasa dan tidak dieksekusi sebagai HTML.


### Skenario 1: Registrasi dan login multi-Role

1. Buka `/register`, daftarkan user dengan role BUYER, SELLER, dan DRIVER sekaligus.
2. Login akun tersebut. Karena memiliki beberapa role, user diarahkan ke `/select-role`.
3. Pilih role SELLER lalu token baru diberikan dengan `activeRole: SELLER`.
4. Coba akses `/dashboard/buyer` secara manual di URL bar. Platform akan redirect ke `/dashboard/seller` (bukan error).


### Skenario 2: Seller bisa melakukan setup toko dan produk

1. Login sebagai Seller.
2. Buat toko dengan nama tertentu.
3. Coba edit toko dengan nama yang sama menggunakan akun seller lain. Sistem pasti akan menolak (nama toko harus unik).
4. Buka Kelola Produk, tambahkan minimal 2 produk dengan stok lebih dari 0.
5. Buka `/products` (sebagai guest/buyer). Kedua produk yang baru dibuat muncul di katalog publik.
6. Coba update/edit salah satu produk (ubah harga/stok) dan hapus produk lainnya. Perubahan ini tercermin di katalog publik.


### Skenario 3: Buyer melakukan top up, kelola address, dan checkout single-store

1. Login sebagai Buyer (akun berbeda dari Seller).
2. Buka Wallet, lakukan top-up sehingga saldo bertambah, transaksi tercatat di riwayat wallet.
3. Dari dashboar, buka alamat pengiriman, tambahkan alamat baru dan set sebagai default.
4. Buka halaman produk, tambahkan produk dari dari suatu toko ke cart.
5. Coba tambahkan produk dari toko lain maka muncul banner konflik di halaman cart, tombol checkout nonaktif.
6. Kosongkan cart, tambah produk dari satu toko saja.
7. Buka halaman cart, pilih alamat dan metode pengiriman.
8. Masukkan kode diskon Voucher lalu lihat preview. Ulangi dengan kode Promo di transaksi lain untuk membandingkan kedua tipe diskon.
9. Preview checkout menampilkan subtotal, discountAmount, delivery fee, PPN 12%, dan totalAmount secara terpisah.
10. Konfirmasi checkout lalu order terbuat dengan status awal Sedang Dikemas. Cek stok produk berkurang dan saldo wallet berkurang.


### Skenario 4: Seller melakukan proses order

1. Login sebagai Seller.
2. Buka Order Masuk, lalu order dari buyer muncul dengan status Sedang Dikemas.
3. Klik Proses maka status berubah menjadi Menunggu Pengirim, job pengiriman tersedia untuk driver.


### Skenario 5: Driver bisa mencari, mengambil dan menyelesaikan Job

1. Login sebagai Driver.
2. Buka Job Tersedia, maka job dari order yang diproses seller muncul.
3. Klik Ambil Job maka status order berubah menjadi `SEDANG_DIKIRIM`, job akan dipindah ke Job Aktif.
4. Buka detail job, driver lain tidak bisa mengakses job ini (dicoba login menggunakan akun driver lain).
5. Klik Selesaikan (Konfirmasi Job Selesai) maka status order berubah menjadi `SELESAI`, wallet driver dan seller dikreditkan.
6. Buka Riwayat & Penghasilan maka job yang baru selesai dan earning-nya tercatat. 


### Skenario 6: Buyer bisa melihat riwayat dan status order

1. Login sebagai Buyer yang sama dari Skenario 3.
2. Buka Riwayat Pesanan  maka order yang sudah dibuat tampil dengan status terkini (SELESAI, sesuai dengan Skenario 5).
3. Klik salah satu order, buka detailnya, maka menampilkan timeline status* (Sedang Dikemas → Menunggu Pengirim → Sedang Dikirim → Selesai) lengkap dengan timestamp tiap perubahan.


### Skenario 7: Admin dapat memonitoring, melakukan discount management, dan simulasi overdue

1. Login sebagai Admin.
2. Monitoring dilakukan dengan membuka Admin Dashboard, lalu cek masing-masing menu Pengguna Terbaru, Toko Terbaru, Produk Terbaru, Pesanan Terbaru, Diskon Terbaru (Voucher/Promo), dan Delivery Job Terbaru. 
3. Admin bisa membuat dan melihat seluruh voucher baru (misal kode, persentase, tanggal expired) dan promo baru.
4. Admin bisa melakukan simulasi overdue:
   - Buat order baru sebagai Buyer, proses oleh Seller, tetapi jangan diambil driver.
   - Lihat tab Simulasi Waktu, advance/majukan waktu sesuai SLA metode yang dipilih:
      - INSTANT: minimal 121 menit
      - NEXT DAY: minimal 2.881 menit
      - REGULAR: minimal 10.081 menit
   - Trigger Proses Overdue (atau tunggu scheduler otomatis tiap 30 menit).
   - Cek order sebagai Buyer. Maka statusnya berubah menjadi `DIKEMBALIKAN`, saldo wallet buyer kembali ke nilai sebelum checkout, dan stok produk terkait auto-return.
