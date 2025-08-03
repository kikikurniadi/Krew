
import { http, createConfig } from 'wagmi';
import { liskSepolia } from 'wagmi/chains';
import { injected, walletConnect, safe } from 'wagmi/connectors';

// ID Proyek WalletConnect - Sebaiknya gunakan variabel lingkungan untuk ini di produksi
const projectId = 'e898f8a8b1323f6563e41427215c4c1a'; 

// Mendapatkan URL aplikasi secara dinamis untuk metadata WalletConnect
const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://voucherkopi.app';

export const config = createConfig({
  // Menentukan rantai (chain) yang didukung oleh aplikasi
  chains: [liskSepolia],
  
  // Mengonfigurasi berbagai cara pengguna dapat menghubungkan dompet mereka
  connectors: [
    /**
     * Konektor untuk dompet yang di-inject ke dalam peramban.
     * Ini adalah prioritas utama dan akan mendeteksi dompet seperti Xellar, MetaMask, atau Coinbase Wallet.
     * Label yang lebih deskriptif ditambahkan untuk kejelasan pengguna.
     */
    injected({
      label: 'Browser Wallet (Xellar, MetaMask, dll.)',
    }), 
    
    /**
     * Konektor untuk WalletConnect, memungkinkan koneksi dengan ratusan dompet seluler dan desktop.
     * showQrModal = false mencegah modal QR muncul secara otomatis di desktop,
     * memberikan pengalaman yang lebih baik jika pengguna juga memiliki dompet ekstensi.
     */
    walletConnect({ 
      projectId,
      metadata: {
        name: 'Voucher Kopi dApp',
        description: 'Aplikasi desentralisasi untuk voucher kopi berbasis NFT yang terintegrasi dengan Xellar.',
        url: appUrl,
        icons: [`${appUrl}/icon.png`] // Pastikan ikon tersedia di direktori public
      },
      showQrModal: false, // Optimalisasi untuk desktop
    }),

    /**
     * Konektor untuk dompet Safe (sebelumnya Gnosis Safe), populer untuk manajemen aset tim.
     */
    safe(),
  ],
  
  // Menentukan bagaimana aplikasi berkomunikasi dengan blockchain (misalnya, melalui HTTP RPC)
  transports: {
    [liskSepolia.id]: http(),
  },
});
