# Blueprint Proyek: Voucher Kopi dApp (V4 - Edisi Pixel Art)

## Tinjauan

Proyek ini adalah aplikasi web terdesentralisasi (dApp) yang memungkinkan pengguna untuk membuat (mint), menebus (redeem), dan mentransfer (transfer) voucher kopi dalam bentuk NFT. Aplikasi ini dibangun dengan fokus pada fungsionalitas yang kuat dan pengalaman pengguna yang unik dengan **antarmuka bergaya pixel art retro**.

---

## Tumpukan Teknologi

*   **Blockchain:** Lisk L2 (EVM)
*   **Smart Contract:** Solidity
*   **Lingkungan Backend:** Hardhat
*   **Framework Frontend:** React.js
*   **Pustaka UI:** **NES.css** (framework CSS bergaya retro)
*   **Font:** Press Start 2P (via Google Fonts)
*   **Jembatan Web3:** Wagmi
*   **Routing:** React Router DOM
*   **Pengujian:** Vitest (Frontend), Hardhat (Backend)

---

## Arsitektur & Fitur (V4)

Aplikasi ini mempertahankan arsitektur multi-halaman dari versi sebelumnya, tetapi seluruh antarmuka pengguna telah dirombak total untuk memberikan nuansa nostalgia game 8-bit.

### 1. Desain & Tampilan

*   **Pustaka Inti:** Menggantikan Material-UI dengan `nes.css` untuk semua komponen: tombol, kontainer, kartu, dialog, dan input.
*   **Tipografi:** Menggunakan font "Press Start 2P" di seluruh aplikasi untuk tampilan pixel-perfect.
*   **Palet Warna:** Mengadopsi palet warna terbatas yang terinspirasi dari konsol game klasik.
*   **Ikonografi:** Menggunakan ikon bergaya pixel dari `nes.css`.
*   **Aset Visual:** Mengganti gambar-gambar yang ada dengan grafis pixel art.

### 2. Struktur Komponen

*   Komponen-komponen React (`LandingPage`, `DappPage`, `VoucherCard`, `TransferDialog`, dll.) telah direfaktor untuk menggunakan elemen HTML standar (`<div>`, `<button>`, `<dialog>`) yang diberi kelas dari `nes.css`, bukan komponen Material-UI.

---

## Rencana Implementasi: Pixel Art Redesign (Selesai)

Berikut adalah langkah-langkah yang diambil untuk merombak UI/UX aplikasi:

1.  **✅ Hapus Dependensi Material-UI:** Menjalankan `npm uninstall` untuk menghapus `@mui/material`, `@emotion/react`, `@emotion/styled`, dan `@mui/icons-material` dari proyek untuk menjaga kebersihan dependensi.
2.  **✅ Instal NES.css:** Menambahkan `nes.css` ke proyek melalui `npm install nes.css`.
3.  **✅ Integrasikan Font & Stylesheet:** Mengimpor font "Press Start 2P" dari Google Fonts dan stylesheet `nes.css` ke dalam file `src/index.css` agar tersedia secara global.
4.  **✅ Refactor Halaman Utama:** Merombak `LandingPage.jsx` dan `DappPage.jsx` untuk menggunakan struktur dan kelas `nes.css`, termasuk `nes-container`, `nes-btn`, dan header kustom.
5.  **✅ Refactor Komponen Voucher:** Mendesain ulang `VoucherGallery.jsx` dan `VoucherCard.jsx` menjadi kartu bergaya retro, lengkap dengan gambar placeholder pixel art baru.
6.  **✅ Refactor Halaman Detail:** Mengubah `VoucherDetailPage.jsx` agar menampilkan detail NFT dalam sebuah `nes-container` yang besar dan jelas.
7.  **✅ Refactor Dialog Interaktif:** Mengimplementasikan ulang `ConfirmDialog.jsx` dan `TransferDialog.jsx` menggunakan elemen `<dialog>` dan kelas `nes-dialog` untuk konsistensi tema.
8.  **✅ Styling Global:** Menambahkan latar belakang berpola pixel pada `App.css` untuk melengkapi tampilan retro secara keseluruhan.
9.  **✅ Verifikasi & Pembersihan:** Memeriksa seluruh aplikasi untuk memastikan semua komponen telah dimigrasi dengan benar dan tidak ada sisa-sisa dari Material-UI.
