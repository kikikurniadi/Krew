import React, { useState, useEffect, useRef } from 'react';
import './Dialog.css';

const TransferDialog = ({ open, onClose, onConfirm, isLoading }) => {
  const [recipient, setRecipient] = useState('');
  const dialogRef = useRef(null);

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [open]);

  const handleConfirm = () => {
    if (recipient) {
      onConfirm(recipient);
      // Jangan tutup dialog di sini, biarkan parent yang mengontrol
    }
  };
  
  // Reset input field saat dialog ditutup
  useEffect(() => {
    if (!open) {
      setRecipient('');
    }
  }, [open]);

  return (
    /* DIUBAH: Hapus is-dark */
    <dialog className="nes-dialog is-rounded" ref={dialogRef} onClose={onClose}>
      <form method="dialog" className="dialog-form" onSubmit={(e) => e.preventDefault()}>
        <p className="title">Transfer Voucher</p>
        <div className="nes-field">
          <label htmlFor="recipient_field">Alamat Penerima:</label>
          <input 
            type="text" 
            id="recipient_field" 
            className="nes-input" 
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            disabled={isLoading}
          />
        </div>
        <menu className="dialog-menu">
          <button className="nes-btn" onClick={onClose} disabled={isLoading} type="button">
            Batal
          </button>
          <button 
            className={`nes-btn is-primary ${isLoading ? 'is-disabled' : ''}`} 
            onClick={handleConfirm}
            disabled={isLoading || !recipient}
            type="button"
          >
            {isLoading ? 'Memproses...' : 'Kirim'}
          </button>
        </menu>
        {isLoading && <progress className="nes-progress is-pattern" value="100" max="100"></progress>}
      </form>
    </dialog>
  );
};

export default TransferDialog;
