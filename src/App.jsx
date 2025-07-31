import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Impor semua halaman yang sudah kita buat
import LandingPage from './pages/LandingPage.jsx';
import DappPage from './pages/DappPage.jsx';
import VoucherDetailPage from './pages/VoucherDetailPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx'; // BARU: Impor halaman 404

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app" element={<DappPage />} />
      <Route path="/voucher/:tokenId" element={<VoucherDetailPage />} />
      
      {/* BARU: Rute catch-all untuk halaman yang tidak ditemukan */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
