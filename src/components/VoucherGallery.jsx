import React from 'react';
import VoucherCard from './VoucherCard';
import './VoucherGallery.css';

const VoucherGallery = ({ vouchers, onRedeem, isLoading }) => {
  if (isLoading && vouchers.length === 0) {
    return (
      /* DIUBAH: Hapus is-dark */
      <div className="gallery-container nes-container with-title">
        <p className="title">Koleksi Anda</p>
        <p>Memuat voucher...</p>
        <progress className="nes-progress is-pattern" value="100" max="100"></progress>
      </div>
    );
  }

  if (!isLoading && vouchers.length === 0) {
    return (
      /* DIUBAH: Hapus is-dark */
      <div className="gallery-container nes-container with-title">
        <p className="title">Koleksi Anda</p>
        <div className="empty-gallery">
          <p>Anda belum memiliki voucher kopi.</p>
          <p>Silakan buat satu untuk memulai!</p>
          <i className="nes-icon empty-cup is-large"></i>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-container nes-container with-title">
      <p className="title">Koleksi Anda</p>
      <div className="vouchers-grid">
        {vouchers.map((voucher) => (
          <VoucherCard
            key={voucher.tokenId}
            voucher={voucher}
            onRedeem={() => onRedeem(voucher.tokenId)}
          />
        ))}
      </div>
    </div>
  );
};

export default VoucherGallery;
