# Blueprint Proyek: Voucher Kopi dApp

## Tinjauan

Proyek ini adalah aplikasi web terdesentralisasi (dApp) satu halaman yang memungkinkan pengguna untuk membuat (mint) dan menebus (redeem) voucher kopi dalam bentuk NFT di blockchain Lisk. Aplikasi ini dirancang agar mudah digunakan, menarik secara visual dengan Material-UI, dan siap untuk adopsi massal.

---

## Tumpukan Teknologi

- **Blockchain:** Lisk L2 (EVM)
- **Smart Contract:** Solidity
- **Lingkungan Backend:** Hardhat
- **Framework Frontend:** React.js
- **Pustaka Komponen UI:** Material-UI (MUI)
- **Jembatan Web3:** Wagmi

---

## Arsitektur & Fitur

Aplikasi ini menggunakan arsitektur satu halaman (Single-Page Application) untuk pengalaman pengguna yang cepat dan terfokus.

- **Tujuan:** Menyediakan semua fungsionalitas inti dApp dalam satu antarmuka yang bersih.
- **Fitur Utama:**
  - **Header Aplikasi:** Bilah navigasi atas yang menampilkan judul aplikasi dan tombol koneksi dompet.
  - **Koneksi Dompet:** Tombol untuk menghubungkan dompet EVM pengguna (misalnya, MetaMask).
  - **Panel Aksi:** Area dengan tombol "Buat Voucher Baru" dan "Segarkan Koleksi".
  - **Umpan Balik Transaksi:** Pesan notifikasi untuk status transaksi (menunggu, berhasil, gagal).
  - **Galeri Voucher:** Menampilkan semua voucher NFT yang dimiliki pengguna dalam tata letak kartu yang responsif.
  - **Kartu Voucher:** Setiap kartu menampilkan gambar, nama, ID, dan tombol "Gunakan Voucher".
- **Komponen Terkait:** `App.jsx`, `VoucherGallery.jsx`, `VoucherCard.jsx`

---

## Alur Pengguna

1.  Pengguna tiba di aplikasi.
2.  Mereka mengklik **"Connect Wallet"** untuk menyambungkan dompet mereka.
3.  Setelah terhubung, mereka dapat mengklik **"Buat Voucher Baru"** untuk membuat NFT.
4.  Voucher yang baru dibuat akan muncul di **Galeri Voucher**.
5.  Pengguna dapat mengklik **"Gunakan Voucher"** pada NFT yang mereka miliki untuk menebusnya.
