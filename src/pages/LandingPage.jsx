import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'; // Kita akan buat file CSS kustom

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* DIUBAH: Hapus is-dark */}
      <div className="nes-container with-title is-centered">
        <h1 className="title">Voucher Kopi dApp</h1>
        <p>Selamat Datang di Dunia Kopi Digital!</p>
        
        <div className="logo-container">
          {/* Ganti dengan gambar pixel art yang relevan */}
          <i className="nes-icon is-large cup"></i>
        </div>

        <p className="subtitle">
          Miliki, tukarkan, dan transfer voucher kopi Anda sebagai NFT unik di blockchain.
        </p>

        <button 
          type="button" 
          className="nes-btn is-primary"
          onClick={() => navigate('/app')}
        >
          Masuk ke Aplikasi
        </button>

        {/* DIUBAH: Hapus is-dark */}
        <div className="nes-container with-title is-left tech-stack">
          <p className="title">Tech Stack</p>
          <div className="lists">
            <ul className="nes-list is-circle">
              <li>React.js</li>
              <li>Solidity</li>
              <li>Lisk L2</li>
              <li>NES.css</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
