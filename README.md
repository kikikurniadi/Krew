# Voucher Kopi dApp ☕

Voucher Kopi adalah aplikasi web terdesentralisasi (dApp) penuh yang dibangun di atas blockchain Lisk (EVM). Aplikasi ini mendemonstrasikan kasus penggunaan dunia nyata untuk NFT dengan memungkinkan pembuatan, penebusan, dan transfer voucher kopi digital.

Proyek ini dibangun dengan fokus pada praktik pengembangan modern, termasuk arsitektur multi-halaman yang bersih, pengalaman pengguna yang dipoles, dan suite pengujian otomatis yang komprehensif.

---

## ✨ Fitur Utama

-   **Manajemen Voucher NFT:**
    -   **Mint:** Membuat voucher kopi baru sebagai NFT.
    -   **Redeem:** Menebus voucher, sebuah aksi on-chain yang memastikan penggunaan tunggal.
    -   **Transfer:** Mengirim voucher NFT ke pengguna lain dengan aman.
-   **Arsitektur Multi-Halaman:**
    -   **Landing Page (`/`):** Halaman perkenalan yang menarik bagi pengguna baru.
    -   **Halaman Aplikasi (`/app`):** Pusat interaksi utama untuk mengelola dan melihat voucher.
    -   **Halaman Detail (`/voucher/:id`):** Tampilan terperinci untuk setiap voucher, lengkap dengan opsi transfer.
-   **Pengalaman Pengguna (UX) yang Dipoles:**
    -   **Dialog Konfirmasi:** Mencegah aksi yang tidak disengaja (seperti redeem) dengan dialog verifikasi.
    -   **Umpan Balik Transaksi:** Pesan loading yang jelas memberi tahu pengguna status transaksi mereka (menunggu dompet, sedang diproses, berhasil, gagal).
    -   **Halaman 404:** Halaman "Tidak Ditemukan" yang ramah pengguna menangani URL yang tidak valid.
-   **Pengujian Otomatis:**
    -   **Backend:** Tes smart contract menggunakan Hardhat untuk memastikan logika bisnis on-chain berfungsi dengan benar.
    -   **Frontend:** Tes komponen dan interaksi menggunakan Vitest dan React Testing Library untuk memastikan UI stabil dan andal.

---

## 🛠️ Menjalankan Proyek Secara Lokal

Untuk menjalankan proyek ini di lingkungan pengembangan Anda, ikuti langkah-langkah berikut:

### 1. Prasyarat

-   [Node.js](https://nodejs.org/) (versi 20 atau lebih tinggi)
-   [Git](https://git-scm.com/)
-   Dompet browser seperti [MetaMask](https://metamask.io/)

### 2. Instalasi

Klona repositori ini dan instal semua dependensi yang diperlukan.

\`\`\`bash
git clone <URL_REPOSITORI_ANDA>
cd <nama-folder-proyek>
npm install
\`\`\`

### 3. Konfigurasi Lingkungan

-   Buat file `.env` di direktori utama proyek dengan menyalin dari `.env.example` (jika ada) atau membuatnya dari awal.
-   Tambahkan kunci privat dompet Anda ke dalamnya. Dompet ini akan digunakan untuk men-deploy kontrak.

\`\`\`
WALLET_KEY=YOUR_64_CHARACTER_PRIVATE_KEY
\`\`\`

**Penting:** Pastikan dompet ini memiliki dana di jaringan Lisk Sepolia Testnet. Anda bisa mendapatkan dana dari [Faucet Lisk](https://faucet.lisk.com/).

### 4. Deploy Smart Contract

Deploy kontrak `VoucherKopi.sol` ke jaringan Lisk Sepolia.

\`\`\`bash
npx hardhat run scripts/deploy.cjs --network liskSepolia
\`\`\`

Setelah berhasil, salin alamat kontrak yang ditampilkan di terminal dan tempelkan ke variabel `CONTRACT_ADDRESS` di `src/pages/DappPage.jsx` dan `src/pages/VoucherDetailPage.jsx`.

### 5. Menjalankan Tes (Opsional tapi Direkomendasikan)

Jalankan suite pengujian untuk memverifikasi bahwa semuanya bekerja dengan benar.

\`\`\`bash
# Menjalankan semua tes (backend dan frontend)
npm test

# Menjalankan hanya tes frontend
npm run test:frontend

# Menjalankan hanya tes backend (smart contract)
npm run test:backend
\`\`\`

### 6. Menjalankan Aplikasi

Jalankan server pengembangan Vite.

\`\`\`bash
npm run dev
\`\`\`

Aplikasi sekarang akan berjalan di `http://localhost:5173` (atau port lain yang tersedia).
