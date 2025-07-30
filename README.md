# Voucher Kopi dApp ☕

Selamat datang di Voucher Kopi dApp, sebuah aplikasi web terdesentralisasi (dApp) yang dibangun di atas blockchain Lisk (L2 EVM). Aplikasi ini memungkinkan pengguna untuk membuat (mint) dan menebus (redeem) voucher kopi dalam bentuk NFT, menyediakan contoh nyata penggunaan teknologi Web3 untuk kasus penggunaan sehari-hari.

Proyek ini dirancang agar bersih, modern, dan mudah dipahami, baik bagi pengguna maupun pengembang.

## ✨ Fitur Utama

- **Koneksi Dompet:** Terintegrasi dengan dompet browser EVM (seperti MetaMask) menggunakan Wagmi.
- **Minting NFT:** Pengguna dapat membuat voucher NFT baru dengan satu kali klik.
- **Galeri NFT:** Menampilkan semua voucher yang dimiliki pengguna secara dinamis.
- **Redeeming NFT:** Pengguna dapat "menggunakan" voucher mereka, yang akan mengubah statusnya di dalam smart contract.
- **Antarmuka Profesional:** Dibangun dengan React dan Material-UI (MUI) untuk pengalaman pengguna yang modern dan responsif.
- **Umpan Balik Real-time:** Notifikasi untuk status transaksi (menunggu, berhasil, gagal).

## 🚀 Tumpukan Teknologi

- **Smart Contract:** Solidity, OpenZeppelin
- **Blockchain:** Lisk L2 (EVM)
- **Lingkungan Backend:** Hardhat
- **Framework Frontend:** React.js
- **Pustaka UI:** Material-UI (MUI)
- **Jembatan Web3:** Wagmi, Ethers.js
- **Build Tool:** Vite
- **Kualitas Kode:** ESLint, Prettier

## 🛠️ Menjalankan Proyek Secara Lokal

Untuk menjalankan proyek ini di lingkungan pengembangan Anda, ikuti langkah-langkah berikut:

### 1. Prasyarat

- [Node.js](https://nodejs.org/) (versi 20 atau lebih tinggi)
- [Git](https://git-scm.com/)
- Dompet browser seperti [MetaMask](https://metamask.io/)

### 2. Instalasi

Klona repositori ini dan instal semua dependensi yang diperlukan.

```bash
git clone <URL_REPOSITORI_ANDA>
cd voucher-kopi
npm install
```

### 3. Konfigurasi Lingkungan

Proyek ini memerlukan beberapa kunci privat untuk men-deploy smart contract.

- Buat file `.env` di direktori utama proyek.
- Tambahkan kunci privat dompet Anda ke dalamnya:

```
WALLET_KEY=YOUR_64_CHARACTER_PRIVATE_KEY
```

**Penting:** Pastikan dompet ini memiliki dana di jaringan Lisk Sepolia Testnet. Anda bisa mendapatkan dana dari [Faucet Lisk](https://faucet.lisk.com/).

### 4. Deploy Smart Contract

Deploy kontrak `VoucherKopi.sol` ke jaringan Lisk Sepolia.

```bash
npx hardhat run scripts/deploy.cjs --network lisk-sepolia
```

Setelah berhasil, terminal akan menampilkan alamat kontrak yang telah di-deploy. **Salin alamat ini.**

### 5. Hubungkan Frontend ke Kontrak

- Buka file `src/App.jsx`.
- Temukan variabel `CONTRACT_ADDRESS`.
- Ganti nilainya dengan alamat kontrak yang telah Anda salin.

### 6. Jalankan Aplikasi

Sekarang Anda siap untuk menjalankan aplikasi frontend.

```bash
npm run dev
```

Buka URL lokal yang ditampilkan di terminal (biasanya `http://localhost:5173`) di browser tempat Anda memasang MetaMask.
