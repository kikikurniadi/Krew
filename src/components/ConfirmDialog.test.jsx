import React from 'react';
import { render, screen, fireEvent, waitFor } from '../test/test-utils';
import { describe, it, expect, vi } from 'vitest';
import ConfirmDialog from '../components/ConfirmDialog';

describe('ConfirmDialog Component', () => {
  it('Skenario A: Menampilkan judul dan pesan dengan benar', () => {
    render(
      <ConfirmDialog
        open={true}
        title="Judul Konfirmasi"
        message="Ini adalah pesan konfirmasi."
        onConfirm={() => {}}
        onClose={() => {}}
      />
    );

    expect(screen.getByText('Judul Konfirmasi')).toBeInTheDocument();
    expect(screen.getByText('Ini adalah pesan konfirmasi.')).toBeInTheDocument();
  });

  it('Skenario B: Memanggil onClose saat tombol "Batal" diklik', async () => {
    const mockOnClose = vi.fn();
    render(
      <ConfirmDialog
        open={true}
        title="Tes Batal"
        message="Klik batal."
        onConfirm={() => {}}
        onClose={mockOnClose}
      />
    );

    fireEvent.click(screen.getByText('Batal'));
    
    await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it('Skenario C: Memanggil onConfirm dan onClose saat tombol "Konfirmasi" diklik', async () => {
    const mockOnConfirm = vi.fn();
    const mockOnClose = vi.fn();
    render(
      <ConfirmDialog
        open={true}
        title="Tes Konfirmasi"
        message="Klik konfirmasi."
        onConfirm={mockOnConfirm}
        onClose={mockOnClose}
      />
    );

    fireEvent.click(screen.getByText('Konfirmasi'));

    // Harapannya, onConfirm dan onClose keduanya dipanggil
    await waitFor(() => {
        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});
