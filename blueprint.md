# Blueprint Proyek: Voucher Kopi dApp v2.0 (Edisi Fitur Lengkap)

## Tinjauan

Proyek ini adalah aplikasi web terdesentralisasi (dApp) yang ditingkatkan, memungkinkan pengguna untuk membuat, menukarkan, mentransfer, dan memperdagangkan berbagai jenis voucher kopi dalam bentuk NFT. Versi 2.0 mengubah aplikasi dari prototipe sederhana menjadi platform yang kaya fitur dengan fokus pada keterlibatan pengguna, utilitas bisnis, dan pengalaman visual yang unik.

Visi utamanya adalah menciptakan ekosistem digital untuk pecinta kopi, di mana voucher tidak hanya berfungsi sebagai utilitas tetapi juga sebagai barang koleksi digital dengan program loyalitas terintegrasi.

---

## Tumpukan Teknologi

*   **Blockchain:** Lisk L2 (EVM)
*   **Smart Contract:** Solidity
*   **Lingkungan Backend:** Hardhat
*   **Framework Frontend:** React.js
*   **Pustaka UI:** Material-UI (MUI)
*   **Styling:** Emotion, CSS Kustom
*   **Jembatan Web3:** Wagmi (dikonfigurasi untuk Xellar Wallet)
*   **Routing:** React Router DOM
*   **Utilitas Tambahan:** `qrcode.react` untuk penukaran
*   **Pengujian:** Vitest (Frontend), Hardhat (Backend)

---

## Roadmap Arsitektur & Fitur (V2.0)

### 1. Voucher Bertingkat atau Bervariasi (Tiered Vouchers)
*   **Implementasi:** Smart contract akan dimodifikasi untuk mendukung berbagai jenis voucher.
*   **Detail Teknis:**
    *   Sebuah `enum VoucherType` akan didefinisikan di dalam contract (`Espresso`, `Cappuccino`, `Luwak`).
    *   Struktur `Voucher` akan menyertakan `voucherType`.
    *   Fungsi `mint` akan menerima `VoucherType` sebagai argumen untuk membuat voucher yang spesifik.

### 2. Program Loyalitas & Hadiah (Loyalty Program)
*   **Implementasi:** Mekanisme untuk melacak aktivitas pengguna dan memberikan hadiah.
*   **Detail Teknis:**
    *   Smart contract akan memiliki *mapping* `(address => uint256) public redeemedCount` untuk menghitung berapa kali setiap pengguna telah menukarkan voucher.
    *   Ini menjadi dasar untuk fitur hadiah di masa depan (misalnya, mendapatkan voucher gratis setelah 10 kali penukaran).

### 3. UI/UX "Pixel Art Modern"
*   **Konsep:** Menggabungkan keandalan dan struktur komponen Material-UI dengan estetika *pixel art* yang retro namun modern.
*   **Implementasi:**
    *   **Tipografi:** Menggunakan font pixelated seperti "Press Start 2P" dari Google Fonts untuk judul dan elemen penting.
    *   **Styling Komponen:** Menyesuaikan komponen MUI dengan `border` yang tegas, `box-shadow` minimalis, dan palet warna yang terinspirasi dari game klasik.
    *   **Ikonografi:** Menggunakan ikon-ikon pixelated jika memungkinkan.

### 4. Halaman & Dashboard Baru
*   **Halaman Profil Pengguna (`/profile`):**
    *   Menampilkan semua voucher NFT yang dimiliki pengguna, dikelompokkan berdasarkan jenisnya.
    *   Menampilkan statistik loyalitas (misalnya, "Sudah menukarkan X voucher").
*   **Dashboard Pemilik Toko (`/owner-dashboard`):**
    *   Halaman yang dilindungi yang hanya dapat diakses oleh pemilik kontrak (`owner`).
    *   Menyediakan antarmuka untuk me-mint voucher baru dari berbagai jenis.

### 5. Sistem Penukaran dengan Kode QR
*   **Alur Kerja:**
    1.  Pada halaman detail setiap voucher, akan ada tombol untuk menghasilkan Kode QR.
    2.  Kode QR ini akan berisi informasi unik tentang voucher tersebut (misalnya, `tokenId`).
    3.  Pemilik toko/barista akan menggunakan halaman khusus (`/redeem-voucher`) di dApp untuk memindai kode QR pelanggan.
    4.  Pemindaian akan memicu transaksi `redeem` di blockchain, memastikan prosesnya aman dan dapat diverifikasi.

### 6. Fitur "Kirim sebagai Hadiah"
*   **Implementasi:** Memungkinkan pengguna untuk menambahkan pesan pribadi saat mentransfer voucher.
*   **Detail Teknis:**
    *   Karena menyimpan string di blockchain mahal, pesan ini kemungkinan besar akan disimpan *off-chain* (opsi: Firebase/Firestore, atau solusi terdesentralisasi seperti IPFS).
    *   Frontend akan menampilkan UI untuk menulis pesan selama proses transfer.

### 7. Integrasi Xellar Wallet
*   **Tujuan:** Memastikan dApp bekerja mulus dengan Xellar Wallet.
*   **Implementasi:** Mengkonfigurasi `wagmi` dan UI koneksi wallet untuk secara eksplisit menampilkan dan merekomendasikan Xellar Wallet sebagai opsi utama.

---

## Rencana Implementasi Bertahap

*   **Fase 1: Fondasi Kontrak Pintar & Logika Inti (Sedang Berlangsung)**
    *   ✅ **Tugas:** Modifikasi `VoucherKopi.sol` untuk mendukung voucher bertingkat dan program loyalitas.
    *   ✅ **Tugas:** Sebarkan ulang (re-deploy) smart contract ke jaringan Lisk.
    *   ✅ **Tugas:** Perbarui ABI dan alamat kontrak di frontend React.
*   **Fase 2: Perombakan UI/UX & Halaman Baru**
    *   **Tugas:** Buat tema "Pixel Art Modern" menggunakan MUI.
    *   **Tugas:** Bangun halaman Profil Pengguna dan Dashboard Pemilik Toko.
*   **Fase 3: Implementasi Fitur Lanjutan & Integrasi**
    *   **Tugas:** Kembangkan fitur "Kirim sebagai Hadiah".
    *   **Tugas:** Implementasikan sistem penukaran dengan Kode QR.
    *   **Tugas:** Konfigurasi dan uji integrasi Xellar Wallet.
