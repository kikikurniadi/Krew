import React from 'react';
import { render, screen, fireEvent, waitFor } from '../test/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { setMockConnector } from '@wagmi/core/test';
import VoucherCard from '../components/VoucherCard';

// Mock data
const mockOnRedeem = vi.fn();
const mockOnTransfer = vi.fn();
const ownerAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const notOwnerAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';

describe('VoucherCard Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Skenario A: Menampilkan detail dengan benar untuk voucher yang BELUM ditebus', async () => {
        setMockConnector({ accounts: [ownerAddress] });
        axios.get.mockResolvedValue({
            data: { name: 'Kopi Enak', description: 'Voucher untuk secangkir kopi mantap' },
        });

        render(<VoucherCard tokenId={1} onRedeem={mockOnRedeem} onTransfer={mockOnTransfer} />);

        await waitFor(() => {
            expect(screen.getByText('Kopi Enak')).toBeInTheDocument();
            expect(screen.getByText('Voucher untuk secangkir kopi mantap')).toBeInTheDocument();
            expect(screen.getByText('Status: Belum Ditebus')).toBeInTheDocument();
            expect(screen.getByText('Gunakan')).toBeEnabled();
        });
    });

    it('Skenario B: Menampilkan status dengan benar untuk voucher yang SUDAH ditebus', async () => {
        setMockConnector({ accounts: [ownerAddress] });
        axios.get.mockResolvedValue({
            data: { name: 'Kopi Bekas', description: 'Voucher sudah dipakai' },
        });

        // Di sini kita menandai voucher sebagai sudah ditebus
        render(<VoucherCard tokenId={2} onRedeem={mockOnRedeem} onTransfer={mockOnTransfer} isRedeemed={true} />);

        await waitFor(() => {
            expect(screen.getByText('Kopi Bekas')).toBeInTheDocument();
            expect(screen.getByText('Status: Sudah Ditebus')).toBeInTheDocument();
            expect(screen.getByText('Gunakan')).toBeDisabled();
        });
    });

    it('Skenario C: Memanggil onRedeem saat tombol "Gunakan" diklik', async () => {
        setMockConnector({ accounts: [ownerAddress] });
        axios.get.mockResolvedValue({
            data: { name: 'Kopi Siap Pakai' },
        });

        render(<VoucherCard tokenId={3} onRedeem={mockOnRedeem} onTransfer={mockOnTransfer} />);

        await waitFor(() => {
            fireEvent.click(screen.getByText('Gunakan'));
            expect(mockOnRedeem).toHaveBeenCalledWith(3);
        });
    });

    it('Skenario D: TIDAK memanggil onRedeem untuk voucher yang sudah digunakan', async () => {
        setMockConnector({ accounts: [ownerAddress] });
        axios.get.mockResolvedValue({
            data: { name: 'Kopi Basi' },
        });

        render(<VoucherCard tokenId={4} onRedeem={mockOnRedeem} onTransfer={mockOnTransfer} isRedeemed={true} />);

        await waitFor(() => {
            const redeemButton = screen.getByText('Gunakan');
            expect(redeemButton).toBeDisabled();
            fireEvent.click(redeemButton);
            expect(mockOnRedeem).not.toHaveBeenCalled();
        });
    });
});
