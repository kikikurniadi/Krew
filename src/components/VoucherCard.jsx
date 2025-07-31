import React from 'react';
import { Link } from 'react-router-dom';
import './VoucherCard.css';

// Gambar placeholder pixel art baru
const PIXEL_ART_COFFEE_CUP = "https://art.pixilart.com/sr244b76e199d26.png";

const VoucherCard = ({ voucher, onRedeem }) => {
  const { tokenId, name, isRedeemed } = voucher;

  return (
    <div className={`nes-container with-title is-centered voucher-card ${isRedeemed ? 'is-disabled' : ''}`}>
      <p className="title">{`ID: ${tokenId}`}</p>
      
      <Link to={`/voucher/${tokenId}`} className="image-link">
        <img src={PIXEL_ART_COFFEE_CUP} alt={name} className="voucher-image" />
      </Link>

      <h3 className="voucher-name">{name}</h3>

      <div className="voucher-status">
        {isRedeemed ? (
          <span className="nes-text is-error">Telah Digunakan</span>
        ) : (
          <span className="nes-text is-success">Dapat Digunakan</span>
        )}
      </div>

      <button
        type="button"
        className={`nes-btn ${isRedeemed ? 'is-disabled' : 'is-warning'}`}
        disabled={isRedeemed}
        onClick={onRedeem}
      >
        {isRedeemed ? 'Sudah Habis' : 'Gunakan'}
      </button>
    </div>
  );
};

export default VoucherCard;
