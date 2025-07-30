import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Konfigurasi ini penting untuk lingkungan berbasis cloud/proxy
    hmr: {
      // Memberitahu Vite untuk menggunakan port 443 (HTTPS standar)
      // untuk koneksi WebSocket dari sisi klien.
      clientPort: 443,
    },
  },
});
