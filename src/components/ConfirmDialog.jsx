import React, { useEffect, useRef } from 'react';
import './Dialog.css'; // Satu file CSS untuk kedua dialog

const ConfirmDialog = ({ open, onClose, onConfirm, title, message }) => {
  const dialogRef = useRef(null);

  // Mengontrol dialog secara manual menggunakan .showModal() dan .close()
  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [open]);

  const handleConfirm = () => {
    onConfirm();
    onClose(); // Tutup dialog setelah konfirmasi
  };

  return (
    /* DIUBAH: Hapus is-dark */
    <dialog className="nes-dialog is-rounded" ref={dialogRef} onClose={onClose}>
      <form method="dialog" className="dialog-form">
        <p className="title">{title}</p>
        <p>{message}</p>
        <menu className="dialog-menu">
          <button className="nes-btn" onClick={onClose} type="button">
            Batal
          </button>
          <button className="nes-btn is-primary" onClick={handleConfirm} type="button">
            Konfirmasi
          </button>
        </menu>
      </form>
    </dialog>
  );
};

export default ConfirmDialog;
