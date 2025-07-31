import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import VoucherCard from './VoucherCard';

// Wrapper untuk menyediakan konteks Router, karena VoucherCard menggunakan <Link>
const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: BrowserRouter });
};

describe('VoucherCard Component', () => {
  // Mock function untuk onRedeem
  const mockOnRedeem = vi.fn();

  // Data mock untuk voucher yang belum ditebus
  const mockVoucher = {
    tokenId: 1,
    name: 'Kopi Susu',
    description: 'Kopi susu Gula Aren',
    image: 'https://art.pixilart.com/sr244b76e199d26.png',
    isRedeemed: false,
  };

  // Data mock untuk voucher yang sudah ditebus
  const mockRedeemedVoucher = {
    ...mockVoucher,
    isRedeemed: true,
  };

  // Reset mocks sebelum setiap tes
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Skenario A: Menampilkan detail dengan benar untuk voucher yang BELUM ditebus', () => {
    renderWithRouter(<VoucherCard voucher={mockVoucher} />);
    expect(screen.getByText('Kopi Susu')).toBeInTheDocument();
    expect(screen.getByText(/ID: 1/i)).toBeInTheDocument();
    const button = screen.getByRole('button', { name: /Gunakan/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('Skenario B: Menampilkan status dengan benar untuk voucher yang SUDAH ditebus', () => {
    renderWithRouter(<VoucherCard voucher={mockRedeemedVoucher} />);
    expect(screen.getByText('Kopi Susu')).toBeInTheDocument();
    const button = screen.getByRole('button', { name: /Sudah Habis/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('Skenario C: Memanggil onRedeem saat tombol "Gunakan" diklik', () => {
    // 1. Render komponen dengan prop onRedeem
    renderWithRouter(<VoucherCard voucher={mockVoucher} onRedeem={mockOnRedeem} />);

    // 2. Cari dan klik tombol "Gunakan"
    const useButton = screen.getByRole('button', { name: /Gunakan/i });
    fireEvent.click(useButton);

    // 3. Verifikasi bahwa onRedeem dipanggil
    expect(mockOnRedeem).toHaveBeenCalledTimes(1);
  });
  
  it('Skenario D: TIDAK memanggil onRedeem untuk voucher yang sudah digunakan', () => {
    // 1. Render komponen dengan voucher yang sudah ditebus
    renderWithRouter(<VoucherCard voucher={mockRedeemedVoucher} onRedeem={mockOnRedeem} />);

    // 2. Tombol "Sudah Habis" seharusnya dinonaktifkan
    const usedButton = screen.getByRole('button', { name: /Sudah Habis/i });
    expect(usedButton).toBeDisabled();

    // 3. (Opsional tapi bagus) Coba klik dan pastikan onRedeem tidak dipanggil
    fireEvent.click(usedButton);
    expect(mockOnRedeem).not.toHaveBeenCalled();
  });
});
