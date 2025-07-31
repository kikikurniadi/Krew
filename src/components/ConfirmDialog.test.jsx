import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ConfirmDialog from './ConfirmDialog';

// Mocking dialog methods for JSDOM environment
HTMLDialogElement.prototype.showModal = vi.fn();
HTMLDialogElement.prototype.close = vi.fn();

describe('ConfirmDialog Component', () => {
  // Mock functions untuk props
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();

  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    onConfirm: mockOnConfirm,
    title: 'Judul Tes',
    message: 'Apakah Anda yakin?',
  };

  // Bersihkan mock sebelum setiap tes
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Tes tidak perlu lagi merender di body, karena masalahnya ada pada visibilitas
  it('Skenario A: Menampilkan judul dan pesan dengan benar', () => {
    render(<ConfirmDialog {...defaultProps} />);

    // Mencari elemen teks tidak memerlukan opsi 'hidden'
    expect(screen.getByText('Judul Tes')).toBeInTheDocument();
    expect(screen.getByText('Apakah Anda yakin?')).toBeInTheDocument();
  });

  it('Skenario B: Memanggil onClose saat tombol "Batal" diklik', () => {
    render(<ConfirmDialog {...defaultProps} />);

    // PERBAIKAN: Tambahkan { hidden: true } untuk mencari di dalam dialog
    const cancelButton = screen.getByRole('button', { name: /Batal/i, hidden: true });
    fireEvent.click(cancelButton);

    // Harapannya, hanya onClose yang dipanggil
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it('Skenario C: Memanggil onConfirm dan onClose saat tombol "Konfirmasi" diklik', () => {
    render(<ConfirmDialog {...defaultProps} />);

    // PERBAIKAN: Tambahkan { hidden: true } untuk mencari di dalam dialog
    const confirmButton = screen.getByRole('button', { name: /Konfirmasi/i, hidden: true });
    fireEvent.click(confirmButton);

    // Harapannya, onConfirm dan onClose keduanya dipanggil
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
